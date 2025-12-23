import "@blocknote/core/style.css";
import "@blocknote/shadcn/style.css";
import ClientProviders from "../components/ClientProviders.jsx";
import Header from "../components/Header";
import BackgroundVideo from "./BackgroundVideo";
import "./globals.css";

export const metadata = {
  title: "대물캣 커뮤니티",
  description: "대구,물고기,캣포유의 EVE ONLINE 커뮤니티 사이트 입니다",
  icons: { icon: "/favicon.png" },
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className="min-h-screen antialiased" suppressHydrationWarning>
        <BackgroundVideo />
        <ClientProviders>
          <Header />
          <main className="relative mx-auto max-w-5xl px-4 pb-24 pt-28">{children}</main>
        </ClientProviders>
      </body>
    </html>
  );
}
