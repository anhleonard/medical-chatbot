'use client'

import { ContextProvider } from "@/context/context";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ContextProvider>
      {children}
    </ContextProvider>
  );
}
