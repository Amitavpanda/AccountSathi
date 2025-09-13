


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
      
        <body style={{
          display: 'flex',
          flexDirection: 'row',
          margin: 0,
          padding: 0,
          minHeight: '100vh'
        }}>
          <Sidebar />
          <main style={{
            flex: 1,
            backgroundColor: '#f9fafb',
            minHeight: '100vh'
          }}>

            {children}
            
          </main>
        </body>
      

    </html>


  );
}
