import "@blocknote/core/style.css";
import "@blocknote/shadcn/style.css";
import ClientProviders from "../components/ClientProviders.jsx";
import Header from "../components/Header";
import BackgroundVideo from "./BackgroundVideo";
import "./globals.css";
import AuthSplashGate from "@/components/AuthSplashGate.jsx";

export const metadata = {
  metadataBase: new URL("https://community.catalyst-for-you.com"),
  title: {
    default: "대물캣 커뮤니티",
    template: "%s | 대물캣 커뮤니티",
  },
  description: "EVE Online 커뮤니티",

  openGraph: {
    type: "website",
    siteName: "대물캣 커뮤니티",
    locale: "ko_KR",
    title: "대물캣 커뮤니티",
    description: "EVE Online 커뮤니티",
    images: [
      {
        url: "/og/newYear.webp",
        width: 1229,
        height: 819,
        alt: "대물캣 커뮤니티",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "대물캣 커뮤니티",
    description: "EVE Online 커뮤니티",
    images: ["/og/newYear.webp"],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className="min-h-screen antialiased" suppressHydrationWarning>
        <AuthSplashGate/>
        <BackgroundVideo />
        <ClientProviders>
          <Header />
          <main className="relative mx-auto max-w-5xl px-4 pb-24">{children}</main>
        </ClientProviders>
      </body>
    </html>
  );
}
