import TagPill from './TagPill';

export default function CategoryPills({ category, categories }) {
    // 단일 문자열/배열 모두 지원
    const list = categories ?? category;
    const raw = Array.isArray(list) ? list : [list];
    const unique = [...new Set(raw.filter(Boolean))].slice(0, 3); // 중복 제거 + 최대 3개

    if (unique.length === 0) return null;

    return (
        <div className="mt-2 flex flex-wrap gap-1.5">
            {unique.map(tag => (
                <TagPill key={tag}>{tag}</TagPill>
            ))}
        </div>
    );
}
