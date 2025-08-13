import Header from '@/components/Header';
import BackgroundVideo from './BackgroundVideo';
import './globals.css';

export const metadata = {
    title: '대물캣 커뮤니티',
    description: '대구,물고기,캣포유의 EVE ONLINE 커뮤니티 사이트 입니다',
    icons: { icon: '/favicon.png' },
};

export default function RootLayout({ children }) {
    return (
        <html lang="ko">
            <body className="min-h-screen antialiased">
                <BackgroundVideo />
                <Header />
                <main className="relative mx-auto max-w-5xl px-4 pb-24 pt-28">{children}</main>
            </body>
        </html>
    );
}
