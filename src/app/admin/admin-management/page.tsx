
"use client"
import * as React from "react";
import { PlusIcon } from "lucide-react";
import { AdminTable } from "@/components/admin-table";
import { CreateAdminDialog } from "@/components/create-admin-dialog";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SidebarInset } from "@/components/ui/sidebar";
import { useGetAdminsQuery, useUpdateAdminMutation, useDeleteAdminMutation, useCreateAdminMutation } from "@/store/api";
import { Admin } from '../../../store/types/admin';
import { toast } from "sonner";

export default function AdminManagementPage() {
  const [page, setPage] = React.useState(1);
  const [limit] = React.useState(6);
  const [search, setSearch] = React.useState("");
  const [status, setStatus] = React.useState<string>();
  const [dateFilter, setDateFilter] = React.useState<string>();
  const [createDialogOpen, setCreateDialogOpen] = React.useState(false);
  const [createAdmin, { isLoading: isCreating }] = useCreateAdminMutation();
  const [updateAdmin, { isLoading: isUpdating }] = useUpdateAdminMutation();
  const [deleteAdmin, { isLoading: isDeleting }] = useDeleteAdminMutation();



  // const { data, isLoading, isError, refetch } = useGetAdminsQuery({
  const { data, isLoading, isError } = useGetAdminsQuery({
    page,
    limit,
    search,
    status,
    dateFilter
  });

  const admins = data?.data ?? [];


  const total = data?.total ?? 0;

  const activeCount = admins.filter(a => a.status === 'active').length;
  const suspendedCount = admins.filter(a => a.status === 'suspended').length;


  const handleUpdateAdmin = async (id: string, updates: Partial<Admin>) => {
    try {
      await updateAdmin({ _id: id, updates }).unwrap();
      console.log("Admin updated successfully");
    } catch (error) {
      console.log("Failed to update admin:", error);
    }
  };

  const handleDeleteAdmin = async (id: string) => {
    console.log(id)
    try {
      await deleteAdmin(id).unwrap();
      toast.success("Admin deleted successfully");
      console.log("Admin deleted successfully");
    } catch (error) {
      toast.error("Failed to delete admin");
      console.log("Failed to delete admin:", error);
    }
  };

  const handleCreateAdmin = async (data: Partial<Admin>) => {
    try {
      await createAdmin(data).unwrap();
      toast.success("Admin created successfully");
      setCreateDialogOpen(false);
    } catch (error) {
      toast.error("Failed to create admin");
      console.log("Create admin error:", error);
    }
  };


  return (
    <SidebarInset>
      <SiteHeader />
      <div className="flex flex-col gap-4 p-4">
        <div className="grid grid-cols-3 gap-4">
          {/* Cards */}
          <Card><CardHeader><CardTitle>Total Admins</CardTitle></CardHeader>
            <CardContent><div className="text-2xl font-bold">{total}</div></CardContent>
          </Card>
          <Card><CardHeader><CardTitle>Active Admins</CardTitle></CardHeader>
            <CardContent><div className="text-2xl font-bold text-green-600">{activeCount}</div></CardContent>
          </Card>
          <Card><CardHeader><CardTitle>Suspended Admins</CardTitle></CardHeader>
            <CardContent><div className="text-2xl font-bold text-red-600">{suspendedCount}</div></CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex justify-between">
              <div>
                <CardTitle>Admin Management</CardTitle>
                <CardDescription>Manage admin users</CardDescription>
              </div>
              <Button onClick={() => setCreateDialogOpen(true)}>
                <PlusIcon className="mr-2 h-4 w-4" /> Create Admin
              </Button>

              <CreateAdminDialog
                open={createDialogOpen}
                onOpenChange={setCreateDialogOpen}
                onCreateAdmin={handleCreateAdmin}
                isCreating={isCreating}
              />

            </div>
          </CardHeader>
          <CardContent>
            {isError && <p className="text-red-600">Cannot load admins.</p>}
            <AdminTable
              admins={admins}
              loading={isLoading}
              onSearch={(term: string) => { setSearch(term); setPage(1); }}
              onFilter={(filterArgs: { status?: string; dateFilter?: string }) => {
                setStatus(filterArgs.status);
                setDateFilter(filterArgs.dateFilter);
                setPage(1);
              }}
              onPageChange={(newPage: number) => setPage(newPage)}
              total={total}
              page={page}
              limit={limit}
              onUpdateAdmin={handleUpdateAdmin}
              onDeleteAdmin={handleDeleteAdmin}
              isUpdating={isUpdating}
              isDeleting={isDeleting}
            />
          </CardContent>
        </Card>
      </div>
    </SidebarInset>
  );
}
