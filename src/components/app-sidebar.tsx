
// // src/components/AppSidebar.tsx
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
//         // {
//         //   title: 'Forex Users',
//         //   url: '/admin/forex-users',
//         //   icon: TrendingUp,
//         // },
//         {
//           title: 'Forex Users',
//           url: '/admin/new-forex-users',
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
//       requiresSuperAdmin: true,
//     },
//   ],
// };

// function AppSidebar() {
//   const router = useRouter();
//   console.log('got here app sidebar')
//   const { adminId, isLoggedIn, isRestoring } = useSession();
//   console.log({adminId, isLoggedIn, isRestoring})
//   const { data: adminProfile, isLoading, isFetching, error } = useGetAdminProfileQuery(
//     adminId ?? skipToken
//   );
//   console.log({adminProfile})


//   React.useEffect(() => {
//     if (!isRestoring && !isLoggedIn) {
//       console.log('AppSidebar: Not logged in, redirecting to /login');
//       router.replace('/login');
//     }
//   }, [isLoggedIn, isRestoring, router]);

//   if (isRestoring) {
//     console.log('AppSidebar: Session restoring, rendering null');
//     return null;
//   }

//   if (!isLoggedIn) {
//     console.log('AppSidebar: Not logged in, rendering null');
//     return null;
//   }

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
//           <div className="px-5">Loading...</div>
//         ) : error ? (
//           <div className="px-5 text-red-500">Error loading profile</div>
//         ) : adminProfile ? (
//           <NavUser user={adminProfile} isLoading={isLoading} />
//         ) : (
//           <div className="px-5">No profile data</div>
//         )}
//       </SidebarFooter>
//     </Sidebar>
//   );
// }

// export default AppSidebar;



'use client';

import { Bot, DollarSign, Home, TrendingUp, UsersIcon, Trophy } from 'lucide-react';
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
  SidebarFooter,
} from '@/components/ui/sidebar';
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
          url: '/admin/new-forex-users',
          icon: TrendingUp,
        },
        {
          title: 'Trade Challenge',
          url: '/admin/trade-challenge',
          icon: Trophy,
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

// Define AdminRole type to match the expected values
type AdminRole = 'crypto_admin' | 'forex_admin' | 'admin' | 'superadmin';

function AppSidebar() {
  const router = useRouter();
  const { adminId, isLoggedIn, isRestoring } = useSession();
  const { data: adminProfile, isLoading, isFetching, error } =
    useGetAdminProfileQuery(adminId ?? skipToken);

  React.useEffect(() => {
    if (!isRestoring && !isLoggedIn) {
      router.replace('/login');
    }
  }, [isLoggedIn, isRestoring, router]);

  if (isRestoring || !isLoggedIn) return null;

  // ✅ Role-based menu filtering logic
  const filteredNavMain = data.navMain
    .map((item) => {
      if (item.title === 'User Management' && item.items) {
        let allowedItems: typeof item.items = [];

        switch (adminProfile?.role as AdminRole) {
          case 'crypto_admin':
            allowedItems = item.items.filter(
              (i) => i.url === '/admin/crypto-users'
            );
            break;
          case 'forex_admin':
            allowedItems = item.items.filter(
              (i) => i.url === '/admin/new-forex-users'
            );
            break;
          case 'admin':
            allowedItems = item.items.filter(
              (i) =>
                i.url === '/admin/crypto-users' ||
                i.url === '/admin/new-forex-users' ||
                i.url === '/admin/trade-challenge'
            );
            break;
          case 'superadmin':
            allowedItems = item.items;
            break;
          default:
            allowedItems = [];
        }

        return { ...item, items: allowedItems };
      }

      return item;
    })
    .filter(
      (item) =>
        !item.requiresSuperAdmin || adminProfile?.role === 'superadmin'
    );

  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent"
            >
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
