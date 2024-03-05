import { create } from "zustand";

const defaultValues = {
  currentUserId: "",
  postId: "",
  groupId: "",
  commentId: "",
};

interface IReplyModal {
  isOpen: boolean;
  initialValues: typeof defaultValues;
  onOpen: (
    currentUserId: string,
    postId: string,
    groupId: string,
    commentId: string
  ) => void;
  onClose: () => void;
}

export const useReplyModal = create<IReplyModal>((set) => ({
  isOpen: false,
  onOpen: (currentUserId, postId, groupId, commentId) =>
    set({
      isOpen: true,
      initialValues: { currentUserId, postId, groupId, commentId },
    }),
  onClose: () =>
    set({
      isOpen: false,
      initialValues: defaultValues,
    }),
  initialValues: defaultValues,
}));
