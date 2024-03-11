"use client";

import Tiptap from "@/components/editor/tiptap";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/convex/_generated/api";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { useApiMutation } from "@/hooks/use-api-mutation";
import { useMutation, useQuery } from "convex/react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Trash } from "lucide-react";

interface SubRedditPostPageProps {
  params: {
    postId: string;
  };
}

const formSchema = z.object({
  title: z.string().min(1, "Required"),
  content: z.string().min(1, "Required").max(15000, "Too long"),
  caption: z.string().min(1, "Required"),
  file: z
    .custom<FileList>((val) => val instanceof FileList, "Required")
    .refine((files) => files.length > 0, `Required`),
});

const SubRedditEditPostPage = ({ params }: SubRedditPostPageProps) => {
  const { data } = useSession();
  const [newcontent, setNewContent] = useState("");
  const [newtitle, setNewTitle] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [isFileDialogOpen, setIsFileDialogOpen] = useState(false);
  const [caption, setCaption] = useState("");
  const imageInput = useRef<HTMLInputElement>(null);
  // console.log(params.postId);
  const router = useRouter();
  const pathname = usePathname();
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const createFile = useMutation(api.files.createFile);
  const handleDeleteFromDB = useMutation(api.files.deleteById);
  // console.log(data);
  // console.log(pathname);

  const postInfo = useQuery(api.posts.getById, {
    postId: params.postId as Id<"posts">,
  });
  const imagesInfo = useQuery(api.files.getByPostId, {
    postId: params.postId as Id<"posts">,
  });
  console.log("IMAGES+++>", imagesInfo);
  if (postInfo === undefined) {
    return (
      <div>
        <div className="md:max-w-3xl lg:max-w-4xl mx-auto mt-10">
          <div className="space-y-4 pl-8 pt-4">
            <Skeleton className="h-14 w-[50%]" />
            <Skeleton className="h-4 w-[80%]" />
            <Skeleton className="h-4 w-[40%]" />
            <Skeleton className="h-4 w-[60%]" />
          </div>
        </div>
      </div>
    );
  }

  if (postInfo === null) {
    return <div>Not found</div>;
  }

  const { post, group, user } = postInfo;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: post.title,
      content: post.content,
      caption: "",
      file: undefined,
    },
  });
  const { mutate, pending } = useApiMutation(api.posts.update);

  useEffect(() => {
    setNewContent(post.content as string);
    setNewTitle(post.title);
  }, [post]);
  const handlePublish = () => {
    mutate({
      id: post._id,
      userId: data?.user.id as Id<"users">,
      content: newcontent ?? post.content,
      title: newtitle ?? post.title,
      isPublic: true,
    })
      .then(() => {
        toast.success("Post updated");
        router.push(`/g/${post.groupId}/post/${post._id}`);
      })
      .catch(() => toast.error("Failed to update post"));
  };

  const handleSaveAsDraft = () => {
    mutate({
      id: post._id,
      userId: data?.user.id as Id<"users">,
      content: newcontent ?? post.content,
      title: newtitle ?? post.title,
      isPublic: false,
    })
      .then(() => {
        toast.success("Post updated and saved as draft");
        router.push(`/g/${post.groupId}`);
      })
      .catch(() => toast.error("Failed to update post and save as draft"));
  };

  const handleImage = async () => {
    const postUrl = await generateUploadUrl({
      userId: data?.user.id as Id<"users">,
    });
    const fileType = selectedImage!.type;

    const result = await fetch(postUrl, {
      method: "POST",
      headers: { "Content-Type": fileType },
      body: selectedImage,
    });
    const { storageId } = await result.json();

    const types = {
      "image/png": "image",
    } as Record<string, Doc<"files">["type"]>;

    try {
      await createFile({
        caption: caption,
        fileId: storageId,
        postId: post._id as Id<"posts">,
        groupId: post.groupId as Id<"group">,
        userId: data?.user.id as Id<"users">,
        type: types[fileType],
      });

      // form.reset();
      setCaption("");
      setSelectedImage(null);

      setIsFileDialogOpen(false);

      toast.success("File Uploaded");
    } catch (err) {
      console.log("", err);
      toast.error("Upload Failed");
    }
  };

  const handleDelete = (fileId: Id<"_storage">) => {
    handleDeleteFromDB({
      postId: post._id as Id<"posts">,
      fileId: fileId,
    }).then(() => toast.success("Deleted"));
  };
  return (
    <div>
      <div className="h-full flex-col items-center sm:items-start justify-between">
        <div className="flex flex-col mb-5">
          <Link href={`/g/${group[0]._id}`}>
            <h1 className="hover:text-indigo-500">g/{group[0].name}</h1>
          </Link>
          <h1 className="text-muted-foreground text-sm">by u/{user[0].name}</h1>
        </div>
        <h1 className="font-bold text-3xl mb-5">
          <Input
            value={newtitle}
            placeholder={post.title}
            onChange={(e) => setNewTitle(e.target.value)}
          />
        </h1>
        <div className="h-full">
          <Tiptap
            onChange={(value: any) => setNewContent(value)}
            initialContent={post.content}
            editable={true}
          />
        </div>
        <div className="mt-10 grid grid-cols-3">
          {imagesInfo &&
            imagesInfo?.length > 0 &&
            imagesInfo?.map((image, index) => (
              <>
                <Card key={index} className="max-w-sm  overflow-hidden">
                  <CardHeader onClick={() => handleDelete(image.fileId)}>
                    <Trash />
                  </CardHeader>
                  <CardContent className="mt-5 max-h-[384px] overflow-hidden">
                    <img
                      src={image.url as string | undefined}
                      className="object-cover"
                    />
                  </CardContent>
                  <CardFooter>{image.caption}</CardFooter>
                </Card>
                {/* <img src={image.url} className="max-w-sm max-h-[500px] " /> */}
              </>
            ))}
        </div>

        <div className="mt-5">
          <Card className="max-w-sm">
            <CardContent>
              <Input
                type="file"
                accept="image/*"
                ref={imageInput}
                onChange={(event) => setSelectedImage(event.target.files![0])}
                className="ms-2 btn btn-primary"
                disabled={selectedImage !== null}
              />
            </CardContent>
            <CardFooter>
              <Input
                value={caption}
                placeholder={post.title}
                onChange={(e) => setCaption(e.target.value)}
              />
            </CardFooter>
          </Card>

          <Button
            type="submit"
            // disabled={form.formState.isSubmitting}
            onClick={handleImage}
            className="flex gap-1"
          >
            Submit
          </Button>
        </div>

        <div className="w-full mt-5 flex justify-between pb-5">
          <Button
            disabled={pending}
            type="submit"
            className="w-[380px]"
            onClick={handlePublish}
          >
            Publish
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
    </div>
  );
};

export default SubRedditEditPostPage;
