//브라우저가 보통 MD5 지원 안하는 경우가 많아서 별도 패키지로 사용

import SparkMD5 from "spark-md5";

export async function calcFileMd5(file) {
  const chunkSize = 2 * 1024 * 1024; // 2MB
  const spark = new SparkMD5.ArrayBuffer();

  let offset = 0;

  while (offset < file.size) {
    const slice = file.slice(offset, offset + chunkSize);
    const buf = await slice.arrayBuffer();
    spark.append(buf);
    offset += chunkSize;
  }

  return spark.end(); // hex string
}
