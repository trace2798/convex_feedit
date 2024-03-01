import { create } from "zustand";

// const defaultValues = { id: "", name: "" };

interface ITagModal {
  isOpen: boolean;
//   initialValues: typeof defaultValues;
  onOpen: () => void;
  onClose: () => void;
}

export const useTagModal = create<ITagModal>((set) => ({
  isOpen: false,
  onOpen: () =>
    set({
      isOpen: true,
    }),
  onClose: () =>
    set({
      isOpen: false,
    //   initialValues: defaultValues,
    }),
//   initialValues: defaultValues,
}));
