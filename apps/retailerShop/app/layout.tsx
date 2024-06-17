


import Sidebar from "./components/Sidebar";
import "./globals.css";
import type { Metadata } from "next";


export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "Admin Dashboard to be handled by admins",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (

    <html lang="en">
      
        <body className="flex flex-row ">
          <Sidebar />
          <main className="flex-1 bg-gray-10 min-h-screen">

            {children}
            
          </main>
        </body>
      

    </html>


  );
}
