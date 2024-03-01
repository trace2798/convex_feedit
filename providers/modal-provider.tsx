"use client";

import { LoginModal } from "@/components/modals/login-modal";
// import { RenameModal } from "@/components/modals/rename_modal";
import { useEffect, useState } from "react";

export const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      {/* <RenameModal /> */}
      <LoginModal/>
    </>
  );
};
