"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/convex/_generated/api";
import { useApiMutation } from "@/hooks/use-api-mutation";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

const Page = () => {
  const router = useRouter();
  const { data } = useSession();
  const userId = data?.user?.id;
  const [input, setInput] = useState<string>("");
  const { mutate, pending } = useApiMutation(api.group.create);
  const handleGroupCreate = () => {
    mutate({
      userId,
      name: input,
    })
      .then((id) => {
        toast.success("Group created");
        router.push(`/g/${id}`);
      })
      .catch(() => toast.error("Failed to create group"));
  };
  return (
    <div className="container flex items-center h-full max-w-3xl mx-auto">
      <div className="relative w-full h-fit p-4 rounded-lg space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-semibold">Create a Group</h1>
        </div>

        <hr className="bg-red-500 h-px" />

        <div>
          <p className="text-lg font-medium">Name</p>
          <p className="text-xs pb-2">Group names cannot be changed</p>
          <div className="relative">
            <p className="absolute text-sm left-0 w-8 inset-y-0 grid place-items-center text-zinc-400">
              g/
            </p>
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="pl-6"
            />
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Button
            disabled={pending}
            variant="secondary"
            onClick={() => router.back()}
          >
            Cancel
          </Button>
          <Button
            disabled={input.length === 0 || pending}
            onClick={() => handleGroupCreate()}
          >
            Create Group
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Page;
