import Sidebar from "../_components/sidebar";
import NextAuthProvider from "@/context/next-auth-provider";
import { ScrollArea } from "@/components/ui/scroll-area";
import SidebarSwitcher from "../_components/sidebar-switcher";
import { ContextProvider } from "@/context/context";

export default function UserLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-screen relative">
      {/* <NextAuthProvider> */}
      <ContextProvider>
        <Sidebar />
        <main className="flex-1 overflow-y-auto">
          <ScrollArea className="h-screen relative">
            <SidebarSwitcher />
            {children}
          </ScrollArea>
        </main>
      </ContextProvider>
      {/* </NextAuthProvider> */}
    </div>
  );
}
