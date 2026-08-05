import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { cloudinary } from "@/lib/cloudinary";

const MAX_BYTES = 15 * 1024 * 1024;
const ALLOWED_TYPES = new Set(["video/mp4", "video/webm", "video/quicktime"]);

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const formData = await req.formData().catch(() => null);
  const file = formData?.get("file");
  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }
  if (!ALLOWED_TYPES.has(file.type)) {
    return NextResponse.json({ error: "Only MP4, WebM or MOV videos are allowed" }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "Video must be under 15MB" }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const dataUri = `data:${file.type};base64,${buffer.toString("base64")}`;

  try {
    const result = await cloudinary.uploader.upload(dataUri, {
      folder: `70tuition/${session.user.id}`,
      resource_type: "video",
    });
    if (result.duration && result.duration > 25) {
      await cloudinary.uploader.destroy(result.public_id, { resource_type: "video" }).catch(() => {});
      return NextResponse.json({ error: "Video must be 25 seconds or shorter." }, { status: 400 });
    }
    return NextResponse.json({ url: result.secure_url });
  } catch (err) {
    console.error("Cloudinary video upload failed", err);
    return NextResponse.json({ error: "Upload failed — please try again." }, { status: 502 });
  }
}
