
import Sidebar from "./components/Sidebar";
import "./globals.css";
import type { Metadata } from "next";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "Admin Dashboard to be handled by admins",
  viewport: "width=device-width, initial-scale=1.0",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
    <html lang="en">
      <body style={{
        margin: 0,
        padding: 0,
        minHeight: '100vh'
      }}>
        <Providers>
          <div className="flex flex-col min-h-screen">
            <Sidebar />
            <main className="flex-1 overflow-x-hidden bg-slate-50" style={{ backgroundColor: '#f9fafb' }}>
              <div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8">
                {children}
              </div>
            </main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
