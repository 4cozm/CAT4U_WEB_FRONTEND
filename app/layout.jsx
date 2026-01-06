import "@blocknote/core/style.css";
import "@blocknote/shadcn/style.css";
import ClientProviders from "../components/ClientProviders.jsx";
import Header from "../components/Header";
import BackgroundVideo from "./BackgroundVideo";
import "@blocknote/xl-ai/style.css";
import "./globals.css";


export const metadata = {
  metadataBase: new URL("https://community.catalyst-for-you.com"),
  title: {
    default: "대물캣 커뮤니티",
    template: "%s | 대물캣 커뮤니티",
  },
  description: "EVE Online 커뮤니티",

  // ✅ Android(PWA)용 manifest 연결
  manifest: "/manifest.webmanifest",

  // ✅ iOS 홈화면 관련(최소)
  appleWebApp: {
    capable: true,
    title: "대물캣 커뮤니티",
    statusBarStyle: "black-translucent",
  },


  icons: {
    apple: "/images/PWA-icon.png",
    icon: "/images/PWA-icon.png",
  },

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
      <head>
        <meta name="color-scheme" content="dark" />
      </head>
      <body className="min-h-screen antialiased" suppressHydrationWarning>
        <BackgroundVideo />
        <ClientProviders>
          <Header />
          <main className="relative mx-auto max-w-7xl px-4 pb-24">{children}</main>
        </ClientProviders>
      </body>
    </html>
  );
}
