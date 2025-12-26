export async function uploadFile(file) {
  console.log("[BlockNote] uploadFile called:", {
    name: file?.name,
    type: file?.type,
    size: file?.size,
  });

  // 업로드는 아직 안 함. 호출 확인용 더미 URL.
  // 이미지 블록이면 이 URL로 렌더를 시도한다.
  return "https://placehold.co/600x400/png";
}