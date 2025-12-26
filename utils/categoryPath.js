//동적 주소 로딩을 정적 빌드에서도 쓸 수 있도록 미리 알려주는 역할

export const CATEGORY_MAP = {
  guide: {
    id: "guide",
    name: "가이드",
    label: "GUIDE", // DB 전송용 (대문자)
  },
  doctrine: {
    id: "doctrine",
    name: "독트린",
    label: "DOCTRINE",
  },
  fitting: {
    id: "fitting",
    name: "피팅",
    label: "FITTING",
  },
  market: {
    id: "market",
    name: "장터",
    label: "MARKET",
  },
};

// Next.js 정적 경로 생성을 위한 헬퍼 함수
export const getCategoryParams = () => {
  return Object.keys(CATEGORY_MAP).map((key) => ({
    category: key,
  }));
};
