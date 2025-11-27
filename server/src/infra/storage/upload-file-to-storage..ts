import { Upload } from "@aws-sdk/lib-storage";
import { randomUUID } from "node:crypto";
import { Readable } from "node:stream";
import { z } from "zod";
import { r2 } from "./client";
import { env } from "../../env";

const uploadFileToStorageInput = z.object({
  folder: z.enum(["downloads"]),
  fileName: z.string(),
  contentType: z.string(),
  contentStream: z.instanceof(Readable),
});

type UploadFileToStorageInput = z.input<typeof uploadFileToStorageInput>;

export async function uploadFileToStorage(input: UploadFileToStorageInput) {
  const { contentStream, contentType, fileName, folder } =
    uploadFileToStorageInput.parse(input);

  const uniqueFileName = `${folder}/${randomUUID()}-${fileName}`;

  const upload = new Upload({
    client: r2,
    params: {
      Key: uniqueFileName,
      Bucket: env.CLOUDFLARE_BUCKET,
      Body: contentStream,
      ContentType: contentType,
    },
  });

  await upload.done();

  return {
    key: uniqueFileName,
    url: new URL(uniqueFileName, env.CLOUDFLARE_PUBLIC_URL).toString(),
  };
}
