// import type React from "react"
// import type { Metadata } from "next"
// import { SidebarProvider } from "@/components/ui/sidebar"
// import { AppSidebar } from "@/components/app-sidebar"


// export const metadata: Metadata = {
//   title: "Afibie Bot Admin Dashboard",
//   description: "Admin dashboard for Telegram referral bot management",
// }

// export default function RootLayout({
//   children,
// }: {
//   children: React.ReactNode
// }) {
//   return (
//     <div>
//         <SidebarProvider>
//           <AppSidebar />
//           {children}
//         </SidebarProvider>
//     </div>
//   )
// }


// // 'use client';

// // import { SidebarProvider } from '@/components/ui/sidebar';
// // import dynamic from 'next/dynamic';
// // import { ReactNode } from 'react';

// // // Correct dynamic import with .default and ssr: false
// // const AppSidebar = dynamic(() => import('@/components/app-sidebar').then((mod) => mod.default), {
// //   ssr: false, // Disable SSR since AppSidebar uses client-side hooks
// // });

// // export default function RootLayout({ children }: { children: ReactNode }) {
// //   return (
// //         <div>
// //           <SidebarProvider>
// //             <AppSidebar />
// //             {children}
// //           </SidebarProvider>
// //         </div>
// //   );
// // }

import type React from 'react';
import type { Metadata } from 'next';
import { SidebarProvider } from '@/components/ui/sidebar';
import ClientSidebarWrapper from '@/components/sidebarWrapper';

export const metadata: Metadata = {
  title: 'Afibie Bot Admin Dashboard',
  description: 'Admin dashboard for Telegram referral bot management',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
        <div>
          <SidebarProvider>
            <ClientSidebarWrapper />
            {children}
          </SidebarProvider>
        </div>
  );
}