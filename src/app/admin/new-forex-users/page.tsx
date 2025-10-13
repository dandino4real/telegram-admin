



// 'use client';

// import React, { useState, useEffect, useMemo } from 'react';
// import {
//   CheckCircle, XCircle, Clock, ImageIcon, MoreHorizontal,
//   Trash, Search, ChevronLeft, ChevronRight, ChevronFirst, ChevronLast, Copy, Check
// } from 'lucide-react';
// import {
//   Card, CardHeader, CardTitle, CardDescription, CardContent
// } from '@/components/ui/card';
// import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
// import { Separator } from '@/components/ui/separator';
// import {
//   Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList,
//   BreadcrumbPage, BreadcrumbSeparator
// } from '@/components/ui/breadcrumb';
// import { Button } from '@/components/ui/button';
// import { Badge } from '@/components/ui/badge';
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
// import { Input } from '@/components/ui/input';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import {
//   DropdownMenu, DropdownMenuContent, DropdownMenuItem,
//   DropdownMenuTrigger, DropdownMenuSeparator
// } from '@/components/ui/dropdown-menu';
// import {
//   Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter
// } from '@/components/ui/dialog';
// import { Progress } from '@/components/ui/progress';
// import Image from 'next/image';
// import { toast } from 'sonner';
// import { format } from 'date-fns';
// import {
//   useGetNewForexUsersQuery,
//   useApproveForexLoginIdMutation,
//   useRejectForexLoginIdMutation,
//   useApproveForexAccountScreenshotMutation,
//   useRejectForexAccountScreenshotMutation,
//   useApproveForexTestTradesScreenshotMutation,
//   useRejectForexTestTradesScreenshotMutation,
//   useDeleteNewForexUserMutation,
//   useGetAdminProfileQuery
// } from '@/store/api';
// import { NewForexUser } from '@/store/types/newForexUser';
// import { useSession } from '@/hooks/use-session';

// const ITEMS_PER_PAGE = 20;

// // Custom Pagination Hook
// const usePagination = (total: number, currentPage: number, itemsPerPage: number) => {
//   return useMemo(() => {
//     const totalPages = Math.max(1, Math.ceil(total / itemsPerPage));
//     const startPage = Math.max(1, currentPage - 2);
//     const endPage = Math.min(totalPages, startPage + 4);
//     const pages = Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
//     return { totalPages, pages };
//   }, [total, currentPage, itemsPerPage]);
// };

//   const getProgress = (u: NewForexUser) => {
//     let steps = 0;
//     if (u.loginId_status === 'approved') steps++;
//     if (u.screenshotUrl_status === 'approved') steps++;
//     if (u.testTradesScreenshotUrl_status === 'approved') steps++;
//     return (steps / 3) * 100;
//   };

// // Memoized TableRow Component
// const TableRowMemo = React.memo(({ user, onCopy, setImageToView, setImageDialogOpen, setConfirmAction }: {
//   user: NewForexUser;
//   onCopy: (loginId: string) => void;
//   setImageToView: (url: string | null) => void;
//   setImageDialogOpen: (open: boolean) => void;
//   setConfirmAction: (action: { type: string; user: NewForexUser } | null) => void;
// }) => {
//   const [copiedId, setCopiedId] = useState<string | null>(null);

//   const handleCopy = (loginId: string) => {
//     onCopy(loginId);
//     setCopiedId(loginId);
//     setTimeout(() => setCopiedId(null), 2000);
//   };

//   return (
//     <TableRow>
//       <TableCell>
//         <div className="font-medium">{user.fullName || user.username || user.telegramId}</div>
//       </TableCell>
//       <TableCell>{user.broker}</TableCell>
//       <TableCell>
//         <div className="flex items-center gap-2">
//           <span>{user.loginId || 'N/A'}</span>
//           {user.loginId && (
//             <button
//               onClick={() => handleCopy(user.loginId)}
//               className="text-muted-foreground hover:text-primary"
//               aria-label={`Copy Login ID ${user.loginId}`}
//             >
//               {copiedId === user.loginId ? <Check size={16} /> : <Copy size={16} />}
//             </button>
//           )}
//         </div>
//       </TableCell>
//       <TableCell className="flex flex-col gap-1">
//         <StatusBadge label="Login ID" status={user.loginId_status} />
//         <StatusBadge label="MT4/5 Acct" status={user.screenshotUrl_status} />
//         <StatusBadge label="Test Trade" status={user.testTradesScreenshotUrl_status} />
//       </TableCell>
//       <TableCell>
//         <Progress value={getProgress(user)} className="h-2" />
//         <span className="text-xs text-muted-foreground">{Math.round(getProgress(user))}%</span>
//         <div className="flex gap-2 mt-2">
//           <SmallStepIcon label="Login" status={user.loginId_status} />
//           <SmallStepIcon
//             label="Account"
//             status={user.screenshotUrl_status}
//             clickable={!!user.screenshotUrl}
//             onClick={() => { setImageToView(user.screenshotUrl || null); setImageDialogOpen(true); }}
//           />
//           <SmallStepIcon
//             label="Tests"
//             status={user.testTradesScreenshotUrl_status}
//             clickable={!!user.testTradesScreenshotUrl}
//             onClick={() => { setImageToView(user.testTradesScreenshotUrl || null); setImageDialogOpen(true); }}
//           />
//         </div>
//       </TableCell>
//       <TableCell>{user.createdAt ? format(new Date(user.createdAt), 'dd/MM/yyyy') : '-'}</TableCell>
//       <TableCell>
//         <DropdownMenu>
//           <DropdownMenuTrigger asChild>
//             <Button variant="ghost" size="icon">
//               <MoreHorizontal />
//             </Button>
//           </DropdownMenuTrigger>
//           <DropdownMenuContent align="end">
//             {(user.loginId_status === 'awaiting_approval' || user.loginId_status === 'rejected') && (
//               <>
//                 <DropdownMenuItem onClick={() => setConfirmAction({ type: 'approve-login', user })}>
//                   <CheckCircle className="mr-2 w-4 h-4 text-green-600" />
//                   Approve Login
//                 </DropdownMenuItem>
//                 <DropdownMenuItem onClick={() => setConfirmAction({ type: 'reject-login', user })}>
//                   <XCircle className="mr-2 w-4 h-4 text-red-600" />
//                   Reject Login
//                 </DropdownMenuItem>
//                 <DropdownMenuSeparator />
//               </>
//             )}
//             {(user.screenshotUrl_status === 'awaiting_approval' || user.screenshotUrl_status === 'rejected') && (
//               <>
//                 <DropdownMenuItem onClick={() => setConfirmAction({ type: 'approve-account', user })}>
//                   <CheckCircle className="mr-2 w-4 h-4 text-green-600" />
//                   Approve Account Screenshot
//                 </DropdownMenuItem>
//                 <DropdownMenuItem onClick={() => setConfirmAction({ type: 'reject-account', user })}>
//                   <XCircle className="mr-2 w-4 h-4 text-red-600" />
//                   Reject Account Screenshot
//                 </DropdownMenuItem>
//                 <DropdownMenuSeparator />
//               </>
//             )}
//             {(user.testTradesScreenshotUrl_status === 'awaiting_approval' || user.testTradesScreenshotUrl_status === 'rejected') && (
//               <>
//                 <DropdownMenuItem onClick={() => setConfirmAction({ type: 'approve-test', user })}>
//                   <CheckCircle className="mr-2 w-4 h-4 text-green-600" />
//                   Approve Test Trades
//                 </DropdownMenuItem>
//                 <DropdownMenuItem onClick={() => setConfirmAction({ type: 'reject-test', user })}>
//                   <XCircle className="mr-2 w-4 h-4 text-red-600" />
//                   Reject Test Trades
//                 </DropdownMenuItem>
//                 <DropdownMenuSeparator />
//               </>
//             )}
//             <DropdownMenuItem
//               className="text-red-600"
//               onClick={() => setConfirmAction({ type: 'delete', user })}
//             >
//               <Trash className="mr-2 w-4 h-4" />
//               Delete User
//             </DropdownMenuItem>
//           </DropdownMenuContent>
//         </DropdownMenu>
//       </TableCell>
//     </TableRow>
//   );
// });

// // Ensure unique display name for React.memo
// TableRowMemo.displayName = 'TableRowMemo';

// export default function ForexUsersPage() {
//   const [search, setSearch] = useState('');
//   const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'awaiting_approval' | 'approved' | 'rejected'>('all');
//   const [brokerFilter, setBrokerFilter] = useState('');
//   const [page, setPage] = useState(1);
//   const [imageToView, setImageToView] = useState<string | null>(null);
//   const [isImageDialogOpen, setImageDialogOpen] = useState(false);
//   const [confirmAction, setConfirmAction] = useState<{ type: string; user: NewForexUser } | null>(null);
//   const [rejectionReason, setRejectionReason] = useState<
//     '' | 'blurry_image' | 'wrong_screenshot' | 'other' | 'deposit_missing' | 'deposit_incomplete' | 'duplicate_id' | 'demo_account' | 'wrong_link'
//   >('');
//   const [customReason, setCustomReason] = useState('');

//   const { adminId } = useSession();
//   const { data: adminData, isLoading: isAdminLoading, error: adminError } = useGetAdminProfileQuery(adminId || '', {
//     skip: !adminId,
//   });

//   const { data, isLoading, refetch, error: usersError, isFetching } = useGetNewForexUsersQuery({
//     page,
//     limit: ITEMS_PER_PAGE,
//     search: search || undefined,
//     status: statusFilter !== 'all' ? statusFilter : undefined,
//   });
//   const [approveForexLoginId] = useApproveForexLoginIdMutation();
//   const [rejectForexLoginId] = useRejectForexLoginIdMutation();
//   const [approveForexAccount] = useApproveForexAccountScreenshotMutation();
//   const [rejectForexAccount] = useRejectForexAccountScreenshotMutation();
//   const [approveForexTest] = useApproveForexTestTradesScreenshotMutation();
//   const [rejectForexTest] = useRejectForexTestTradesScreenshotMutation();
//   const [deleteNewForexUser] = useDeleteNewForexUserMutation();

//   const users = useMemo(() => data?.data || [], [data]);
//   const total = data?.meta?.total || 0;
//   const { totalPages, pages } = usePagination(total, page, ITEMS_PER_PAGE);

//   // Filter users based on search and filters
//   const filteredUsers = useMemo(() => {
//     return users.filter((user: NewForexUser) => {
//       const searchLower = search.toLowerCase();
//       const matchesSearch =
//         searchLower === '' ||
//         user.fullName?.toLowerCase().includes(searchLower) ||
//         user.username?.toLowerCase().includes(searchLower) ||
//         user.telegramId?.toLowerCase().includes(searchLower) ||
//         user.loginId?.toLowerCase().includes(searchLower) ||
//         user.broker?.toLowerCase().includes(searchLower);
//       const matchesStatus = statusFilter === 'all' || user.loginId_status === statusFilter;
//       const matchesBroker = brokerFilter === '' || user.broker === brokerFilter;
//       return matchesSearch && matchesStatus && matchesBroker;
//     });
//   }, [users, search, statusFilter, brokerFilter]);

//   // Paginate filtered users
//   const paginatedUsers = useMemo(() => {
//     const startIndex = (page - 1) * ITEMS_PER_PAGE;
//     return filteredUsers.slice(startIndex, startIndex + ITEMS_PER_PAGE);
//   }, [filteredUsers, page]);

//   // Reset page when filters change
//   useEffect(() => {
//     setPage(1);
//   }, [search, statusFilter, brokerFilter]);

//   // Periodic refetch
//   useEffect(() => {
//     const interval = setInterval(() => {
//       if (!isFetching) refetch();
//     }, 10000);
//     return () => clearInterval(interval);
//   }, [refetch, isFetching]);

//   // Handle API errors
//   useEffect(() => {
//     if (usersError) {
//       console.error('ForexUsersPage: Fetch users error:', usersError);
//       toast.error('Failed to fetch users. Please try again.');
//     }
//     if (adminError) {
//       console.error('ForexUsersPage: Fetch admin error:', adminError);
//       toast.error('Failed to fetch admin profile. Please try again.');
//     }
//   }, [usersError, adminError]);

//   // Clear rejection reason when dialog closes
//   useEffect(() => {
//     if (!confirmAction) {
//       setRejectionReason('');
//       setCustomReason('');
//     }
//   }, [confirmAction]);

//     const handleAction = async () => {
//     if (!confirmAction) return;
//     const { type, user } = confirmAction;

//     try {
//       switch (type) {
//         case "approve-login":
//           await approveForexLoginId({ id: user._id }).unwrap();
//           toast.success("Login ID approved");
//           break;

//         case "reject-login":
//           console.log({ rejectionReason, customReason });
//           if (!rejectionReason) {
//             toast.error("Please select a rejection reason");
//             return;
//           }

//           if (rejectionReason === "other" && !customReason.trim()) {
//             toast.error("Please provide a custom rejection reason");
//             return;
//           }

//           await rejectForexLoginId({
//             id: user._id,
//             reason:
//               rejectionReason === "deposit_missing" ||
//                 rejectionReason === "deposit_incomplete" ||
//                 rejectionReason === "wrong_link" ||
//                 rejectionReason === "demo_account" ||
//                 rejectionReason === "duplicate_id" ||
//                 rejectionReason === "other"
//                 ? rejectionReason
//                 : "other",

//             customReason:
//               rejectionReason === "other"
//                 ? customReason.trim()
//                 : undefined,
//           }).unwrap();

//           toast.success("Login ID rejected");
//           break;

//         case "approve-account":
//           await approveForexAccount({ id: user._id }).unwrap();
//           toast.success("Account screenshot approved");
//           break;

//         case "reject-account":
//           if (!rejectionReason) {
//             toast.error("Please select a rejection reason");
//             return;
//           }

//           await rejectForexAccount({
//             id: user._id,
//             reason: (rejectionReason === "blurry_image" || rejectionReason === "wrong_screenshot" || rejectionReason === "other") ? rejectionReason : "other",
//             customReason:
//               rejectionReason === "other"
//                 ? customReason.trim()
//                 : (rejectionReason === "blurry_image" || rejectionReason === "wrong_screenshot"
//                   ? rejectionReason
//                   : undefined),
//           }).unwrap();

//           toast.success("Account screenshot rejected");
//           break;

//         case "approve-test":
//           await approveForexTest({ id: user._id }).unwrap();
//           toast.success("Test trades screenshot approved");
//           break;

//         case "reject-test":
//           await rejectForexTest({
//             id: user._id,
//             reason: (rejectionReason === "blurry_image" || rejectionReason === "wrong_screenshot" || rejectionReason === "other")
//               ? rejectionReason
//               : "other",
//             customReason:
//               rejectionReason === "other"
//                 ? customReason.trim()
//                 : (rejectionReason === "deposit_missing"
//                   ? "Deposit missing"
//                   : rejectionReason === "wrong_link"
//                     ? "Wrong link"
//                     : (rejectionReason === "blurry_image" || rejectionReason === "wrong_screenshot"
//                       ? rejectionReason
//                       : undefined)),
//           }).unwrap();
//           if (rejectionReason === "other" && !customReason.trim()) {
//             toast.error("Please provide a custom rejection reason");
//             return;
//           }

//           toast.success("Test trades screenshot rejected");
//           break;

//         case "delete":
//           await deleteNewForexUser({ id: user._id }).unwrap();
//           toast.success("User deleted");
//           break;
//       }

//       refetch();
//       setConfirmAction(null);
//       setRejectionReason("");
//       setCustomReason("");
//     } catch (err: unknown) {
//       type ErrorWithMessage = { data?: { message?: string } };
//       const message =
//         typeof err === "object" &&
//           err !== null &&
//           "data" in err &&
//           typeof (err as ErrorWithMessage).data?.message === "string"
//           ? (err as ErrorWithMessage).data!.message
//           : "Action failed";

//       toast.error(message);
//     }
//   };


//   const copyToClipboard = async (text: string) => {
//     try {
//       await navigator.clipboard.writeText(text);
//       toast.success('Login ID copied to clipboard');
//     } catch (err) {
//       console.error('Failed to copy:', err);
//       toast.error('Failed to copy Login ID');
//     }
//   };



//   const clearFilters = () => {
//     setSearch('');
//     setStatusFilter('all');
//     setBrokerFilter('');
//     setPage(1);
//   };

//   if (isAdminLoading || !adminData) {
//     return <div>Loading admin profile...</div>;
//   }

//   return (
//     <SidebarInset>
//       <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
//         <SidebarTrigger className="-ml-1" />
//         <Separator orientation="vertical" className="mr-2 h-4" />
//         <Breadcrumb>
//           <BreadcrumbList>
//             <BreadcrumbItem>
//               <BreadcrumbLink href="/admin">Dashboard</BreadcrumbLink>
//             </BreadcrumbItem>
//             <BreadcrumbSeparator />
//             <BreadcrumbItem>
//               <BreadcrumbPage>Forex Users</BreadcrumbPage>
//             </BreadcrumbItem>
//           </BreadcrumbList>
//         </Breadcrumb>
//       </header>
//       <Card className="mt-4 mx-4">
//         <CardHeader>
//           <CardTitle className="flex items-center gap-2">
//             Forex Registrations
//           </CardTitle>
//           <CardDescription>Manage and approve Forex user onboarding ({total} users).</CardDescription>
//         </CardHeader>
//         <CardContent>
//           <div className="flex flex-col gap-4 mb-6">
//             <div className="flex flex-col sm:flex-row gap-4">
//               <div className="relative flex-1">
//                 <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
//                 <Input
//                   placeholder="Search name, username, login ID, or broker"
//                   value={search}
//                   onChange={(e) => setSearch(e.target.value)}
//                   className="pl-8"
//                 />
//               </div>
//               <div className="flex flex-col sm:flex-row gap-4">
//                 <Select
//                   value={statusFilter}
//                   onValueChange={(v: 'all' | 'pending' | 'awaiting_approval' | 'approved' | 'rejected') => setStatusFilter(v)}
//                 >
//                   <SelectTrigger className="w-full sm:w-[180px]">
//                     <SelectValue placeholder="Filter by status" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="all">All Status</SelectItem>
//                     <SelectItem value="pending">Pending</SelectItem>
//                     <SelectItem value="awaiting_approval">Awaiting Approval</SelectItem>
//                     <SelectItem value="approved">Approved</SelectItem>
//                     <SelectItem value="rejected">Rejected</SelectItem>
//                   </SelectContent>
//                 </Select>
//                 <Select
//                   value={brokerFilter}
//                   onValueChange={setBrokerFilter}
//                 >
//                   <SelectTrigger className="w-full sm:w-[180px]">
//                     <SelectValue placeholder="Filter by broker" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="all">All Brokers</SelectItem>
//                     <SelectItem value="Exness">Exness</SelectItem>
//                     <SelectItem value="AXI">AXI</SelectItem>
//                     <SelectItem value="Oanda">Oanda</SelectItem>
//                     <SelectItem value="Exco">Exco</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>
//               <Button variant="outline" onClick={clearFilters}>Clear Filters</Button>
//             </div>
//           </div>
//           <div className="rounded-md border overflow-auto">
//             <Table>
//               <TableHeader>
//                 <TableRow>
//                   <TableHead>User</TableHead>
//                   <TableHead>Broker</TableHead>
//                   <TableHead>Login ID</TableHead>
//                   <TableHead>Statuses</TableHead>
//                   <TableHead>Progress</TableHead>
//                   <TableHead>Date</TableHead>
//                   <TableHead>Actions</TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {isLoading ? (
//                   <TableRow><TableCell colSpan={7}>Loading...</TableCell></TableRow>
//                 ) : paginatedUsers.length ? (
//                   paginatedUsers.map((user: NewForexUser) => (
//                     <TableRowMemo
//                       key={user._id}
//                       user={user}
//                       onCopy={copyToClipboard}
//                       setImageToView={setImageToView}
//                       setImageDialogOpen={setImageDialogOpen}
//                       setConfirmAction={setConfirmAction}
//                     />
//                   ))
//                 ) : (
//                   <TableRow><TableCell colSpan={7}>No users found</TableCell></TableRow>
//                 )}
//               </TableBody>
//             </Table>
//           </div>
//           {totalPages > 1 && (
//             <div className="flex items-center justify-between mt-4">
//               <span className="text-sm text-muted-foreground">
//                 Showing {(page - 1) * ITEMS_PER_PAGE + 1} - {Math.min(page * ITEMS_PER_PAGE, total)} of {total}
//               </span>
//               <div className="flex items-center gap-2">
//                 <Button
//                   variant="outline"
//                   size="sm"
//                   onClick={() => setPage(1)}
//                   disabled={page === 1}
//                 >
//                   <ChevronFirst className="h-4 w-4" />
//                 </Button>
//                 <Button
//                   variant="outline"
//                   size="sm"
//                   onClick={() => setPage((p) => Math.max(1, p - 1))}
//                   disabled={page === 1}
//                 >
//                   <ChevronLeft className="h-4 w-4" />
//                 </Button>
//                 {pages.map((p) => (
//                   <Button
//                     key={p}
//                     variant={page === p ? 'default' : 'outline'}
//                     size="sm"
//                     onClick={() => setPage(p)}
//                     className="w-8 h-8 p-0"
//                   >
//                     {p}
//                   </Button>
//                 ))}
//                 <Button
//                   variant="outline"
//                   size="sm"
//                   onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
//                   disabled={page === totalPages}
//                 >
//                   <ChevronRight className="h-4 w-4" />
//                 </Button>
//                 <Button
//                   variant="outline"
//                   size="sm"
//                   onClick={() => setPage(totalPages)}
//                   disabled={page === totalPages}
//                 >
//                   <ChevronLast className="h-4 w-4" />
//                 </Button>
//               </div>
//             </div>
//           )}
//         </CardContent>
//       </Card>
//       <Dialog open={isImageDialogOpen} onOpenChange={setImageDialogOpen}>
//         <DialogContent>
//           <DialogHeader><DialogTitle>Screenshot</DialogTitle></DialogHeader>
//           <div className="w-full h-[70vh] flex justify-center items-center bg-muted">
//             {imageToView ? (
//               <Image src={imageToView} alt="screenshot" width={800} height={600} unoptimized className="object-contain" />
//             ) : (
//               <div className="flex flex-col items-center text-muted-foreground">
//                 <ImageIcon />
//                 <p>No screenshot</p>
//               </div>
//             )}
//           </div>
//         </DialogContent>
//       </Dialog>
//       <Dialog open={!!confirmAction} onOpenChange={() => setConfirmAction(null)}>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle>
//               {confirmAction?.type.includes('reject') ? 'Reject Submission' : 'Confirm Action'}
//             </DialogTitle>
//           </DialogHeader>
//           {confirmAction?.type.includes('reject') && (
//             <div className="mt-2 space-y-3">
//               <div>
//                 <label className="text-sm font-medium block mb-1">Select rejection reason</label>
//                 <Select
//                   value={rejectionReason}
//                   onValueChange={(v) => setRejectionReason(v as
//                     | ''
//                     | 'blurry_image'
//                     | 'wrong_screenshot'
//                     | 'other'
//                     | 'deposit_missing'
//                     | 'deposit_incomplete'
//                     | 'duplicate_id'
//                     | 'demo_account'
//                     | 'wrong_link'
//                   )}
//                 >
//                   <SelectTrigger>
//                     <SelectValue placeholder="Choose reason" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     {confirmAction.type === 'reject-login' && (
//                       <>
//                         <SelectItem value="deposit_missing">Deposit Missing</SelectItem>
//                         <SelectItem value="deposit_incomplete">Incomplete Deposit</SelectItem>
//                         <SelectItem value="wrong_link">Wrong Link</SelectItem>
//                         <SelectItem value="demo_account">Demo Account</SelectItem>
//                         <SelectItem value="duplicate_id">Duplicate Login ID</SelectItem>
//                         <SelectItem value="other">Other (Custom Reason)</SelectItem>
//                       </>
//                     )}
//                     {(confirmAction.type === 'reject-account' || confirmAction.type === 'reject-test') && (
//                       <>
//                         <SelectItem value="blurry_image">Blurry Image</SelectItem>
//                         <SelectItem value="wrong_screenshot">Wrong Screenshot</SelectItem>
//                         <SelectItem value="other">Other (Custom Reason)</SelectItem>
//                       </>
//                     )}
//                   </SelectContent>
//                 </Select>
//               </div>
//               {rejectionReason === 'other' && (
//                 <div>
//                   <label className="text-sm font-medium block mb-1">Enter custom rejection reason</label>
//                   <textarea
//                     value={customReason}
//                     onChange={(e) => setCustomReason(e.target.value)}
//                     placeholder="Type your custom reason here..."
//                     className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
//                     rows={3}
//                   />
//                 </div>
//               )}
//             </div>
//           )}
//           <DialogFooter>
//             <Button variant="outline" onClick={() => setConfirmAction(null)}>Cancel</Button>
//             <Button onClick={handleAction}>Confirm</Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//     </SidebarInset>
//   );
// }

// function StatusBadge({ label, status }: { label: string; status?: string }) {
//   const color =
//     status === 'approved' ? 'bg-green-100 text-green-800' :
//     status === 'rejected' ? 'bg-red-100 text-red-800' :
//     status === 'awaiting_approval' ? 'bg-blue-100 text-blue-800' :
//     'bg-yellow-100 text-yellow-800';
//   const icon =
//     status === 'approved' ? <CheckCircle className="w-3 h-3 mr-1" /> :
//     status === 'rejected' ? <XCircle className="w-3 h-3 mr-1" /> :
//     <Clock className="w-3 h-3 mr-1" />;
//   return (
//     <Badge className={`${color} justify-start gap-1`}>
//       {icon} {label}: {status?.replace('_', ' ')}
//     </Badge>
//   );
// }

// function SmallStepIcon({ label, status, clickable, onClick }: { label: string; status?: string | null; clickable?: boolean; onClick?: () => void }) {
//   const color = status === 'approved' ? 'text-green-600' : status === 'rejected' ? 'text-red-600' : 'text-yellow-600';
//   return (
//     <div className={`flex flex-col items-center text-[10px] cursor-${clickable ? 'pointer' : 'default'}`} onClick={() => clickable && onClick && onClick()}>
//       <div className={`w-8 h-8 rounded-full flex items-center justify-center border ${status === 'approved' ? 'bg-green-50 border-green-200' : status === 'rejected' ? 'bg-red-50 border-red-200' : 'bg-yellow-50 border-yellow-200'}`}>
//         <span className={`${color} font-semibold`}>{label[0]}</span>
//       </div>
//       <div className="mt-1">{label}</div>
//     </div>
//   );
// }









'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  CheckCircle, XCircle, Clock, ImageIcon, MoreHorizontal,
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
import { Progress } from '@/components/ui/progress';
import Image from 'next/image';
import { toast } from 'sonner';
import { format } from 'date-fns';
import {
  useGetNewForexUsersQuery,
  useApproveForexLoginIdMutation,
  useRejectForexLoginIdMutation,
  useApproveForexAccountScreenshotMutation,
  useRejectForexAccountScreenshotMutation,
  useApproveForexTestTradesScreenshotMutation,
  useRejectForexTestTradesScreenshotMutation,
  useDeleteNewForexUserMutation,
  useGetAdminProfileQuery
} from '@/store/api';
import { NewForexUser } from '@/store/types/newForexUser';
import { useSession } from '@/hooks/use-session';
import { ChatDialog } from './component/chartDialog';

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

const getProgress = (u: NewForexUser) => {
  let steps = 0;
  if (u.loginId_status === 'approved') steps++;
  if (u.screenshotUrl_status === 'approved') steps++;
  if (u.testTradesScreenshotUrl_status === 'approved') steps++;
  return (steps / 3) * 100;
};

// Memoized TableRow Component
const TableRowMemo = React.memo(({ user, onCopy, setImageToView, setImageDialogOpen, setConfirmAction, setSelectedChatUser }: {
  user: NewForexUser;
  onCopy: (loginId: string) => void;
  setImageToView: (url: string | null) => void;
  setImageDialogOpen: (open: boolean) => void;
  setConfirmAction: (action: { type: string; user: NewForexUser } | null) => void;
  setSelectedChatUser: (user: NewForexUser | null) => void;
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (loginId: string) => {
    onCopy(loginId);
    setCopiedId(loginId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <TableRow>
      <TableCell>
        <div className="font-medium">{user.fullName || user.username || user.telegramId}</div>
      </TableCell>
      <TableCell>{user.broker}</TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <span>{user.loginId || 'N/A'}</span>
          {user.loginId && (
            <button
              onClick={() => handleCopy(user.loginId)}
              className="text-muted-foreground hover:text-primary"
              aria-label={`Copy Login ID ${user.loginId}`}
            >
              {copiedId === user.loginId ? <Check size={16} /> : <Copy size={16} />}
            </button>
          )}
        </div>
      </TableCell>
      <TableCell className="flex flex-col gap-1">
        <StatusBadge label="Login ID" status={user.loginId_status} />
        <StatusBadge label="MT4/5 Acct" status={user.screenshotUrl_status} />
        <StatusBadge label="Test Trade" status={user.testTradesScreenshotUrl_status} />
      </TableCell>
      <TableCell>
        <Progress value={getProgress(user)} className="h-2" />
        <span className="text-xs text-muted-foreground">{Math.round(getProgress(user))}%</span>
        <div className="flex gap-2 mt-2">
          <SmallStepIcon label="Login" status={user.loginId_status} />
          <SmallStepIcon
            label="Account"
            status={user.screenshotUrl_status}
            clickable={!!user.screenshotUrl}
            onClick={() => { setImageToView(user.screenshotUrl || null); setImageDialogOpen(true); }}
          />
          <SmallStepIcon
            label="Tests"
            status={user.testTradesScreenshotUrl_status}
            clickable={!!user.testTradesScreenshotUrl}
            onClick={() => { setImageToView(user.testTradesScreenshotUrl || null); setImageDialogOpen(true); }}
          />
        </div>
      </TableCell>
      <TableCell>{user.createdAt ? format(new Date(user.createdAt), 'dd/MM/yyyy') : '-'}</TableCell>
      <TableCell>
        <Button size="sm" variant="outline" onClick={() => setSelectedChatUser(user)}>
          💬 Chat
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
            {(user.loginId_status === 'awaiting_approval' || user.loginId_status === 'rejected') && (
              <>
                <DropdownMenuItem onClick={() => setConfirmAction({ type: 'approve-login', user })}>
                  <CheckCircle className="mr-2 w-4 h-4 text-green-600" />
                  Approve Login
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setConfirmAction({ type: 'reject-login', user })}>
                  <XCircle className="mr-2 w-4 h-4 text-red-600" />
                  Reject Login
                </DropdownMenuItem>
                <DropdownMenuSeparator />
              </>
            )}
            {(user.screenshotUrl_status === 'awaiting_approval' || user.screenshotUrl_status === 'rejected') && (
              <>
                <DropdownMenuItem onClick={() => setConfirmAction({ type: 'approve-account', user })}>
                  <CheckCircle className="mr-2 w-4 h-4 text-green-600" />
                  Approve Account Screenshot
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setConfirmAction({ type: 'reject-account', user })}>
                  <XCircle className="mr-2 w-4 h-4 text-red-600" />
                  Reject Account Screenshot
                </DropdownMenuItem>
                <DropdownMenuSeparator />
              </>
            )}
            {(user.testTradesScreenshotUrl_status === 'awaiting_approval' || user.testTradesScreenshotUrl_status === 'rejected') && (
              <>
                <DropdownMenuItem onClick={() => setConfirmAction({ type: 'approve-test', user })}>
                  <CheckCircle className="mr-2 w-4 h-4 text-green-600" />
                  Approve Test Trades
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setConfirmAction({ type: 'reject-test', user })}>
                  <XCircle className="mr-2 w-4 h-4 text-red-600" />
                  Reject Test Trades
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

export default function ForexUsersPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'awaiting_approval' | 'approved' | 'rejected'>('all');
  const [brokerFilter, setBrokerFilter] = useState('');
  const [page, setPage] = useState(1);
  const [imageToView, setImageToView] = useState<string | null>(null);
  const [isImageDialogOpen, setImageDialogOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState<{ type: string; user: NewForexUser } | null>(null);
  const [rejectionReason, setRejectionReason] = useState<
    '' | 'blurry_image' | 'wrong_screenshot' | 'other' | 'deposit_missing' | 'deposit_incomplete' | 'duplicate_id' | 'demo_account' | 'wrong_link'
  >('');
  const [customReason, setCustomReason] = useState('');
  const [selectedChatUser, setSelectedChatUser] = useState<NewForexUser | null>(null);

  const { adminId } = useSession();
  const { data: adminData, isLoading: isAdminLoading, error: adminError } = useGetAdminProfileQuery(adminId || '', {
    skip: !adminId,
  });

 

  const { data, isLoading, refetch, error: usersError, isFetching } = useGetNewForexUsersQuery({
    page,
    limit: ITEMS_PER_PAGE,
    search: search || undefined,
    status: statusFilter !== 'all' ? statusFilter : undefined,
  });
  const [approveForexLoginId] = useApproveForexLoginIdMutation();
  const [rejectForexLoginId] = useRejectForexLoginIdMutation();
  const [approveForexAccount] = useApproveForexAccountScreenshotMutation();
  const [rejectForexAccount] = useRejectForexAccountScreenshotMutation();
  const [approveForexTest] = useApproveForexTestTradesScreenshotMutation();
  const [rejectForexTest] = useRejectForexTestTradesScreenshotMutation();
  const [deleteNewForexUser] = useDeleteNewForexUserMutation();

  const users = useMemo(() => data?.data || [], [data]);
  const total = data?.meta?.total || 0;
  const { totalPages, pages } = usePagination(total, page, ITEMS_PER_PAGE);

  // Filter users based on search and filters
  const filteredUsers = useMemo(() => {
    return users.filter((user: NewForexUser) => {
      const searchLower = search.toLowerCase();
      const matchesSearch =
        searchLower === '' ||
        user.fullName?.toLowerCase().includes(searchLower) ||
        user.username?.toLowerCase().includes(searchLower) ||
        user.telegramId?.toLowerCase().includes(searchLower) ||
        user.loginId?.toLowerCase().includes(searchLower) ||
        user.broker?.toLowerCase().includes(searchLower);
      const matchesStatus = statusFilter === 'all' || user.loginId_status === statusFilter;
      const matchesBroker = brokerFilter === '' || user.broker === brokerFilter;
      return matchesSearch && matchesStatus && matchesBroker;
    });
  }, [users, search, statusFilter, brokerFilter]);

  // Paginate filtered users
  const paginatedUsers = useMemo(() => {
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    return filteredUsers.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredUsers, page]);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [search, statusFilter, brokerFilter]);

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
      console.error('ForexUsersPage: Fetch users error:', usersError);
      toast.error('Failed to fetch users. Please try again.');
    }
    if (adminError) {
      console.error('ForexUsersPage: Fetch admin error:', adminError);
      toast.error('Failed to fetch admin profile. Please try again.');
    }
  }, [usersError, adminError]);

  // Clear rejection reason when dialog closes
  useEffect(() => {
    if (!confirmAction) {
      setRejectionReason('');
      setCustomReason('');
    }
  }, [confirmAction]);

  const handleAction = async () => {
    if (!confirmAction) return;
    const { type, user } = confirmAction;

    try {
      switch (type) {
        case "approve-login":
          await approveForexLoginId({ id: user._id }).unwrap();
          toast.success("Login ID approved");
          break;
        case "reject-login":
          console.log({ rejectionReason, customReason });
          if (!rejectionReason) {
            toast.error("Please select a rejection reason");
            return;
          }
          if (rejectionReason === "other" && !customReason.trim()) {
            toast.error("Please provide a custom rejection reason");
            return;
          }
          await rejectForexLoginId({
            id: user._id,
            reason:
              rejectionReason === "deposit_missing" ||
              rejectionReason === "deposit_incomplete" ||
              rejectionReason === "wrong_link" ||
              rejectionReason === "demo_account" ||
              rejectionReason === "duplicate_id" ||
              rejectionReason === "other"
                ? rejectionReason
                : "other",
            customReason:
              rejectionReason === "other"
                ? customReason.trim()
                : undefined,
          }).unwrap();
          toast.success("Login ID rejected");
          break;
        case "approve-account":
          await approveForexAccount({ id: user._id }).unwrap();
          toast.success("Account screenshot approved");
          break;
        case "reject-account":
          if (!rejectionReason) {
            toast.error("Please select a rejection reason");
            return;
          }
          await rejectForexAccount({
            id: user._id,
            reason: (rejectionReason === "blurry_image" || rejectionReason === "wrong_screenshot" || rejectionReason === "other") ? rejectionReason : "other",
            customReason:
              rejectionReason === "other"
                ? customReason.trim()
                : (rejectionReason === "blurry_image" || rejectionReason === "wrong_screenshot"
                  ? rejectionReason
                  : undefined),
          }).unwrap();
          toast.success("Account screenshot rejected");
          break;
        case "approve-test":
          await approveForexTest({ id: user._id }).unwrap();
          toast.success("Test trades screenshot approved");
          break;
        case "reject-test":
          if (!rejectionReason) {
            toast.error("Please select a rejection reason");
            return;
          }
          await rejectForexTest({
            id: user._id,
            reason: (rejectionReason === "blurry_image" || rejectionReason === "wrong_screenshot" || rejectionReason === "other")
              ? rejectionReason
              : "other",
            customReason:
              rejectionReason === "other"
                ? customReason.trim()
                : (rejectionReason === "deposit_missing"
                  ? "Deposit missing"
                  : rejectionReason === "wrong_link"
                    ? "Wrong link"
                    : (rejectionReason === "blurry_image" || rejectionReason === "wrong_screenshot"
                      ? rejectionReason
                      : undefined)),
          }).unwrap();
          toast.success("Test trades screenshot rejected");
          break;
        case "delete":
          await deleteNewForexUser({ id: user._id }).unwrap();
          toast.success("User deleted");
          break;
      }
      refetch();
      setConfirmAction(null);
      setRejectionReason("");
      setCustomReason("");
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
      toast.success('Login ID copied to clipboard');
    } catch (err) {
      console.error('Failed to copy:', err);
      toast.error('Failed to copy Login ID');
    }
  };

  const clearFilters = () => {
    setSearch('');
    setStatusFilter('all');
    setBrokerFilter('');
    setPage(1);
  };

   if (adminData && adminData.role === 'admin_crypto') {
    return null
  }

  if (isAdminLoading || !adminData ) {
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
            Forex Registrations
          </CardTitle>
          <CardDescription>Manage and approve Forex user onboarding ({total} users).</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 mb-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search name, username, login ID, or broker"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-8"
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Select
                  value={statusFilter}
                  onValueChange={(v: 'all' | 'pending' | 'awaiting_approval' | 'approved' | 'rejected') => setStatusFilter(v)}
                >
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="awaiting_approval">Awaiting Approval</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
                <Select
                  value={brokerFilter}
                  onValueChange={setBrokerFilter}
                >
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Filter by broker" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Brokers</SelectItem>
                    <SelectItem value="Exness">Exness</SelectItem>
                    <SelectItem value="AXI">AXI</SelectItem>
                    <SelectItem value="Oanda">Oanda</SelectItem>
                    <SelectItem value="Exco">Exco</SelectItem>
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
                  <TableHead>User</TableHead>
                  <TableHead>Broker</TableHead>
                  <TableHead>Login ID</TableHead>
                  <TableHead>Statuses</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Chat</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow><TableCell colSpan={8}>Loading...</TableCell></TableRow>
                ) : paginatedUsers.length ? (
                  paginatedUsers.map((user: NewForexUser) => (
                    <TableRowMemo
                      key={user._id}
                      user={user}
                      onCopy={copyToClipboard}
                      setImageToView={setImageToView}
                      setImageDialogOpen={setImageDialogOpen}
                      setConfirmAction={setConfirmAction}
                      setSelectedChatUser={setSelectedChatUser}
                    />
                  ))
                ) : (
                  <TableRow><TableCell colSpan={8}>No users found</TableCell></TableRow>
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
      <Dialog open={isImageDialogOpen} onOpenChange={setImageDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Screenshot</DialogTitle></DialogHeader>
          <div className="w-full h-[70vh] flex justify-center items-center bg-muted">
            {imageToView ? (
              <Image src={imageToView} alt="screenshot" width={800} height={600} unoptimized className="object-contain" />
            ) : (
              <div className="flex flex-col items-center text-muted-foreground">
                <ImageIcon />
                <p>No screenshot</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
      <Dialog open={!!confirmAction} onOpenChange={() => setConfirmAction(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {confirmAction?.type.includes('reject') ? 'Reject Submission' : 'Confirm Action'}
            </DialogTitle>
          </DialogHeader>
          {confirmAction?.type.includes('reject') && (
            <div className="mt-2 space-y-3">
              <div>
                <label className="text-sm font-medium block mb-1">Select rejection reason</label>
                <Select
                  value={rejectionReason}
                  onValueChange={(v) => setRejectionReason(v as
                    | ''
                    | 'blurry_image'
                    | 'wrong_screenshot'
                    | 'other'
                    | 'deposit_missing'
                    | 'deposit_incomplete'
                    | 'duplicate_id'
                    | 'demo_account'
                    | 'wrong_link'
                  )}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose reason" />
                  </SelectTrigger>
                  <SelectContent>
                    {confirmAction.type === 'reject-login' && (
                      <>
                        <SelectItem value="deposit_missing">Deposit Missing</SelectItem>
                        <SelectItem value="deposit_incomplete">Incomplete Deposit</SelectItem>
                        <SelectItem value="wrong_link">Wrong Link</SelectItem>
                        <SelectItem value="demo_account">Demo Account</SelectItem>
                        <SelectItem value="duplicate_id">Duplicate Login ID</SelectItem>
                        <SelectItem value="other">Other (Custom Reason)</SelectItem>
                      </>
                    )}
                    {(confirmAction.type === 'reject-account' || confirmAction.type === 'reject-test') && (
                      <>
                        <SelectItem value="blurry_image">Blurry Image</SelectItem>
                        <SelectItem value="wrong_screenshot">Wrong Screenshot</SelectItem>
                        <SelectItem value="other">Other (Custom Reason)</SelectItem>
                      </>
                    )}
                  </SelectContent>
                </Select>
              </div>
              {rejectionReason === 'other' && (
                <div>
                  <label className="text-sm font-medium block mb-1">Enter custom rejection reason</label>
                  <textarea
                    value={customReason}
                    onChange={(e) => setCustomReason(e.target.value)}
                    placeholder="Type your custom reason here..."
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    rows={3}
                  />
                </div>
              )}
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
        telegramId={selectedChatUser?.telegramId ?? ''}
        username={selectedChatUser?.username ?? ''}
        adminId={adminId ?? ''}
      />
    </SidebarInset>
  );
}

function StatusBadge({ label, status }: { label: string; status?: string }) {
  const color =
    status === 'approved' ? 'bg-green-100 text-green-800' :
    status === 'rejected' ? 'bg-red-100 text-red-800' :
    status === 'awaiting_approval' ? 'bg-blue-100 text-blue-800' :
    'bg-yellow-100 text-yellow-800';
  const icon =
    status === 'approved' ? <CheckCircle className="w-3 h-3 mr-1" /> :
    status === 'rejected' ? <XCircle className="w-3 h-3 mr-1" /> :
    <Clock className="w-3 h-3 mr-1" />;
  return (
    <Badge className={`${color} justify-start gap-1`}>
      {icon} {label}: {status?.replace('_', ' ')}
    </Badge>
  );
}

function SmallStepIcon({ label, status, clickable, onClick }: { label: string; status?: string | null; clickable?: boolean; onClick?: () => void }) {
  const color = status === 'approved' ? 'text-green-600' : status === 'rejected' ? 'text-red-600' : 'text-yellow-600';
  return (
    <div className={`flex flex-col items-center text-[10px] cursor-${clickable ? 'pointer' : 'default'}`} onClick={() => clickable && onClick && onClick()}>
      <div className={`w-8 h-8 rounded-full flex items-center justify-center border ${status === 'approved' ? 'bg-green-50 border-green-200' : status === 'rejected' ? 'bg-red-50 border-red-200' : 'bg-yellow-50 border-yellow-200'}`}>
        <span className={`${color} font-semibold`}>{label[0]}</span>
      </div>
      <div className="mt-1">{label}</div>
    </div>
  );
}