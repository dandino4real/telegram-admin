

'use client';

import { useState, useEffect, useMemo } from 'react';
// import { useSelector } from 'react-redux';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import { CheckCircle, XCircle, Clock, TrendingUp, Search, Filter, ChevronLeft, ChevronRight, MoreHorizontal, TrashIcon } from 'lucide-react';
import { format } from 'date-fns';
import { DialogAction, ForexUser } from './types';
import {
  useGetForexUsersQuery,
  useApproveForexUserMutation,
  useRejectForexUserMutation,
  useDeleteForexUserMutation,
  useGetAdminProfileQuery,
} from '@/store/api';
// import { RootState } from '@/store';
import { getDialogContent } from './const';
import { useSession } from '@/hooks/use-session';

const ITEMS_PER_PAGE = 5;
const AdminPermissions = ['approve_registration', 'reject_registration', 'delete_users'];

export default function ForexUsersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pendingAction, setPendingAction] = useState<DialogAction | null>(null);

  // const adminId = useSelector((state: RootState) => (state.auth as { adminId: string | undefined }).adminId);
   const { adminId} = useSession();
  const { data: adminData, isLoading: isAdminLoading, error: adminError } = useGetAdminProfileQuery(adminId || '', {
    skip: !adminId,
  });

  const {
    data: usersData,
    isLoading: isUsersLoading,
    error: usersError,
  } = useGetForexUsersQuery({
    page: currentPage,
    limit: ITEMS_PER_PAGE,
    search: searchTerm || undefined,
    status: statusFilter !== 'all' ? statusFilter : undefined,
    startDate: dateFrom || undefined,
    endDate: dateTo || undefined,
  });

  const [approveForexUser] = useApproveForexUserMutation();
  const [rejectForexUser] = useRejectForexUserMutation();
  const [deleteForexUser] = useDeleteForexUserMutation();

  // Handle API errors
  useEffect(() => {
    if (usersError) {
      console.log('ForexUsersPage: Fetch users error:', usersError);
      toast.error('Failed to fetch users. Please try again.');
    }
    if (adminError) {
      console.error('ForexUsersPage: Fetch admin error:', adminError);
      toast.error('Failed to fetch admin profile. Please try again.');
    }
  }, [usersError, adminError]);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, dateFrom, dateTo]);

  const users = useMemo(() => {
    return (usersData?.data || []).map((user) => ({
      ...user,
      telegramId: user.telegramId ?? '',
    })) as ForexUser[];
  }, [usersData]);
  const meta = usersData?.meta || { page: 1, limit: ITEMS_PER_PAGE, total: 0, totalPages: 0 };

  const handleApprove = async (telegramId: string) => {
    try {
      const user = users.find((u) => u.telegramId === telegramId);
      if (!user || !adminData) return;
      await approveForexUser({ id: user._id, admin: { name: adminData.name, email: adminData.email } }).unwrap();
      toast.success(
        <>
          <p className="font-bold">User Approved</p>
          <p>Successfully approved {user.fullName || 'user'}</p>
        </>,
      );
    } catch (error: unknown) {
      console.log('ForexUsersPage: Failed to approve user:', error);
      const message =
        error && typeof error === 'object' && 'data' in error && error.data !== null && typeof error.data === 'object' && 'message' in error.data
          ? (error.data as { message: string }).message
          : 'Failed to approve user';
      toast.error(
        <>
          <p className="font-bold text-red-700">Error</p>
          <p>{message}</p>
        </>,
      );
    }
  };

  const handleReject = async (telegramId: string) => {
    try {
      const user = users.find((u) => u.telegramId === telegramId);
      if (!user || !adminData) return;
      await rejectForexUser({ id: user._id, admin: { name: adminData.name, email: adminData.email } }).unwrap();
      toast.success(
        <>
          <p className="font-bold">User Rejected</p>
          <p>Successfully rejected {user.fullName || 'user'}</p>
        </>,
      );
    } catch (error: unknown) {
      console.log('ForexUsersPage: Failed to reject user:', error);
      const message =
        error && typeof error === 'object' && 'data' in error && error.data !== null && typeof error.data === 'object' && 'message' in error.data
          ? (error.data as { message: string }).message
          : 'Failed to reject user';
      toast.error(
        <>
          <p className="font-bold text-red-700">Error</p>
          <p>{message}</p>
        </>,
      );
    }
  };

  const handleDelete = async (telegramId: string) => {
    try {
      const user = users.find((u) => u.telegramId === telegramId);
      if (!user) return;
      await deleteForexUser({ id: user._id }).unwrap();
      toast.success(
        <>
          <p className="font-bold">User Deleted</p>
          <p>Successfully deleted {user.fullName || 'user'}</p>
        </>,
      );
    } catch (error: unknown) {
      console.log('ForexUsersPage: Failed to delete user:', error);
      const message =
        error && typeof error === 'object' && 'data' in error && error.data !== null && typeof error.data === 'object' && 'message' in error.data
          ? (error.data as { message: string }).message
          : 'Failed to delete user';
      toast.error(
        <>
          <p className="font-bold text-red-700">Error</p>
          <p>{message}</p>
        </>,
      );
    }
  };

  const handleActionClick = (action: DialogAction) => {
    setPendingAction(action);
  };

  const handleConfirmAction = async () => {
    if (!pendingAction) return;
    switch (pendingAction.type) {
      case 'approve':
        await handleApprove(pendingAction.user.telegramId);
        break;
      case 'reject':
        await handleReject(pendingAction.user.telegramId);
        break;
      case 'delete':
        await handleDelete(pendingAction.user.telegramId);
        break;
    }
    setPendingAction(null);
  };

  const handleCancelAction = () => {
    setPendingAction(null);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            <CheckCircle className="w-3 h-3 mr-1" />
            Approved
          </Badge>
        );
      case 'rejected':
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
            <XCircle className="w-3 h-3 mr-1" />
            Rejected
          </Badge>
        );
      case 'pending':
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getAdminInfo = (user: ForexUser) => {
    const actionDate = user.approvedAt || user.rejectedAt;
    if (user.status === 'approved' && user.approvedBy && actionDate) {
      return (
        <div className="text-xs text-muted-foreground mt-1">
          <p>Approved by: {user.approvedBy.name}</p>
          <p>{user.approvedBy.email}</p>
          <p>{format(new Date(actionDate), 'dd/MM/yyyy HH:mm')}</p>
        </div>
      );
    } else if (user.status === 'rejected' && user.rejectedBy && actionDate) {
      return (
        <div className="text-xs text-muted-foreground mt-1">
          <p>Rejected by: {user.rejectedBy.name}</p>
          <p>{user.rejectedBy.email}</p>
          <p>{format(new Date(actionDate), 'dd/MM/yyyy HH:mm')}</p>
        </div>
      );
    }
    return null;
  };

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setDateFrom('');
    setDateTo('');
    setCurrentPage(1);
  };

  const dialogContent = getDialogContent(pendingAction);

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
              <BreadcrumbPage>Forex Users</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>
      <Card className="mt-4 mx-4">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-600" />
            Forex Signal Bot Users
          </CardTitle>
          <CardDescription>
            Manage users registered for the Afibie Forex Signal Bot ({meta.total} users)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 mb-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search name, username, login ID, or email"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
              <Button variant="outline" onClick={clearFilters} className="sm:w-auto">
                Clear Filters
              </Button>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <p className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Filters:</span>
              </p>
              <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as 'pending' | 'approved' | 'rejected' | 'all')}>
                <SelectTrigger className="w-full sm:w-[140px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex gap-2 items-center">
                <Input
                  type="date"
                  placeholder="From date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="w-full sm:w-[140px]"
                />
                <p>-</p>
                <Input
                  type="date"
                  placeholder="To date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="w-full sm:w-[140px]"
                />
              </div>
            </div>
          </div>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>ExcoTrader Login ID</TableHead>
                  <TableHead>Platform</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isUsersLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      Loading users...
                    </TableCell>
                  </TableRow>
                ) : users.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No users found matching your criteria
                    </TableCell>
                  </TableRow>
                ) : (
                  users.map((user) => (
                    <TableRow key={user._id}>
                      <TableCell className="font-medium">
                        <p className="flex items-center gap-2">
                          {user.fullName || user.telegramId || 'Unknown'}
                        </p>
                        <p className="text-xs text-muted-foreground">{user.username || 'Unknown'}</p>
                      </TableCell>
                      <TableCell>{user.excoTraderLoginId || 'N/A'}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {user.registeredVia || 'exco'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(user.status)}
                        {getAdminInfo(user)}
                      </TableCell>
                      <TableCell>{format(new Date(user.createdAt), 'dd/MM/yyyy')}</TableCell>
                      <TableCell>
                        {user.status === 'pending' && adminData.permissions.some((p) => AdminPermissions.includes(p)) ? (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              {adminData.permissions.includes('approve_registration') && (
                                <DropdownMenuItem
                                  onClick={() => handleActionClick({ type: 'approve', user })}
                                  className="text-green-600 focus:text-green-600"
                                >
                                  <CheckCircle className="w-4 h-4 mr-2" />
                                  Approve
                                </DropdownMenuItem>
                              )}
                              {adminData.permissions.includes('reject_registration') && (
                                <DropdownMenuItem
                                  onClick={() => handleActionClick({ type: 'reject', user })}
                                  className="text-red-600 focus:text-red-600"
                                >
                                  <XCircle className="w-4 h-4 mr-2" />
                                  Reject
                                </DropdownMenuItem>
                              )}
                              {adminData.permissions.includes('delete_users') && (
                                <>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    onClick={() => handleActionClick({ type: 'delete', user })}
                                    className="text-red-600 focus:text-red-600"
                                  >
                                    <TrashIcon className="w-4 h-4 mr-2" />
                                    Delete
                                  </DropdownMenuItem>
                                </>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        ) : (
                          <span className="text-muted-foreground text-sm">No actions</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          {meta.totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <p className="text-sm text-muted-foreground">
                Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to{' '}
                {Math.min(currentPage * ITEMS_PER_PAGE, meta.total)} of {meta.total} results
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: meta.totalPages }, (_, i) => i + 1).map((page) => (
                    <Button
                      key={page}
                      variant={currentPage === page ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setCurrentPage(page)}
                      className="w-8 h-8 p-0"
                    >
                      {page}
                    </Button>
                  ))}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, meta.totalPages))}
                  disabled={currentPage === meta.totalPages}
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      <AlertDialog open={!!pendingAction} onOpenChange={(open) => !open && handleCancelAction()}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{dialogContent?.title}</AlertDialogTitle>
            <AlertDialogDescription>{dialogContent?.description}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancelAction}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmAction} className={dialogContent?.actionClass}>
              {dialogContent?.actionText}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </SidebarInset>
  );
}

