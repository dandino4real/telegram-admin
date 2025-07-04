
"use client"

import * as React from "react"
import {
  MoreHorizontalIcon,
  ShieldCheckIcon,
  ShieldXIcon,
  TrashIcon,
  EditIcon,
  SearchIcon,
  // FilterIcon,
  XIcon,
} from "lucide-react"

import { EditAdminDialog } from "./edit-admin-dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Admin } from '../store/types/admin';


interface AdminTableProps {
  admins: Admin[]
  loading: boolean
  onSearch: (searchTerm: string) => void
  onFilter: (filters: { status?: string; dateFilter?: string }) => void
  onPageChange: (page: number) => void
  page: number
  limit: number
  total: number
  onUpdateAdmin: (_id: string, updates: Partial<Admin>) => void;
  onDeleteAdmin: (_id: string) => void;
  isUpdating: boolean;
  isDeleting: boolean;
}

const permissionLabels = {
  approve_registration: "Approve Registration",
  reject_registration: "Reject Registration",
  delete_users: "Delete Users",
}

export function AdminTable({
  admins,
  loading,
  onSearch,
  onFilter,
  onPageChange,
  page,
  limit,
  total,
  onUpdateAdmin,
  onDeleteAdmin,
  isUpdating,
  isDeleting,
}: AdminTableProps) {
  const [editingAdmin, setEditingAdmin] = React.useState<Admin | null>(null)
  const [deletingAdmin, setDeletingAdmin] = React.useState<Admin | null>(null)
  const [searchTerm, setSearchTerm] = React.useState("")
  const [statusFilter, setStatusFilter] = React.useState("all")
  const [dateFilter, setDateFilter] = React.useState("all")

  const hasActiveFilters = statusFilter !== "all" || dateFilter !== "all" || searchTerm !== ""

  const debouncedSearch = React.useMemo(() => debounce(onSearch, 500), [onSearch])

  const handleSearchChange = (value: string) => {
    setSearchTerm(value)
    debouncedSearch(value)
  }

  const handleFilterChange = (status: string, date: string) => {
    setStatusFilter(status)
    setDateFilter(date)
    onFilter({
      status: status !== "all" ? status : undefined,
      dateFilter: date !== "all" ? date : undefined,
    })
  }

  const handleStatusToggle = (admin: Admin) => {
    const newStatus = admin.status === "active" ? "suspended" : "active"
    onUpdateAdmin(admin._id, { status: newStatus })
  }

  const handleEditAdmin = (adminData: { name: string; email: string; permissions: string[] }) => {
    if (editingAdmin) {
      onUpdateAdmin(editingAdmin._id, adminData)
      setEditingAdmin(null)
    }
  }

  const handleDeleteConfirm = () => {
    if (deletingAdmin) {
      onDeleteAdmin(deletingAdmin._id)
      setDeletingAdmin(null)
    }
  }

  return (
    <>
      {/* Search + Filters */}
      <div className="space-y-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="relative max-w-sm flex-1">
            <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <Label>Status:</Label>
              <Select value={statusFilter} onValueChange={(v) => handleFilterChange(v, dateFilter)}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <Label>Created:</Label>
              <Select value={dateFilter} onValueChange={(v) => handleFilterChange(statusFilter, v)}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {hasActiveFilters && (
              <Button
                variant="ghost"
                onClick={() => {
                  handleFilterChange("all", "all")
                  setSearchTerm("")
                }}
              >
                <XIcon className="mr-1 h-4 w-4" /> Clear Filters
              </Button>
            )}
          </div>
        </div>

        {/* Info */}
        <div className="text-sm text-muted-foreground">
          Showing {admins.length} of {total} result{total !== 1 ? "s" : ""}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-md border mt-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Permissions</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Last Login</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  Loading...
                </TableCell>
              </TableRow>
            ) : admins.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  No admins found.
                </TableCell>
              </TableRow>
            ) : (
              admins.map((admin) => (
                <TableRow key={admin._id}>
                  <TableCell>{admin.name}</TableCell>
                  <TableCell>{admin.email}</TableCell>
                  <TableCell>
                    <Badge variant={admin.status === "active" ? "default" : "destructive"}>
                      {admin.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="max-w-[150px]">
                    <div className="flex flex-wrap gap-1">
                      {admin.permissions.map((perm) => (
                        <Badge key={perm} variant="outline" className="text-xs">
                          {permissionLabels[perm as keyof typeof permissionLabels]}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>{new Date(admin.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>{admin.lastLogin ? new Date(admin.lastLogin).toLocaleDateString() : "N/A"}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontalIcon className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => setEditingAdmin(admin)}
                        >
                          <EditIcon className="mr-2 h-4 w-4" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleStatusToggle(admin)}>
                          {admin.status === "active" ? (
                            <>
                              <ShieldXIcon className="mr-2 h-4 w-4" /> Suspend
                            </>
                          ) : (
                            <>
                              <ShieldCheckIcon className="mr-2 h-4 w-4" /> activate
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => setDeletingAdmin(admin)}
                          disabled={isDeleting}
                        >
                          <TrashIcon className="mr-2 h-4 w-4" /> Delete
                        </DropdownMenuItem>

                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="mt-4 flex justify-center gap-2">
        {Array.from({ length: Math.ceil(total / limit) }, (_, i) => (
          <Button
            key={i}
            variant={page === i + 1 ? "default" : "outline"}
            onClick={() => onPageChange(i + 1)}
          >
            {i + 1}
          </Button>
        ))}
      </div>

      {/* Modals */}
      {editingAdmin && (
        <EditAdminDialog
          admin={editingAdmin}
          open={!!editingAdmin}
          onOpenChange={(open) => !open && setEditingAdmin(null)}
          onUpdateAdmin={handleEditAdmin}
          isUpdating={isUpdating}
        />
      )}

      <AlertDialog open={!!deletingAdmin} onOpenChange={(open) => !open && setDeletingAdmin(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete admin <strong>{deletingAdmin?.name}</strong>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

// Utility: debounce
function debounce<T extends unknown[]>(fn: (...args: T) => void, delay: number): (...args: T) => void {
  let timer: ReturnType<typeof setTimeout>
  return (...args: T) => {
    clearTimeout(timer)
    timer = setTimeout(() => fn(...args), delay)
  }
}


