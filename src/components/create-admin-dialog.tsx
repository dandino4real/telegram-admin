// "use client"
// import { zodResolver } from "@hookform/resolvers/zod"
// import { useForm } from "react-hook-form"
// import * as z from "zod"

// import { Button } from "@/components/ui/button"
// import { Checkbox } from "@/components/ui/checkbox"
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog"
// import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
// import { Input } from "@/components/ui/input"

// const formSchema = z.object({
//   name: z.string().min(2, "Name must be at least 2 characters"),
//   email: z.string().email("Please enter a valid email address"),
//   permissions: z.array(z.string()).min(1, "Please select at least one permission"),
// })

// const permissions = [
//   {
//     id: "approve_registration",
//     label: "Approve User Registration",
//     description: "Allow admin to approve new user registration requests",
//   },
//   {
//     id: "reject_registration",
//     label: "Reject User Registration",
//     description: "Allow admin to reject new user registration requests",
//   },
//   {
//     id: "delete_users",
//     label: "Delete Registered Users",
//     description: "Allow admin to delete existing user accounts",
//   },
// ]

// interface CreateAdminDialogProps {
//   open: boolean
//   onOpenChange: (open: boolean) => void
//   onCreateAdmin: (data: z.infer<typeof formSchema>) => void
//   isCreating?: boolean;
// }

// export function CreateAdminDialog({ open, onOpenChange, onCreateAdmin, isCreating }: CreateAdminDialogProps) {
//   const form = useForm<z.infer<typeof formSchema>>({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       name: "",
//       email: "",
//       permissions: [],
//     },
//   })

//   const onSubmit = (values: z.infer<typeof formSchema>) => {
//     onCreateAdmin(values)
//     form.reset()
//   }

//   return (
//     <Dialog open={open} onOpenChange={onOpenChange}>
//       <DialogContent className="sm:max-w-[500px]">
//         <DialogHeader>
//           <DialogTitle>Create New Admin</DialogTitle>
//           <DialogDescription>Add a new admin user and assign their permissions.</DialogDescription>
//         </DialogHeader>
//         <Form {...form}>
//           <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
//             <FormField
//               control={form.control}
//               name="name"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Full Name</FormLabel>
//                   <FormControl>
//                     <Input placeholder="Enter admin's full name" {...field} />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//             <FormField
//               control={form.control}
//               name="email"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Email Address</FormLabel>
//                   <FormControl>
//                     <Input placeholder="Enter admin's email" type="email" {...field} />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//             <FormField
//               control={form.control}
//               name="permissions"
//               render={() => (
//                 <FormItem>
//                   <div className="mb-4">
//                     <FormLabel className="text-base">Permissions</FormLabel>
//                     <FormDescription>Select the permissions this admin should have.</FormDescription>
//                   </div>
//                   {permissions.map((permission) => (
//                     <FormField
//                       key={permission.id}
//                       control={form.control}
//                       name="permissions"
//                       render={({ field }) => {
//                         return (
//                           <FormItem key={permission.id} className="flex flex-row items-start space-x-3 space-y-0">
//                             <FormControl>
//                               <Checkbox
//                                 checked={field.value?.includes(permission.id)}
//                                 onCheckedChange={(checked) => {
//                                   return checked
//                                     ? field.onChange([...field.value, permission.id])
//                                     : field.onChange(field.value?.filter((value) => value !== permission.id))
//                                 }}
//                               />
//                             </FormControl>
//                             <div className="space-y-1 leading-none">
//                               <FormLabel className="font-normal">{permission.label}</FormLabel>
//                               <FormDescription className="text-xs">{permission.description}</FormDescription>
//                             </div>
//                           </FormItem>
//                         )
//                       }}
//                     />
//                   ))}
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//             <DialogFooter>
//               <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
//                 Cancel
//               </Button>
//               <Button type="submit" disabled={isCreating}>
//                 {isCreating ? "Creating..." : "Create Admin"}
//               </Button>

//             </DialogFooter>
//           </form>
//         </Form>
//       </DialogContent>
//     </Dialog>
//   )
// }


"use client"

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
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

// ✅ Zod schema for validation
const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  role: z.enum(["admin", "admin_crypto", "admin_forex"], {
    required_error: "Please select a role",
  }),
  permissions: z.array(z.string()).min(1, "Please select at least one permission"),
})

// ✅ Permissions list
const permissions = [
  {
    id: "approve_registration",
    label: "Approve User Registration",
    description: "Allow admin to approve new user registration requests",
  },
  {
    id: "reject_registration",
    label: "Reject User Registration",
    description: "Allow admin to reject new user registration requests",
  },
  {
    id: "delete_users",
    label: "Delete Registered Users",
    description: "Allow admin to delete existing user accounts",
  },
]

interface CreateAdminDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreateAdmin: (data: z.infer<typeof formSchema>) => void
  isCreating?: boolean
}

export function CreateAdminDialog({
  open,
  onOpenChange,
  onCreateAdmin,
  isCreating,
}: CreateAdminDialogProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      role: undefined,
      permissions: [],
    },
  })

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    onCreateAdmin(values)
    form.reset()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Admin</DialogTitle>
          <DialogDescription>
            Add a new admin user, assign a role, and define their permissions.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Name */}
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

            {/* Email */}
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

            {/* Role Selector */}
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select admin role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="admin">Admin (Full Access)</SelectItem>
                      <SelectItem value="admin_crypto">Admin - Crypto</SelectItem>
                      <SelectItem value="admin_forex">Admin - Forex</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Determines what section(s) of the system this admin can manage.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Permissions */}
            <FormField
              control={form.control}
              name="permissions"
              render={() => (
                <FormItem>
                  <div className="mb-4">
                    <FormLabel className="text-base">Permissions</FormLabel>
                    <FormDescription>
                      Select the permissions this admin should have.
                    </FormDescription>
                  </div>
                  {permissions.map((permission) => (
                    <FormField
                      key={permission.id}
                      control={form.control}
                      name="permissions"
                      render={({ field }) => (
                        <FormItem
                          key={permission.id}
                          className="flex flex-row items-start space-x-3 space-y-0"
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(permission.id)}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([...field.value, permission.id])
                                  : field.onChange(
                                      field.value?.filter(
                                        (value) => value !== permission.id
                                      )
                                    )
                              }}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel className="font-normal">
                              {permission.label}
                            </FormLabel>
                            <FormDescription className="text-xs">
                              {permission.description}
                            </FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />
                  ))}
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Footer */}
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isCreating}>
                {isCreating ? "Creating..." : "Create Admin"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
