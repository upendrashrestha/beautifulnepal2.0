import { BaseSpecParams, PaginatedResponse } from "@/types";
import { Picture } from "@/types/picture.types";
import api from "./api";

const pictureService = {
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

    const res = await api.get<PaginatedResponse<Picture>>(
      `/pictures?${query.toString()}`,
    );

    return res.data;
  },

  getPictureById: async (id: string): Promise<Picture> => {
    const res = await api.get<Picture>(`/pictures/${id}`);
    return res.data;
  },

  uploadPicture: async (data: Picture): Promise<Picture> => {
    if (!data.file || !(data.file instanceof File)) {
      throw new Error("No valid file provided");
    }

    const form = new FormData();
    form.append("name", data.name);
    form.append("description", data.description ?? "");
    if (data.clientId) form.append("clientId", data.clientId.toString());
    form.append("file", data.file, data.file.name);

    // Use postFormData helper instead of post
    const res = await api.postFormData<Picture>("/pictures/upload", form);
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

    // Use postFormData helper instead of post
    const res = await api.postFormData<Picture>("/pictures", form);
    return res.data;
  },

  deletePicture: async (publicId: string): Promise<boolean> => {
    const res = await api.delete<boolean>(
      `/pictures?publicId=${encodeURIComponent(publicId)}`,
    );
    return res.data;
  },
};

export default pictureService;
