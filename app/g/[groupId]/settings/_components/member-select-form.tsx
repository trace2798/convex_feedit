"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Check, ChevronsUpDown } from "lucide-react";
import { SubmitHandler, useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useApiMutation } from "@/hooks/use-api-mutation";
import { toast } from "sonner";

const formSchema = z.object({
  groupId: z.string().min(2).max(50),
  userId: z.string().min(2).max(256),
  memberRole: z.string(),
});
const roles = ["Member", "Admin", "Mod"];
const MemberSelectForm = ({
  groupId,
  users,
}: {
  groupId: string;
  users: any;
}) => {
  // console.log(users, "USERS USERS");
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      groupId: groupId,
      userId: "",
      memberRole: "Member",
    },
  });
  type FormData = z.infer<typeof formSchema>;
  const { mutate, pending } = useApiMutation(api.group_members.addMember);
  const onSubmit: SubmitHandler<FormData> = async (values) => {
    mutate({
      userId: values.userId,
      groupId: values.groupId as Id<"group">,
      memberRoles: values.memberRole,
    })
      .then((id) => {
        toast.success("Member Added");
        form.reset();
      })
      .catch(() => toast.error("Failed to add member"));
  };

  const isLoading = form.formState.isSubmitting;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="userId"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Select a User To Add</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        "w-[200px] justify-between",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value
                        ? users.find((user: any) => user._id === field.value)
                            ?.name
                        : "Select User"}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                  <Command>
                    <CommandInput placeholder="Search user..." />
                    <CommandEmpty>No user found.</CommandEmpty>
                    <CommandGroup>
                      {Array.isArray(users) &&
                        users.map((user: any) => (
                          <CommandItem
                            value={user._id}
                            key={user._id}
                            onSelect={() => {
                              form.setValue("userId", user._id);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                user._id === field.value
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            {user.name}
                          </CommandItem>
                        ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormDescription>
                Once submitted the user will be added to this group.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="memberRole"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Select a Role</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        "w-[200px] justify-between capitalize",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value
                        ? roles.find((role: string) => role === field.value)
                        : "Select Role"}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                  <Command>
                    <CommandInput placeholder="Search role..." />
                    <CommandEmpty>No role found.</CommandEmpty>
                    <CommandGroup>
                      {roles.map((role: string, index) => (
                        <CommandItem
                          value={role}
                          key={index}
                          className="capitalize"
                          onSelect={() => {
                            form.setValue("memberRole", role);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              role === field.value ? "opacity-100" : "opacity-0"
                            )}
                          />
                          {role}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormDescription>
                Once submitted the user will be added to this group.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isLoading || pending}>
          Submit
        </Button>
      </form>
    </Form>
  );
};

export default MemberSelectForm;
