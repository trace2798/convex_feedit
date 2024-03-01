import { create } from "zustand";

const defaultValues = { id: "", name: "" };

interface ITagModal {
  isOpen: boolean;
  initialValues: typeof defaultValues;
  onOpen: (id: string, name: string) => void;
  onClose: () => void;
}

export const useTagModal = create<ITagModal>((set) => ({
  isOpen: false,
  onOpen: (id, name) =>
    set({
      isOpen: true,
      initialValues: { id, name },
    }),
  onClose: () =>
    set({
      isOpen: false,
      initialValues: defaultValues,
    }),
  initialValues: defaultValues,
}));
