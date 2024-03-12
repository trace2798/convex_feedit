"use client";

import Tiptap from "@/components/editor/tiptap";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/convex/_generated/api";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { useApiMutation } from "@/hooks/use-api-mutation";
import { Group, Post } from "@/types";
import { useMutation, useQuery } from "convex/react";
import { Image, Trash } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CarouselDemo } from "@/components/carousel-demo";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface SubRedditPostPageProps {
  params: {
    postId: string;
  };
}

const SubRedditEditPostPage = ({ params }: SubRedditPostPageProps) => {
  const { data } = useSession();
  const [newcontent, setNewContent] = useState("");
  const [newtitle, setNewTitle] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [isFileDialogOpen, setIsFileDialogOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [caption, setCaption] = useState("");
  const imageInput = useRef<HTMLInputElement>(null);

  const router = useRouter();

  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const createFile = useMutation(api.files.createFile);
  const handleDeleteFromDB = useMutation(api.files.deleteById);
  const { mutate, pending } = useApiMutation(api.posts.update);

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

  useEffect(() => {
    if (post) {
      setNewContent(post.content as string);
      setNewTitle(post.title);
    }
  }, [post]);

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

  const handlePublish = () => {
    mutate({
      id: post?._id,
      userId: data?.user.id as Id<"users">,
      content: newcontent ?? post?.content,
      title: newtitle ?? post?.title,
      isPublic: true,
    })
      .then(() => {
        toast.success("Post updated");
        router.push(`/g/${post?.groupId}/post/${post?._id}`);
      })
      .catch(() => toast.error("Failed to update post"));
  };

  const handleSaveAsDraft = () => {
    mutate({
      id: post?._id,
      userId: data?.user.id as Id<"users">,
      content: newcontent ?? post?.content,
      title: newtitle ?? post?.title,
      isPublic: false,
    })
      .then(() => {
        toast.success("Post updated and saved as draft");
        router.push(`/g/${post?.groupId}`);
      })
      .catch(() => toast.error("Failed to update post and save as draft"));
  };

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

      // form.reset();
      setCaption("");
      setSelectedImage(null);

      setIsFileDialogOpen(false);

      toast.success("File Uploaded");
      setIsUploading(false);
    } catch (err) {
      console.log("", err);
      toast.error("Upload Failed");
      setIsUploading(false);
    }
  };

  const handleDelete = (fileId: Id<"_storage">) => {
    handleDeleteFromDB({
      postId: post?._id as Id<"posts">,
      fileId: fileId,
    }).then(() => toast.success("Deleted"));
  };
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
        <h1 className="font-bold text-3xl mb-5">
          <Input
            value={newtitle}
            placeholder={post?.title}
            onChange={(e) => setNewTitle(e.target.value)}
          />
        </h1>
        <div className="h-full">
          <Tiptap
            onChange={(value: any) => setNewContent(value)}
            initialContent={post?.content}
            editable={true}
          />
        </div>
        <div className="mt-3 mb-5">
          <Dialog>
            <DialogTrigger>
              {" "}
              <Button variant="outline">
                Add Image <Image className="w-4 h-4 ml-3" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add image with caption to your post</DialogTitle>
              </DialogHeader>
              <Input
                type="file"
                accept="image/*"
                ref={imageInput}
                onChange={(event) => setSelectedImage(event.target.files![0])}
                className="btn btn-primary"
                disabled={selectedImage !== null}
              />
              <Input
                value={caption}
                placeholder={post?.title}
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
                        <CardHeader onClick={() => handleDelete(image.fileId)}>
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
