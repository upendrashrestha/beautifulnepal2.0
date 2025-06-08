// app/api/upload-image/route.ts
import { NextResponse } from "next/server";
import { serverClient as client } from "@/sanity/lib/serverclient";
export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { message: "No file uploaded" },
        { status: 400 }
      );
    }

    // Convert File to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to Sanity. Sanity assets are immediately available on the CDN.
    // There isn't a direct "draft" concept for assets themselves in the same way
    // documents have. The asset is either uploaded or not.
    // Its visibility is tied to the document that references it.
    const imageAsset = await client.assets.upload("image", buffer, {
      filename: file.name,
      contentType: file.type,
      // You could potentially add metadata here if your Sanity asset schema supports it
      // For example, if you've extended the asset schema to include a 'isDraft' field:
      // metadata: {
      //   isDraft: true // This would require a custom Sanity asset schema modification
      // }
    });

    // imageAsset._id will be in the format 'image-YOUR_ASSET_ID-resolution-extension'
    // We only need the part after 'image-' for _ref
    const assetId = imageAsset._id;

    return NextResponse.json({ imageUrl: assetId }, { status: 200 });
  } catch (error: unknown) {
    console.error("Error uploading image to Sanity:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { message: "Error uploading image", error: errorMessage },
      { status: 500 }
    );
  }
}
