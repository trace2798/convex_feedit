"use client";

import CommentBox from "@/components/comment/comment-box";
import { AlertModal } from "@/components/modals/alert-modal";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useApiMutation } from "@/hooks/use-api-mutation";
import { useQuery } from "convex/react";
import { Edit3, Trash } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import PostVotes from "./_components/post-votes";
import Autoplay from "embla-carousel-autoplay";
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
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Tiptap from "@/components/editor/tiptap";

interface SubRedditPostPageProps {
  params: {
    postId: string;
  };
}

const SubRedditPostPage = ({ params }: SubRedditPostPageProps) => {
  // console.log(params.postId);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { data } = useSession();
  // console.log(data);
  // console.log("PATHNAME", pathname);

  const startIndex = pathname.indexOf("/g/") + 3; // Add 3 to skip "g/"
  const endIndex = pathname.indexOf("/post");
  const uniqueIdentifier = pathname.slice(startIndex, endIndex);
  // console.log(`The unique identifier is: ${uniqueIdentifier}`);
  const { mutate, pending } = useApiMutation(api.posts.deletePost);
  // const handlePostDelete = () => {
  //   // router.refresh();
  //   mutate({
  //     userId: data?.user.id,
  //     postId: params.postId as Id<"posts">,
  //     groupId: group[0]._id,
  //   })
  //     .then(() => {
  //       router.push(`/`);
  //       toast.success("Post deleted");
  //     })
  //     .catch(() => toast.error("Failed to delete post"));
  // };

  const handlePostDelete = async () => {
    try {
      router.push(`/`);
      await mutate({
        userId: data?.user.id,
        postId: params.postId as Id<"posts">,
        groupId: group[0]._id,
      });
      toast.success("Post deleted");
  
    } catch (error) {
      toast.error("Failed to delete post");
    }
  };

  const postInfo = useQuery(api.posts.getById, {
    postId: params.postId as Id<"posts">,
  });
  const imagesInfo = useQuery(api.files.getByPostId, {
    postId: params.postId as Id<"posts">,
  });
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

  // console.log(postInfo);
  const { post, group, user } = postInfo;

  if (!group[0].isPublic && !data) {
    return (
      <div className="flex justify-center h-[40vh] items-center">
        <Card className="border-none">
          <CardTitle className="text-center">
            Post made on a private group. You need to be a member to see the
            posts published here.
          </CardTitle>
          <CardFooter className="mt-5 flex justify-center items-center">
            <Link href={"/"}>
              <Button>Back Home</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={handlePostDelete}
        loading={loading}
        subDescription="Deleting this Post will delete all the votes and comments associated with it."
      />

      <div>
        <div className="h-full flex-col items-center sm:items-start justify-between">
          <div className="flex flex-col mb-5">
            <Link href={`/g/${group[0]._id}`}>
              <h1 className="hover:text-indigo-500">g/{group[0].name}</h1>
            </Link>
            <Link href={`/u/${user[0]._id}`}>
              <h1 className="text-muted-foreground text-sm hover:text-indigo-400">
                by u/{user[0].username}
              </h1>
            </Link>
          </div>
          <h1 className="font-bold text-3xl mb-5">{post?.title}</h1>
          <div className="h-full">
            <div
              className="flex flex-col justify-start  text-zinc-700 dark:text-neutral-300 items-start w-full gap-3 font-medium text-[16px] pt-4 rounded-bl-md rounded-br-md outline-none"
              style={{ whiteSpace: "pre-line" }}
              dangerouslySetInnerHTML={{ __html: post.content as string }}
            />
            {/* <Tiptap
              // onChange={() => {}}
              initialContent={post?.content}
              editable={false}
              showToolbar={false}
            /> */}
            <div className="mt-5">
              {post.aiGeneratedBrief && (
                <div>TLDR: {post.aiGeneratedBrief}</div>
              )}
            </div>
            <div className="mt-10 flex justify-center ">
              {imagesInfo && imagesInfo.length > 0 && (
                <Carousel
                  className="w-full max-w-sm"
                  plugins={[
                    Autoplay({
                      delay: 5000,
                    }),
                  ]}
                >
                  <CarouselContent>
                    {imagesInfo.map((image, index) => (
                      <CarouselItem key={index}>
                        <div className="p-1">
                          <Dialog>
                            <DialogContent className="2xl:absolute 2xl:left-[27%] 2xl:border-none">
                              <DialogHeader>
                                <div className="2xl:z-[100] 2xl:w-[1400px]">
                                  <img
                                    src={image.url as string | undefined}
                                    className="2xl:object-fill 2xl:w-[1800px] 2xl:h-[768px]"
                                  />
                                </div>
                                <DialogDescription>
                                  {image.caption}
                                </DialogDescription>
                              </DialogHeader>
                            </DialogContent>
                            <Card className="border-none">
                              <CardContent className="flex rounded-lg my-3 aspect-square items-center justify-center p-6 max-h-[385px] overflow-hidden">
                                <DialogTrigger>
                                  <img
                                    src={image.url as string | undefined}
                                    className="object-cover"
                                  />
                                </DialogTrigger>
                              </CardContent>
                              {image.caption && (
                                <CardDescription className="ml-6 text-base">
                                  {image.caption}
                                </CardDescription>
                              )}
                            </Card>
                          </Dialog>
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
          </div>
          <div className="flex justify-between">
            <PostVotes
              postId={post?._id}
              groupId={group[0]._id}
              userId={data?.user.id}
            />
            <div>
              {data?.user.id === user[0]._id && (
                <div>
                  <Button
                    onClick={() => router.push(pathname + "/edit")}
                    variant="ghost"
                  >
                    <Edit3 className="w-5 h-5" />
                  </Button>
                  <Button onClick={() => setOpen(true)} variant="outline">
                    <Trash className="w-5 h-5" />
                  </Button>
                </div>
              )}
            </div>
          </div>

          <div className="mt-5">
            <CommentBox
              currentUserId={data?.user.id as string}
              postId={post?._id}
              groupId={group[0]._id}
              commentId=""
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default SubRedditPostPage;

//k17dg3qp4x8t9bh28gkaq8vbh56ndz87
