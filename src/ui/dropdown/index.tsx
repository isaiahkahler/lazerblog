"use client";

import Link, { LinkProps } from "next/link";
import { HTMLProps, PropsWithChildren, useCallback, useEffect, useRef } from "react";
import styles from './dropdown.module.css'

interface DropdownProps {
  onClickAway?: () => void,
}

export default function Dropdown(props: DropdownProps & PropsWithChildren<HTMLProps<HTMLDivElement>>) {
  const { onClickAway, children, ...rest } = props;
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const handleClick = useCallback((event: MouseEvent) => {
    if (!dropdownRef.current) return;
    if (dropdownRef.current.contains(event.target as (Node | null))) {
      // inside click
      return;
    }
    // outside click 
    onClickAway && onClickAway();
  }, [onClickAway]);

  useEffect(() => {
    // add when mounted
    document.addEventListener("mousedown", handleClick);
    // return function to be called when unmounted
    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  }, [handleClick]);

  return (
    <div ref={dropdownRef} className={styles.dropdown} id="dropdown">
      <div  {...rest} className={`${styles.dropdownInner} ${rest.className ? rest.className : ''}`}>

      {children}
      </div>
    </div>
  );
}

interface DropdownItemProps {
  leftIcon?: JSX.Element,
  rightIcon?: JSX.Element,
}

export function DropdownItemLink({ leftIcon, rightIcon, children, ...rest }: DropdownItemProps & PropsWithChildren<LinkProps>) {
  const LeftIcon = leftIcon ? () => leftIcon : () => null;
  const RightIcon = rightIcon ? () => rightIcon : () => null;
  return (
    <Link {...rest}>
      <span className={styles["menu-item"]}>
        {LeftIcon && <span className={styles.leftIcon}><LeftIcon /></span>}
        {children}
        {RightIcon && <span className={styles.rightIcon}><RightIcon /></span>}
      </span>
    </Link>
  );
}

export function DropdownItemSpan({ leftIcon, rightIcon, children, ...rest }: DropdownItemProps & PropsWithChildren<HTMLProps<HTMLSpanElement>>) {
  const LeftIcon = leftIcon ? () => leftIcon : () => null;
  const RightIcon = rightIcon ? () => rightIcon : () => null;
  return (
    <span {...rest} className={styles["menu-item"]}>
      {LeftIcon && <span className={styles.leftIcon}><LeftIcon /></span>}
      {children}
      {RightIcon && <span className={styles.rightIcon}><RightIcon /></span>}
    </span>
  );
}