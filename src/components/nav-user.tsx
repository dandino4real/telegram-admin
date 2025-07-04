

'use client';

import { useState } from 'react';
import { LogOutIcon, MoreVerticalIcon, UserCircleIcon } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { logout } from '@/store/slices/authSlice';
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

 function NavUser({
    user,
    isLoading,
}: {
    user: Admin;
    isLoading: boolean;
}) {
    const { isMobile } = useSidebar();
    const [accountDialogOpen, setAccountDialogOpen] = useState(false);
    const dispatch = useDispatch();
    const router = useRouter();

    const handleAccountClick = () => {
        setAccountDialogOpen(true);
    };

    const handleLogout = async () => {
        try {
            // Make POST /auth/logout request to invalidate refreshToken
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include', // Send refreshToken cookie
            });
            if (!response.ok) {
                const errorData = await response.json();
                console.error('NavUser: Logout API failed:', errorData.message);
            }
        } catch (error) {
            console.error('NavUser: Logout API error:', error);
        }

        // Dispatch logout action to clear state and localStorage/cookie
        dispatch(logout());

        // Redirect to login page
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