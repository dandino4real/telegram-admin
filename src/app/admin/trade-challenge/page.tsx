'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
    CheckCircle, XCircle, Clock, MoreHorizontal,
    Trash, Search, ChevronLeft, ChevronRight, ChevronFirst, ChevronLast, Copy, Check
} from 'lucide-react';
import {
    Card, CardHeader, CardTitle, CardDescription, CardContent
} from '@/components/ui/card';
import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import {
    Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList,
    BreadcrumbPage, BreadcrumbSeparator
} from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem,
    DropdownMenuTrigger, DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { format } from 'date-fns';
import {
    useGetAfibe10XUsersQuery,
    useApproveAfibe10XUserMutation,
    useRejectAfibe10XUserMutation,
    useDeleteAfibe10XUserMutation,
    useGetAdminProfileQuery,
} from '@/store/api';
import { Afibe10XUser } from '@/store/types/afibe10xUser';
import { useSession } from '@/hooks/use-session';
import { truncate } from '@/lib/utils';
import { ChatDialog } from './component/chatDialog';

const ITEMS_PER_PAGE = 20;

// Custom Pagination Hook
const usePagination = (total: number, currentPage: number, itemsPerPage: number) => {
    return useMemo(() => {
        const totalPages = Math.max(1, Math.ceil(total / itemsPerPage));
        const startPage = Math.max(1, currentPage - 2);
        const endPage = Math.min(totalPages, startPage + 4);
        const pages = Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
        return { totalPages, pages };
    }, [total, currentPage, itemsPerPage]);
};

// Memoized TableRow Component
const TableRowMemo = React.memo(({ user, onCopy, setConfirmAction, handleOpenChat }: {
    user: Afibe10XUser;
    onCopy: (text: string) => void;
    setConfirmAction: (action: { type: string; user: Afibe10XUser } | null) => void;
    handleOpenChat: (user: Afibe10XUser) => void;
}) => {
    const [copiedId, setCopiedId] = useState<string | null>(null);

    const handleCopy = (text: string) => {
        onCopy(text);
        setCopiedId(text);
        setTimeout(() => setCopiedId(null), 2000);
    };

    return (
        <TableRow>
            <TableCell>
                <StatusBadge label="Status" status={user.status} />
            </TableCell>
            <TableCell>
                <div className="font-medium"> {truncate(user.fullName ?? user.username ?? user.telegramId ?? 'Unknown', 20)} </div>
                <div className="text-xs text-muted-foreground">@{user.username || 'No username'}</div>
            </TableCell>
            <TableCell>
                <div className="flex items-center gap-2">
                    <span>{user.userId || 'N/A'}</span>
                    {user.userId && (
                        <button
                            onClick={() => handleCopy(user.userId!)}
                            className="text-muted-foreground hover:text-primary"
                            aria-label={`Copy UID ${user.userId}`}
                        >
                            {copiedId === user.userId ? <Check size={16} /> : <Copy size={16} />}
                        </button>
                    )}
                </div>
            </TableCell>
            <TableCell>{user.createdAt ? format(new Date(user.createdAt), 'dd/MM/yyyy') : '-'}</TableCell>

            <TableCell>
                <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleOpenChat(user)}
                    className="relative"
                >
                    Chat
                    {user.messages && user.messages.length > 0 && (() => {
                        const lastMsg = user.messages[user.messages.length - 1];
                        return lastMsg.sender === 'user' && !lastMsg.readByAdmin;
                    })() && (
                            <span className="absolute top-0 right-0 h-3 w-3">
                                <span className="absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75 animate-ping"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-600"></span>
                            </span>
                        )
                    }
                </Button>
            </TableCell>
            <TableCell>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                            <MoreHorizontal />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        {user.status === 'pending' && (
                            <>
                                <DropdownMenuItem onClick={() => setConfirmAction({ type: 'approve', user })}>
                                    <CheckCircle className="mr-2 w-4 h-4 text-green-600" />
                                    Approve User
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setConfirmAction({ type: 'reject', user })}>
                                    <XCircle className="mr-2 w-4 h-4 text-red-600" />
                                    Reject User
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                            </>
                        )}
                        <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => setConfirmAction({ type: 'delete', user })}
                        >
                            <Trash className="mr-2 w-4 h-4" />
                            Delete User
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </TableCell>
        </TableRow>
    );
});

TableRowMemo.displayName = 'TableRowMemo';

export default function TradeChallengePage() {
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
    const [page, setPage] = useState(1);
    const [confirmAction, setConfirmAction] = useState<{ type: string; user: Afibe10XUser } | null>(null);
    const [rejectionReason, setRejectionReason] = useState<'' | 'no_deposit' | 'wrong_link'>('');

    const [selectedChatUser, setSelectedChatUser] = useState<Afibe10XUser | null>(null);

    const { adminId } = useSession();
    const { data: adminData, isLoading: isAdminLoading, error: adminError } = useGetAdminProfileQuery(adminId || '', {
        skip: !adminId,
    });

    const { data, isLoading, refetch, error: usersError, isFetching } = useGetAfibe10XUsersQuery({
        page,
        limit: ITEMS_PER_PAGE,
        search: search || undefined,
        status: statusFilter !== 'all' ? statusFilter : undefined,
    });

    const [approveUser] = useApproveAfibe10XUserMutation();
    const [rejectUser] = useRejectAfibe10XUserMutation();
    const [deleteUser] = useDeleteAfibe10XUserMutation();

    const users = useMemo(() => data?.data || [], [data]);
    const total = data?.meta?.total || 0;
    const { totalPages, pages } = usePagination(total, page, ITEMS_PER_PAGE);

    // Reset page when filters change
    useEffect(() => {
        setPage(1);
    }, [search, statusFilter]);

    // Periodic refetch
    useEffect(() => {
        const interval = setInterval(() => {
            if (!isFetching) refetch();
        }, 10000);
        return () => clearInterval(interval);
    }, [refetch, isFetching]);

    // Handle API errors
    useEffect(() => {
        if (usersError) {
            console.log('TradeChallengePage: Fetch users error:', usersError);
            toast.error('Failed to fetch users. Please try again.');
        }
        if (adminError) {
            console.log('TradeChallengePage: Fetch admin error:', adminError);
            toast.error('Failed to fetch admin profile. Please try again.');
        }
    }, [usersError, adminError]);

    // Clear rejection reason when dialog closes
    useEffect(() => {
        if (!confirmAction) {
            setRejectionReason('');
        }
    }, [confirmAction]);

    const handleAction = async () => {
        if (!confirmAction) return;
        const { type, user } = confirmAction;

        try {
            switch (type) {
                case "approve":
                    await approveUser({ id: user._id }).unwrap();
                    toast.success("User approved");
                    break;
                case "reject":
                    if (!rejectionReason) {
                        toast.error("Please select a rejection reason");
                        return;
                    }
                    await rejectUser({
                        id: user._id,
                        rejectionReason
                    }).unwrap();
                    toast.success("User rejected");
                    break;
                case "delete":
                    await deleteUser({ id: user._id }).unwrap();
                    toast.success("User deleted");
                    break;
            }
            refetch();
            setConfirmAction(null);
            setRejectionReason("");
        } catch (err: unknown) {
            type ErrorWithMessage = { data?: { message?: string } };
            const message =
                typeof err === "object" &&
                    err !== null &&
                    "data" in err &&
                    typeof (err as ErrorWithMessage).data?.message === "string"
                    ? (err as ErrorWithMessage).data!.message
                    : "Action failed";
            toast.error(message);
        }
    };

    const copyToClipboard = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            toast.success('Copied to clipboard');
        } catch (err) {
            console.log('Failed to copy:', err);
            toast.error('Failed to copy');
        }
    };

    const clearFilters = () => {
        setSearch('');
        setStatusFilter('all');
        setPage(1);
    };

    const handleOpenChat = (user: Afibe10XUser) => {
        setSelectedChatUser(user);
        // Note: Marking read logic would go here if needed, 
        // usually by calling an API or letting the backend handle it when admin replies.
    };

    if (isAdminLoading || !adminData) {
        return <div>Loading admin profile...</div>;
    }

    return (
        <SidebarInset>
            <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
                <SidebarTrigger className="-ml-1" />
                <Separator orientation="vertical" className="mr-2 h-4" />
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/admin">Dashboard</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage>Trade Challenge</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            </header>
            <Card className="mt-4 mx-4">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        Trade Challenge Users
                    </CardTitle>
                    <CardDescription>Manage and approve Trade Challenge participants ({total} users).</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col gap-4 mb-6">
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search name, username, UID"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="pl-8"
                                />
                            </div>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Select
                                    value={statusFilter}
                                    onValueChange={(v: 'all' | 'pending' | 'approved' | 'rejected') => setStatusFilter(v)}
                                >
                                    <SelectTrigger className="w-full sm:w-[180px]">
                                        <SelectValue placeholder="Filter by status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Status</SelectItem>
                                        <SelectItem value="pending">Pending</SelectItem>
                                        <SelectItem value="approved">Approved</SelectItem>
                                        <SelectItem value="rejected">Rejected</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <Button variant="outline" onClick={clearFilters}>Clear Filters</Button>
                        </div>
                    </div>
                    <div className="rounded-md border overflow-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Status</TableHead>
                                    <TableHead>User</TableHead>
                                    <TableHead>WEEX UID</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Chat</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isLoading ? (
                                    <TableRow><TableCell colSpan={6}>Loading...</TableCell></TableRow>
                                ) : users.length ? (
                                    users.map((user: Afibe10XUser) => (
                                        <TableRowMemo
                                            key={user._id}
                                            user={user}
                                            onCopy={copyToClipboard}
                                            setConfirmAction={setConfirmAction}
                                            handleOpenChat={handleOpenChat}
                                        />
                                    ))
                                ) : (
                                    <TableRow><TableCell colSpan={6}>No users found</TableCell></TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                    {totalPages > 1 && (
                        <div className="flex items-center justify-between mt-4">
                            <span className="text-sm text-muted-foreground">
                                Showing {(page - 1) * ITEMS_PER_PAGE + 1} - {Math.min(page * ITEMS_PER_PAGE, total)} of {total}
                            </span>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setPage(1)}
                                    disabled={page === 1}
                                >
                                    <ChevronFirst className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                                    disabled={page === 1}
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                </Button>
                                {pages.map((p) => (
                                    <Button
                                        key={p}
                                        variant={page === p ? 'default' : 'outline'}
                                        size="sm"
                                        onClick={() => setPage(p)}
                                        className="w-8 h-8 p-0"
                                    >
                                        {p}
                                    </Button>
                                ))}
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                                    disabled={page === totalPages}
                                >
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setPage(totalPages)}
                                    disabled={page === totalPages}
                                >
                                    <ChevronLast className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            <Dialog open={!!confirmAction} onOpenChange={() => setConfirmAction(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {confirmAction?.type === 'reject' ? 'Reject Submission' : 'Confirm Action'}
                        </DialogTitle>
                    </DialogHeader>

                    {/* Warning Section */}
                    {confirmAction && (
                        <div
                            className={`p-3 rounded-md mb-3 text-sm ${confirmAction.type === 'delete'
                                ? 'bg-red-100 text-red-800 border border-red-300'
                                : confirmAction.type === 'reject'
                                    ? 'bg-amber-100 text-amber-800 border border-amber-300'
                                    : 'bg-blue-100 text-blue-800 border border-blue-300'
                                }`}
                        >
                            {confirmAction.type === 'delete' && (
                                <p>⚠️ This action will permanently delete the user and all related data. This cannot be undone.</p>
                            )}
                            {confirmAction.type === 'reject' && (
                                <p>⚠️ You are about to reject this user’s submission. Please provide a valid reason below.</p>
                            )}
                            {confirmAction.type === 'approve' && (
                                <p>Are you sure you want to approve this user?</p>
                            )}
                        </div>
                    )}

                    {confirmAction?.type === 'reject' && (
                        <div className="mt-2 space-y-3">
                            <div>
                                <label className="text-sm font-medium block mb-1">Select rejection reason</label>
                                <Select
                                    value={rejectionReason}
                                    onValueChange={(v) => setRejectionReason(v as 'no_deposit' | 'wrong_link')}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Choose reason" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="no_deposit">No Deposit</SelectItem>
                                        <SelectItem value="wrong_link">Wrong Link</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    )}
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setConfirmAction(null)}>Cancel</Button>
                        <Button onClick={handleAction}>Confirm</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <ChatDialog
                open={!!selectedChatUser}
                onOpenChange={() => setSelectedChatUser(null)}
                user={selectedChatUser}
                adminId={adminId ?? ''}
            />
        </SidebarInset>
    );
}

function StatusBadge({ label, status }: { label: string; status?: string }) {
    const color =
        status === 'approved' ? 'bg-green-100 text-green-800' :
            status === 'rejected' ? 'bg-red-100 text-red-800' :
                status === 'pending' ? 'bg-blue-100 text-blue-800' :
                    'bg-yellow-100 text-yellow-800';
    const icon =
        status === 'approved' ? <CheckCircle className="w-3 h-3 mr-1" /> :
            status === 'rejected' ? <XCircle className="w-3 h-3 mr-1" /> :
                <Clock className="w-3 h-3 mr-1" />;
    return (
        <Badge className={`${color} justify-start gap-1`}>
            {icon} {status ? status.replace('_', ' ').charAt(0).toUpperCase() + status.slice(1) : label}
        </Badge>
    );
}
