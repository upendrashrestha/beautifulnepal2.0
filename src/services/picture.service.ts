import { BaseSpecParams, PaginatedResponse } from "../../types";
import { Picture } from "../../types/picture.types";
import api from "./api";
import { withCache, clearCache } from "@/utils/cache";

const pictureService = {
  /** =====================
   * GET LIST (cached)
   * ===================== */
  getPictures: async (
    params: BaseSpecParams,
  ): Promise<PaginatedResponse<Picture>> => {
    const query = new URLSearchParams();

    if (params?.pageIndex)
      query.append("PageIndex", params.pageIndex.toString());
    if (params?.pageSize) query.append("PageSize", params.pageSize.toString());
    if (params?.search) query.append("Search", params.search);
    if (params?.clientId) query.append("ClientId", params.clientId);
    if (params?.publicId) query.append("PublicId", params.publicId);

    const cacheKey = `pictures:list:${query.toString()}`;

    return withCache(cacheKey, async () => {
      const res = await api.get<PaginatedResponse<Picture>>(
        `/pictures?${query.toString()}`,
      );
      return res.data;
    });
  },

  /** =====================
   * GET DETAIL (cached)
   * ===================== */
  getPictureById: async (id: string): Promise<Picture> => {
    const cacheKey = `pictures:detail:${id}`;

    return withCache(cacheKey, async () => {
      const res = await api.get<Picture>(`/pictures/${id}`);
      return res.data;
    });
  },

  /** =====================
   * UPLOAD / CREATE (invalidate cache)
   * ===================== */
  uploadPicture: async (data: Picture): Promise<Picture> => {
    if (!data.file || !(data.file instanceof File)) {
      throw new Error("No valid file provided");
    }

    const form = new FormData();
    form.append("name", data.name);
    form.append("description", data.description ?? "");
    if (data.clientId) form.append("clientId", data.clientId.toString());
    form.append("file", data.file, data.file.name);

    const res = await api.postFormData<Picture>("/pictures/upload", form);

    // invalidate list cache
    await clearCache("pictures:list:");

    return res.data;
  },

  uploadClientPicture: async (data: Picture): Promise<Picture> => {
    if (!data.file || !(data.file instanceof File)) {
      throw new Error("No valid file provided");
    }

    const form = new FormData();
    form.append("name", data.name);
    form.append("description", data.description ?? "");
    if (data.clientId) form.append("clientId", data.clientId.toString());
    form.append("file", data.file, data.file.name);

    const res = await api.postFormData<Picture>("/pictures", form);

    await clearCache("pictures:list:");

    return res.data;
  },

  /** =====================
   * DELETE (invalidate cache)
   * ===================== */
  deletePicture: async (publicId: string): Promise<boolean> => {
    const res = await api.delete<boolean>(
      `/pictures?publicId=${encodeURIComponent(publicId)}`,
    );

    await clearCache(`pictures:detail:${publicId}`);
    await clearCache("pictures:list:PageIndex=1&PageSize=50");

    return res.data;
  },
};

export default pictureService;
