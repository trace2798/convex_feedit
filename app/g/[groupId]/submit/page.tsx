"use client";
import Tiptap from "@/components/editor/tiptap";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { api } from "@/convex/_generated/api";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { useApiMutation } from "@/hooks/use-api-mutation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "convex/react";
import { Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
interface PageProps {
  params: {
    groupId: string;
  };
}

let storageId: any;

const formSchema = z.object({
  caption: z.string().min(1, "Required"),
  file: z
    .custom<FileList>((val) => val instanceof FileList, "Required")
    .refine((files) => files.length > 0, `Required`),
});

const Page = ({ params }: PageProps) => {
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [isFileDialogOpen, setIsFileDialogOpen] = useState(false);
  const router = useRouter();
  const { data } = useSession();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      caption: "",
      file: undefined,
    },
  });
  const group = useQuery(api.group.getById, {
    groupId: params.groupId as Id<"group">,
  });
  const { mutate, pending } = useApiMutation(api.posts.create);
  const { mutate: saveDraft, pending: saveDraftPending } = useApiMutation(
    api.posts.createAsDraft
  );

  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const createFile = useMutation(api.files.createFile);
  const fileRef = form.register("file");
  // let storageId: "";
  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!data) return;

    const postUrl = await generateUploadUrl({
      userId: data.user.id as Id<"users">,
    });

    const fileType = values.file[0].type;

    const result = await fetch(postUrl, {
      method: "POST",
      headers: { "Content-Type": fileType },
      body: values.file[0],
    });
    const { storageId } = await result.json();
    
    const types = {
      "image/png": "image",
    } as Record<string, Doc<"files">["type"]>;

    try {
      await createFile({
        caption: values.caption,
        fileId: storageId,
        postId: "" as Id<"posts">,
        groupId: params.groupId as Id<"group">,
        userId: data.user.id as Id<"users">,
        type: types[fileType],
      });

      form.reset();

      setIsFileDialogOpen(false);

      toast.success("File Uploaded");
    } catch (err) {
      // console.log("", err);
      toast.error("Upload Failed");
    }
  }

  const handlePostCreate = () => {
    mutate({
      userId: data?.user.id,
      groupId: params.groupId as Id<"group">,
      content: content,
      title: title,
      onPublicGroup: group?.isPublic ? true : false,
      fileId: storageId,
    })
      .then((id) => {
        toast.success("Post created");
        router.push(`/g/${params.groupId}/post/${id}`);
      })
      .catch(() => toast.error("Failed to create group"));
  };

  const handleSaveAsDraft = () => {
    saveDraft({
      userId: data?.user.id,
      groupId: params.groupId as Id<"group">,
      content: content,
      title: title,
      onPublicGroup: true,
    })
      .then((id) => {
        toast.success("Post created");
        router.push(`/g/${params.groupId}/post/${id}`);
      })
      .catch(() => toast.error("Failed to create group"));
  };
  return (
    <div className="flex flex-col items-start gap-6">
      <div className="border-b border-gray-200 pb-5">
        <div className="-ml-2 -mt-2 flex flex-wrap items-baseline">
          <h3 className="ml-2 mt-2 text-base font-semibold leading-6">
            Create Post
          </h3>
          <p className="ml-2 mt-1 truncate text-sm text-muted-foreground">
            in r/{group?.name}
          </p>
        </div>
      </div>
      <div className="w-full">
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="pl-6 w-full"
          placeholder="Title of your post"
        />
      </div>
      <Tiptap
        onChange={(value: any) => setContent(value)}
        initialContent={""}
        editable={true}
      />
      {/* <UploadButton
        userId={data?.user.id as Id<"users">}
        groupId={params.groupId as Id<"group">}
      /> */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="caption"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Caption</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="file"
            render={() => (
              <FormItem>
                <FormLabel>File</FormLabel>
                <FormControl>
                  <Input type="file" {...fileRef} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            disabled={form.formState.isSubmitting}
            className="flex gap-1"
          >
            {form.formState.isSubmitting && (
              <Loader2 className="h-4 w-4 animate-spin" />
            )}
            Submit
          </Button>
        </form>
      </Form>
      <div className="w-full flex justify-between pb-5">
        <Button
          disabled={pending}
          type="submit"
          className="w-[380px]"
          onClick={handlePostCreate}
        >
          Post
        </Button>
        <Button
          disabled={pending}
          type="submit"
          variant={"outline"}
          className="w-[380px]"
          onClick={handleSaveAsDraft}
        >
          Save as Draft
        </Button>
      </div>
    </div>
  );
};

export default Page;
