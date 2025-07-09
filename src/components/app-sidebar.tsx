
// 'use client';

// import { Bot, DollarSign, Home, TrendingUp, UsersIcon } from 'lucide-react';
// import React from 'react';
// import {
//   Sidebar,
//   SidebarContent,
//   SidebarGroup,
//   SidebarGroupContent,
//   SidebarGroupLabel,
//   SidebarHeader,
//   SidebarMenu,
//   SidebarMenuButton,
//   SidebarMenuItem,
//   SidebarRail,
// } from '@/components/ui/sidebar';
// import { SidebarFooter } from '@/components/ui/sidebar';
// import NavUser from './nav-user';
// import { useSession } from '@/hooks/use-session';
// import { useRouter } from 'next/navigation';
// import { useGetAdminProfileQuery } from '@/store/api';
// import { skipToken } from '@reduxjs/toolkit/query';
// import Link from 'next/link';

// const data = {
//   navMain: [
//     {
//       title: 'Dashboard',
//       url: '/admin',
//       icon: Home,
//     },
//     {
//       title: 'User Management',
//       items: [
//         {
//           title: 'Crypto Users',
//           url: '/admin/crypto-users',
//           icon: DollarSign,
//         },
//         {
//           title: 'Forex Users',
//           url: '/admin/forex-users',
//           icon: TrendingUp,
//         },
//       ],
//     },
//     {
//       title: 'Admin Management',
//       items: [
//         {
//           title: 'Admin Management',
//           url: '/admin/admin-management',
//           icon: UsersIcon,
//         },
//       ],
//       requiresSuperAdmin: true, // Flag to restrict to superadmin
//     },
//   ],
// };

// function AppSidebar() {
//   const router = useRouter();
//   const { adminId, isLoggedIn, isRestoring } = useSession();
//   const { data: adminProfile, isLoading, isFetching } = useGetAdminProfileQuery(
//     adminId ?? skipToken
//   );

// console.log('isLogging', isLoading)
// console.log('isRestoring', isRestoring)
// console.log('isFetching', isFetching)

//   React.useEffect(() => {
//     if (!isLoggedIn && !isRestoring && !isFetching) {
//       router.replace('/login');
//     }
//   }, [isLoggedIn, isRestoring, isFetching, router]);

//   if (!isLoggedIn || isRestoring) return null;

//   // Filter navMain to show Admin Management only for superadmin
//   const filteredNavMain = data.navMain.filter(
//     (item) => !item.requiresSuperAdmin || (adminProfile?.role === 'superadmin')
//   );

//   return (
//     <Sidebar>
//       <SidebarHeader>
//         <SidebarMenu>
//           <SidebarMenuItem>
//             <SidebarMenuButton size="lg" className="data-[state=open]:bg-sidebar-accent">
//               <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
//                 <Bot className="size-4" />
//               </div>
//               <div className="flex flex-col gap-0.5 leading-none">
//                 <span className="font-semibold">Afibie Admin</span>
//                 <span className="text-xs">Bot Management</span>
//               </div>
//             </SidebarMenuButton>
//           </SidebarMenuItem>
//         </SidebarMenu>
//       </SidebarHeader>
//       <SidebarContent>
//         {filteredNavMain.map((item) => (
//           <SidebarGroup key={item.title}>
//             <SidebarGroupLabel>{item.title}</SidebarGroupLabel>
//             <SidebarGroupContent>
//               <SidebarMenu>
//                 {item.url ? (
//                   <SidebarMenuItem>
//                     <SidebarMenuButton asChild>
//                       <Link href={item.url}>
//                         <item.icon />
//                         {item.title}
//                       </Link>
//                     </SidebarMenuButton>
//                   </SidebarMenuItem>
//                 ) : (
//                   item.items?.map((subItem) => (
//                     <SidebarMenuItem key={subItem.title}>
//                       <SidebarMenuButton asChild>
//                         <Link href={subItem.url}>
//                           <subItem.icon />
//                           {subItem.title}
//                         </Link>
//                       </SidebarMenuButton>
//                     </SidebarMenuItem>
//                   ))
//                 )}
//               </SidebarMenu>
//             </SidebarGroupContent>
//           </SidebarGroup>
//         ))}
//       </SidebarContent>
//       <SidebarRail />
//       <SidebarFooter>
//         {isLoading || isFetching ? (
//           <div className='px-5 '>Loading...</div>
//         ) : adminProfile ? (
//           <NavUser user={adminProfile} isLoading={isLoading} />
//         ) : null}
//       </SidebarFooter>
//     </Sidebar>
//   );
// }

// export default AppSidebar;





// src/components/AppSidebar.tsx
'use client';

import { Bot, DollarSign, Home, TrendingUp, UsersIcon } from 'lucide-react';
import React from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '@/components/ui/sidebar';
import { SidebarFooter } from '@/components/ui/sidebar';
import NavUser from './nav-user';
import { useSession } from '@/hooks/use-session';
import { useRouter } from 'next/navigation';
import { useGetAdminProfileQuery } from '@/store/api';
import { skipToken } from '@reduxjs/toolkit/query';
import Link from 'next/link';

const data = {
  navMain: [
    {
      title: 'Dashboard',
      url: '/admin',
      icon: Home,
    },
    {
      title: 'User Management',
      items: [
        {
          title: 'Crypto Users',
          url: '/admin/crypto-users',
          icon: DollarSign,
        },
        {
          title: 'Forex Users',
          url: '/admin/forex-users',
          icon: TrendingUp,
        },
      ],
    },
    {
      title: 'Admin Management',
      items: [
        {
          title: 'Admin Management',
          url: '/admin/admin-management',
          icon: UsersIcon,
        },
      ],
      requiresSuperAdmin: true,
    },
  ],
};

function AppSidebar() {
  const router = useRouter();
  const { adminId, isLoggedIn, isRestoring } = useSession();
  const { data: adminProfile, isLoading, isFetching, error } = useGetAdminProfileQuery(
    adminId ?? skipToken
  );

  console.log('AppSidebar: isLoading:', isLoading);
  console.log('AppSidebar: isRestoring:', isRestoring);
  console.log('AppSidebar: isFetching:', isFetching);
  console.log('AppSidebar: adminProfile:', adminProfile);
  console.log('AppSidebar: error:', error);

  React.useEffect(() => {
    if (!isRestoring && !isLoggedIn) {
      console.log('AppSidebar: Not logged in, redirecting to /login');
      router.replace('/login');
    }
  }, [isLoggedIn, isRestoring, router]);

  if (isRestoring) {
    console.log('AppSidebar: Session restoring, rendering null');
    return null;
  }

  if (!isLoggedIn) {
    console.log('AppSidebar: Not logged in, rendering null');
    return null;
  }

  const filteredNavMain = data.navMain.filter(
    (item) => !item.requiresSuperAdmin || (adminProfile?.role === 'superadmin')
  );

  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" className="data-[state=open]:bg-sidebar-accent">
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <Bot className="size-4" />
              </div>
              <div className="flex flex-col gap-0.5 leading-none">
                <span className="font-semibold">Afibie Admin</span>
                <span className="text-xs">Bot Management</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {filteredNavMain.map((item) => (
          <SidebarGroup key={item.title}>
            <SidebarGroupLabel>{item.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {item.url ? (
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link href={item.url}>
                        <item.icon />
                        {item.title}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ) : (
                  item.items?.map((subItem) => (
                    <SidebarMenuItem key={subItem.title}>
                      <SidebarMenuButton asChild>
                        <Link href={subItem.url}>
                          <subItem.icon />
                          {subItem.title}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))
                )}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarRail />
      <SidebarFooter>
        {isLoading || isFetching ? (
          <div className="px-5">Loading...</div>
        ) : error ? (
          <div className="px-5 text-red-500">Error loading profile</div>
        ) : adminProfile ? (
          <NavUser user={adminProfile} isLoading={isLoading} />
        ) : (
          <div className="px-5">No profile data</div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}

export default AppSidebar;