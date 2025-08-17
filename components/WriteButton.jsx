/**
 * 아주 단순한 글쓰기 버튼 컴포넌트
 * - 페이지에서 category 문자열만 넘겨주세요 (예: 'guide', 'market', 'fitting', 'doctrine')
 * - 클릭 시 `/${category}/new` 로 이동합니다. (라우터 없이도 동작)
 */

import { TfiWrite } from "react-icons/tfi";

export default function WriteButton({ category, className = '', children }) {
    const label = children ?? '글쓰기';
    const href = `/BlockNote?category=${category}`;

    return (
        <a
            href={href}
            className={`inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-blue-700 active:scale-[.98] ${className}`}
            aria-label={`${category}에 ${label}`}
        >
            <TfiWrite />
            <span>{label}</span>
        </a>
    );
}
