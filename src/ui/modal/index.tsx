"use client";
import { mdiClose } from "@mdi/js";
import Icon from "@mdi/react";
import { DetailedHTMLProps, HTMLAttributes, PropsWithChildren, useState } from "react";
import { ClickButton, IconButton } from "../button";
import styles from './modal.module.css'
import animations from '@/styles/animations.module.css'

interface ModalProps {
  open: boolean,
  onClose: () => void
}

export default function Modal(props: ModalProps & PropsWithChildren<DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>
  >) {
  const {open, onClose, children, ...rest} = props;

  const [isClosing, setIsClosing] = useState(false);

  if (!open) return (<></>);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 200);
  }

  return (
    <div
      className={`${styles.container} ${isClosing ? animations.fadeOut : animations.fadeIn}`}
      onClick={(e) => {
        if (e.target !== e.currentTarget) return;
        handleClose();
        // onClose();
      }}
    >

      <div {...rest} className={`${styles.modal} ${isClosing ? animations.fadeOutDown : animations.fadeInUp}`}>
          {/* close button */}
          <span >

          </span>
          <button type='button' className={styles.closeButton} onClick={handleClose}>
            <Icon path={mdiClose} size={1} color='#000' />
          </button>

          {children}
        </div>

    </div>
  );
}