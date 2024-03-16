"use client";

import Tiptap from "@/components/editor/tiptap";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/convex/_generated/api";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { useApiMutation } from "@/hooks/use-api-mutation";
import { Post } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAction, useMutation, useQuery } from "convex/react";
import { Home, Image, Sparkles, Trash } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

interface SubRedditPostPageProps {
  params: {
    postId: string;
  };
}

const formSchema = z.object({
  title: z.string().min(2).max(100),
  content: z.string().min(2).max(12000).optional(),
});
const SubRedditEditPostPage = ({ params }: SubRedditPostPageProps) => {
  const { data } = useSession();

  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [isFileDialogOpen, setIsFileDialogOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [caption, setCaption] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const imageInput = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const createFile = useMutation(api.files.createFile);
  const handleDeleteFromDB = useMutation(api.files.deleteById);
  const { mutate, pending } = useApiMutation(api.posts.update);
  const sendMessage = useAction(api.openai.chat);
  const { mutate: publishMutate, pending: publishPending } = useApiMutation(
    api.posts.publishPost
  );
  const postInfo = useQuery(api.posts.getById, {
    postId: params.postId as Id<"posts">,
  });
  const imagesInfo = useQuery(api.files.getByPostId, {
    postId: params.postId as Id<"posts">,
  });
  let post: Post | undefined, group, user;

  if (postInfo) {
    //@ts-ignore
    ({ post, group, user } = postInfo);
  }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: post?.title ?? "Untitled",
      content: post?.content,
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log("VALUES", values);
    mutate({
      id: post?._id,
      userId: data?.user.id as Id<"users">,
      content: values.content ?? post?.content,
      title: values.title ?? post?.title,
    })
      .then(() => {
        toast.success("Post updated");
        router.push(`/g/${post?.groupId}/post/${post?._id}`);
      })
      .catch(() => toast.error("Failed to update post and save as draft"));
  };
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

  const handleImage = async () => {
    setIsUploading(true);
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
      "image/jpeg": "image",
      "image/jpg": "image",
      "image/gif": "image",
      "image/webp": "image",
      "image/svg+xml": "image",
      "image/bmp": "image",
    } as Record<string, Doc<"files">["type"]>;

    try {
      await createFile({
        caption: caption,
        fileId: storageId,
        postId: post?._id as Id<"posts">,
        groupId: post?.groupId as Id<"group">,
        userId: data?.user.id as Id<"users">,
        type: types[fileType],
      });
      setCaption("");
      setSelectedImage(null);

      setIsFileDialogOpen(false);

      toast.success("File Uploaded");
      setIsUploading(false);
    } catch (err) {
      console.log("", err);
      toast.error("Upload Failed");
      setIsUploading(false);
      setSelectedImage(null);
    }
  };

  const handleDelete = (fileId: Id<"_storage">) => {
    handleDeleteFromDB({
      postId: post?._id as Id<"posts">,
      fileId: fileId,
    }).then(() => toast.success("Deleted"));
  };

  const handleSendMessage = async () => {
    console.log("AI CONTENT", form.getValues("content"));
    setIsGenerating(true);
    await sendMessage({
      content: form.getValues("content") ?? "",
      postId: params.postId as Id<"posts">,
      userId: data?.user.id as Id<"users">,
    });
    setIsGenerating(false);
  };

  const handlePublicPropertyChange = () => {
    publishMutate({
      postId: post?._id,
      userId: data?.user.id as Id<"users">,
    })
      .then(() => {
        toast.success("Success");
      })
      .catch(() => toast.error("Failed to publish post"));
  };

  if (post?.userId !== data?.user.id) {
    return (
      <div className="flex justify-center h-[40vh] items-center">
        <Card className="border-none">
          <CardTitle className="text-center">
            You are not authorize to perform this action
          </CardTitle>
          <CardFooter className="mt-5 flex justify-center items-center">
            <Link href={"/"}>
              <Button variant="ghost" className="hover:text-indigo-500">
                Back Home <Home className="ml-5 w-4 h-4" />
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <div className="h-full flex-col items-center sm:items-start justify-between">
        <div className="flex flex-col mb-5">
          {group && user && (
            <>
              <Link href={`/g/${group[0]._id}`}>
                <h1 className="hover:text-indigo-500">g/{group[0].name}</h1>
              </Link>
              <h1 className="text-muted-foreground text-sm">
                by u/{user[0].name}
              </h1>
            </>
          )}
        </div>
        <div className="mb-10">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="title of your post" {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Tiptap
                        // onChange={(value: any) => setNewContent(value)}
                        initialContent={post?.content}
                        editable={true}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div>
                <Textarea
                  className="mt-3 h-fit"
                  placeholder="AI generated TLDR to show the use of Convex internal mutations"
                  value={post?.aiGeneratedBrief}
                  disabled
                  // onChange={(event) => handleAIContentChange(event.target.value)}
                >
                  {post?.aiGeneratedBrief}
                </Textarea>
                <HoverCard>
                  <HoverCardTrigger>
                    {" "}
                    <Button
                      disabled={pending || isGenerating || !form.getValues("content")}
                      aria-label="Explain With AI"
                      onClick={() => handleSendMessage()}
                      className="font-medium mt-5 hover:text-indigo-400"
                      variant="ghost"
                    >
                      <Sparkles className="hover:text-indigo-400 w-5 h-5" />
                      &nbsp; Explain Content with AI
                    </Button>
                  </HoverCardTrigger>
                  <HoverCardContent className="text-sm">
                    This is to show the use of convex Internal Mutation <br />
                  </HoverCardContent>
                </HoverCard>
              </div>
              <div className="mt-3 mb-5">
                <Dialog>
                  <DialogTrigger>
                    {" "}
                    <div
                      className={buttonVariants({
                        className: "w-full mb-6",
                        variant: "outline",
                      })}
                    >
                      Add Image <Image className="w-4 h-4 ml-3" />
                    </div>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>
                        Add image with caption to your post
                      </DialogTitle>
                    </DialogHeader>
                    <Input
                      type="file"
                      accept="image/*"
                      ref={imageInput}
                      onChange={(event) =>
                        setSelectedImage(event.target.files![0])
                      }
                      className="btn btn-primary"
                      disabled={selectedImage !== null}
                    />
                    <Input
                      value={caption}
                      placeholder="Caption"
                      onChange={(e) => setCaption(e.target.value)}
                    />
                    <DialogFooter>
                      <Button
                        type="submit"
                        onClick={handleImage}
                        disabled={isUploading || selectedImage === null}
                        className="flex gap-1"
                      >
                        Upload Image
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
              <div className="mt-10 flex justify-center ">
                {imagesInfo && imagesInfo.length > 0 && (
                  <Carousel className="w-full max-w-sm">
                    <CarouselContent>
                      {imagesInfo.map((image, index) => (
                        <CarouselItem key={index}>
                          <div className="p-1">
                            <Card>
                              <CardHeader
                                onClick={() => handleDelete(image.fileId)}
                              >
                                <Trash />
                              </CardHeader>
                              <CardContent className="flex my-3 aspect-square items-center justify-center p-6 max-h-[385px] overflow-hidden">
                                <img
                                  src={image.url as string | undefined}
                                  className="object-cover"
                                />
                              </CardContent>
                              {image.caption && (
                                <CardFooter>{image.caption}</CardFooter>
                              )}
                            </Card>
                          </div>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    {imagesInfo.length > 1 && (
                      <>
                        <CarouselPrevious />
                        <CarouselNext />
                      </>
                    )}
                  </Carousel>
                )}
              </div>
              <div className="flex flex-col md:flex-row justify-evenly items-center align-middle">
                <Button
                  type="submit"
                  disabled={pending}
                  variant={"outline"}
                  className="w-[380px]"
                >
                  Update Post
                </Button>
                <div>
                  <div className="flex items-center space-x-2 ">
                    <Label>Publish Post:</Label>{" "}
                    <Checkbox
                      checked={post?.isPublic}
                      onCheckedChange={handlePublicPropertyChange}
                    />
                    <label
                      htmlFor="terms"
                      className="text-xs w-[250px] text-muted-foreground font-light leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {post?.isPublic ? (
                        <h1>Currently Post is public</h1>
                      ) : (
                        <h1>
                          Currently Post is private. Private post can only be
                          accessed through draft.
                        </h1>
                      )}
                    </label>
                  </div>
                </div>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default SubRedditEditPostPage;
