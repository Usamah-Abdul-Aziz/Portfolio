import "@fontsource/fraunces/400.css";
import "@fontsource/fraunces/500.css";
import "@fontsource/fraunces/600.css";
import "@fontsource/fraunces/400-italic.css";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/jetbrains-mono/400.css";
import "@fontsource/jetbrains-mono/500.css";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import Thread from "@/components/Thread";

const siteUrl = "https://usamah.is-a.dev/";

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: "Usamah Abdul Aziz — Software Engineer & Full-Stack Developer",
  description:
    "Portfolio of Usamah Abdul Aziz (Adams) — Informatics Engineering student at UNTIRTA. Full-stack development, project management, and business analysis.",
  openGraph: {
    title: "Usamah Abdul Aziz — Software Engineer & Full-Stack Developer",
    description:
      "Portfolio of Usamah Abdul Aziz (Adams) — Informatics Engineering student at UNTIRTA. Full-stack development, project management, and business analysis.",
    url: siteUrl,
    siteName: "Usamah Abdul Aziz",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Usamah Abdul Aziz — Software Engineer & Full-Stack Developer",
    description:
      "Portfolio of Usamah Abdul Aziz (Adams) — Informatics Engineering student at UNTIRTA. Full-stack development, project management, and business analysis.",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-paper text-ink">
        <SmoothScroll>
          <Thread />
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}
