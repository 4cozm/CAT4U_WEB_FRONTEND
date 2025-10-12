export const XSS_PATTERNS = [
    { name: "<script>", regex: /<\s*script/i },
    { name: "javascript:", regex: /javascript\s*:/i },
    { name: "inline event (on...=)", regex: /on\w+\s*=/i }, // onclick= 등
    { name: "<iframe>", regex: /<\s*iframe/i },
    { name: "<img>", regex: /<\s*img/i },
    { name: "<svg>", regex: /<\s*svg/i },
    { name: "data:", regex: /data\s*:/i },
];

/**
 * 입력값(문자열 또는 객체/배열)을 검사하여 XSS 위험 패턴 여부를 판단.
 * @param {string|object} input
 * @returns {{ ok: boolean, found: Array<{name: string, match: string}>, names: string[] }}
 */
export function detectXssPatterns(input) {
    const found = [];
    if (input == null) return { ok: true, found, names: [] };

    // JSON 문서일 수 있으므로 문자열화
    const s = typeof input === "string" ? input : JSON.stringify(input);

    for (const pat of XSS_PATTERNS) {
    const m = s.match(pat.regex);
    if (m) found.push({ name: pat.name, match: m[0] });
    }
    const names = [...new Set(found.map((f) => f.name))];
    return { ok: found.length === 0, found, names };
}