"use client";
import type { Metadata } from "next";
import { Manrope, Righteous } from "next/font/google";
import "./globals.css";
import { store } from "@/redux/store";
import { Provider } from "react-redux";
import LoadingPage from "@/components/loading";
import { MainAlert } from "@/components/main-alert";
import { ConfirmModal } from "@/components/confirm";
// const inter = Inter({ subsets: ["latin"] });

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const righteous = Righteous({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-righteous",
});

// export const metadata: Metadata = {
//   title: "Medical Chatbot",
//   description: "Open Source Multimodal Provider",
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html suppressHydrationWarning className={`${righteous.variable} scroll-smooth text-slate-800`} lang="en">
      <body className={manrope.className}>
        <Provider store={store}>
          {children}
          <LoadingPage />
          <MainAlert />
          <ConfirmModal />
        </Provider>
      </body>
    </html>
  );
}
