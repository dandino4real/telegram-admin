
// src/components/NavUser.tsx
'use client';

import { useState } from 'react';
import { LogOutIcon, MoreVerticalIcon, UserCircleIcon } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from '@/components/ui/sidebar';
import { AccountDialog } from './account-dialog';
import { Admin } from '@/store/types/admin';
import { Skeleton } from './ui/skeleton';
import { clearAccessToken, getAccessToken } from '@/lib/authManager';
import { RootState, AppDispatch } from '@/store';
import { clearSession } from '@/store/sessionStore';
import { persistor } from '@/store/store-instance';

function NavUser({
  user,
  isLoading,
}: {
  user: Admin;
  isLoading: boolean;
}) {
  const { isMobile } = useSidebar();
  const [accountDialogOpen, setAccountDialogOpen] = useState(false);
const dispatch = useDispatch<AppDispatch>(); // Add dispatch
  const router = useRouter();
  const refreshToken = useSelector((state: RootState) => state.authSession.refreshToken);

  const handleAccountClick = () => {
    setAccountDialogOpen(true);
  };

  const handleLogout = async () => {
    try {
      // Make POST /auth/logout request to invalidate refreshToken
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-refresh-token': refreshToken || '',
          Authorization: `Bearer ${getAccessToken() || ''}`,
        },
        body: JSON.stringify({ refreshToken }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        console.log('NavUser: Logout API failed:', errorData.message);
      } else {
        console.log('NavUser: Logout API successful');
      }
    } catch (error) {
      console.log('NavUser: Logout API error:', error);
    }

   // Clear Redux state and access token
    dispatch(clearSession()); // Dispatch clearSession action
    clearAccessToken();


      // ADD PERSISTOR PURGE HERE
    try {
      await persistor.purge();
      console.log('NavUser: Persisted state cleared');
    } catch (purgeError) {
      console.log('NavUser: Failed to purge persisted state:', purgeError);
    }

    // Redirect to login page
    console.log('NavUser: Redirecting to /login');
    router.replace('/login');
  };

  if (isLoading) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton
            size="lg"
            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
          >
            <Skeleton className="h-8 w-8 rounded-lg" />
            <div className="grid flex-1 text-left text-sm leading-tight space-y-1">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-32" />
            </div>
            <Skeleton className="h-4 w-4 ml-auto" />
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  return (
    <>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                <Avatar className="h-8 w-8 rounded-lg grayscale">
                  <AvatarImage src={'/placeholder.svg'} alt={user.name} />
                  <AvatarFallback className="rounded-lg">
                    {(user?.name ?? 'NA')
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{user.name}</span>
                  <span className="truncate text-xs text-muted-foreground">{user.email}</span>
                </div>
                <MoreVerticalIcon className="ml-auto size-4" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
              side={isMobile ? 'bottom' : 'right'}
              align="end"
              sideOffset={4}
            >
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={handleAccountClick}>
                  <UserCircleIcon />
                  Account
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOutIcon />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>

      <AccountDialog open={accountDialogOpen} onOpenChange={setAccountDialogOpen} user={user} />
    </>
  );
}

export default NavUser;




