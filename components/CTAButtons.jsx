'use client';

import NeumorphicButton from '@/components/NeumorphicButton';

export default function CTAButtons() {
    return (
        <div className="mt-6 flex flex-wrap gap-3">
            <NeumorphicButton label="디스코드 참여" onClick={() => alert('디스코드 링크 연결 예정')} />
            <NeumorphicButton label="로그인" variant="secondary" onClick={() => alert('OAuth 연동 예정')} />
        </div>
    );
}
