// "use client";

// import { FormEventHandler, useEffect, useState } from "react";
// import { toast } from "sonner";

// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogClose,
//   DialogFooter,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import { useRenameModal } from "@/store/use-rename-modal";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { useApiMutation } from "@/hooks/use-api-mutation";
// import { api } from "@/convex/_generated/api";
// import { useSession } from "next-auth/react";

// export const RenameModal = () => {
//   const { data } = useSession();
//   const { mutate, pending } = useApiMutation(api.snippet.updateTitle);

//   const { isOpen, onClose, initialValues } = useRenameModal();

//   const [title, setTitle] = useState(initialValues.title);

//   useEffect(() => {
//     setTitle(initialValues.title);
//   }, [initialValues.title]);

//   const onSubmit: FormEventHandler<HTMLFormElement> = (e) => {
//     e.preventDefault();

//     mutate({
//       id: initialValues.id,
//       title,
//       userId: data?.user.id,
//     })
//       .then(() => {
//         toast.success("Snippet renamed");
//         onClose();
//       })
//       .catch(() => toast.error("Failed to rename snippet"));
//     // .catch((error) => // console.log(error));
//   };

//   return (
//     <Dialog open={isOpen} onOpenChange={onClose}>
//       <DialogContent>
//         <DialogHeader>
//           <DialogTitle>Edit snippet title</DialogTitle>
//         </DialogHeader>
//         <DialogDescription>
//           Enter a new title for this snippet
//         </DialogDescription>
//         <form onSubmit={onSubmit} className="space-y-4">
//           <Input
//             disabled={pending}
//             required
//             maxLength={60}
//             value={title}
//             onChange={(e) => setTitle(e.target.value)}
//             placeholder="Snippet title"
//           />
//           <DialogFooter>
//             <DialogClose asChild>
//               <Button type="button" variant="outline">
//                 Cancel
//               </Button>
//             </DialogClose>
//             <Button disabled={pending} type="submit">
//               Save
//             </Button>
//           </DialogFooter>
//         </form>
//       </DialogContent>
//     </Dialog>
//   );
// };
