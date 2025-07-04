'use client';

import dynamic from 'next/dynamic';

// Dynamically import AppSidebar to ensure client-side rendering
const AppSidebar = dynamic(() => import('@/components/app-sidebar').then(mod => mod.default), {
  ssr: false,
});

export default function ClientSidebarWrapper() {
  return <AppSidebar />;
}