//파일 URL 발급 , 처리 , 업로드 총괄

import { calcFileMd5 } from "./calcFileMd5.js";
import { fetchWithTimeout } from "./fetchWithTimeout.js";
import { requestS3UploadUrl } from "./requestS3UploadUrl.js";

export async function uploadFile(file) {
  const fileMd5 = await calcFileMd5(file);

  const meta = {
    fileName: file.name,
    fileSize: file.size,
    fileType: file.type || "application/octet-stream",
    fileMd5,
  };

  const data = await requestS3UploadUrl(meta);
  const { uploadUrl, fileUrl, status } = data;

  if (!uploadUrl || !fileUrl) {
    throw new Error("presign 발급 응답 에러 발생");
  }

  const putRes = await fetchWithTimeout(
    uploadUrl,
    {
      method: "PUT",
      body: file,
    },
    30000
  );

  if (!putRes.ok) {
    const body = await putRes.text().catch(() => "");
    console.log("[S3 PUT ERROR]", {
      status: putRes.status,
      statusText: putRes.statusText,
      amzRequestId: putRes.headers.get("x-amz-request-id"),
      amzId2: putRes.headers.get("x-amz-id-2"),
      body,
    });
    throw new Error(`${putRes.status}`);
  }

  return fileUrl;
}
