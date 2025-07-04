"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Admin } from '../store/types/admin';


const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  permissions: z.array(z.string()).min(1, "Please select at least one permission"),
})

const permissions = [
  {
    _id: "approve_registration",
    label: "Approve User Registration",
    description: "Allow admin to approve new user registration requests",
  },
  {
    _id: "reject_registration",
    label: "Reject User Registration",
    description: "Allow admin to reject new user registration requests",
  },
  {
    _id: "delete_users",
    label: "Delete Registered Users",
    description: "Allow admin to delete existing user accounts",
  },
]

interface EditAdminDialogProps {
  admin: Admin
  open: boolean
  onOpenChange: (open: boolean) => void
  onUpdateAdmin: (data: z.infer<typeof formSchema>) => void
  isUpdating: boolean
}

export function EditAdminDialog({ admin, open, onOpenChange, onUpdateAdmin, isUpdating }: EditAdminDialogProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: admin.name,
      email: admin.email,
      permissions: admin.permissions,
    },
  })

  React.useEffect(() => {
    if (admin) {
      form.reset({
        name: admin.name,
        email: admin.email,
        permissions: admin.permissions,
      })
    }
  }, [admin, form])

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    onUpdateAdmin(values)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Admin</DialogTitle>
          <DialogDescription>Update admin information and permissions.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter admin's full name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter admin's email" type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="permissions"
              render={() => (
                <FormItem>
                  <div className="mb-4">
                    <FormLabel className="text-base">Permissions</FormLabel>
                    <FormDescription>Select the permissions this admin should have.</FormDescription>
                  </div>
                  {permissions.map((permission) => (
                    <FormField
                      key={permission._id}
                      control={form.control}
                      name="permissions"
                      render={({ field }) => {
                        return (
                          <FormItem key={permission._id} className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(permission._id)}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([...field.value, permission._id])
                                    : field.onChange(field.value?.filter((value) => value !== permission._id))
                                }}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel className="font-normal">{permission.label}</FormLabel>
                              <FormDescription className="text-xs">{permission.description}</FormDescription>
                            </div>
                          </FormItem>
                        )
                      }}
                    />
                  ))}
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isUpdating}>
                {isUpdating ? <span className="animate-spin mr-2">⏳</span> : null}
                {isUpdating ? "Updating..." : "Update Admin"}
              </Button>

            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
