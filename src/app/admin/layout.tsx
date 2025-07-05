
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