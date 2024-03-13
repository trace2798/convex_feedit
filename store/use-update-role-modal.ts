import { create } from "zustand";

const defaultValues = { id: "", memberRole: "" };

interface IUpdateRoleModal {
  isOpen: boolean;
  initialValues: typeof defaultValues;
  onOpen: (id: string, memberRole: string) => void;
  onClose: () => void;
}

export const useUpdateRoleModal = create<IUpdateRoleModal>((set) => ({
  isOpen: false,
  onOpen: (id, memberRole) =>
    set({
      isOpen: true,
      initialValues: { id, memberRole },
    }),
  onClose: () =>
    set({
      isOpen: false,
      initialValues: defaultValues,
    }),
  initialValues: defaultValues,
}));
