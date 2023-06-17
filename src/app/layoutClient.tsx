"use client";

// import Modal from "@/ui/modal";
// import { useState } from "react";
import useAuthStateListener from "./hooks/useAuthStateListener";

// holds client components to render at the root layout, under the children
export default function LayoutClient() {
  useAuthStateListener();
  // const [openLoginModal, setOpenLoginModal] = useState(false);

  return (
    <>

    </>
  );
}