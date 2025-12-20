// 파일 URL 발급, 처리, 업로드 총괄

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

  // 1. 서버로부터 Presigned POST 데이터(url, fields)를 받아옴
  const data = await requestS3UploadUrl(meta);
  const { uploadUrl, fields, fileUrl } = data; 

  if (!uploadUrl || !fileUrl || !fields) {
    throw new Error("presign 발급 응답 에러 발생");
  }

  // 2. S3 업로드를 위한 FormData 생성
  const formData = new FormData();

  // 중요: 서버에서 받은 인증 필드들을 순서대로 담아야 함
  Object.entries(fields).forEach(([key, value]) => {
    formData.append(key, value);
  });

  // 중요: 실제 파일 데이터는 반드시 마지막에 추가해야 함 (S3 규약)
  formData.append("file", file);

  // 3. fetchWithTimeout을 사용하여 POST 방식으로 전송
  const postRes = await fetchWithTimeout(
    uploadUrl,
    {
      method: "POST",
      body: formData, 
    },
    30000
  );

  if (!postRes.ok) {
    const body = await postRes.text().catch(() => "");
    console.log("[S3 POST ERROR]", {
      status: postRes.status,
      statusText: postRes.statusText,
      amzRequestId: postRes.headers.get("x-amz-request-id"),
      amzId2: postRes.headers.get("x-amz-id-2"),
      body, // S3가 거부한 이유(용량 초과 등)가 여기에 XML 형태로 들어있음
    });
    throw new Error(`${postRes.status}`);
  }

  return fileUrl;
}
