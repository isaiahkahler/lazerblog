import React, { CSSProperties, HTMLProps, PropsWithChildren } from 'react'
import styles from './button.module.css'
import Link, { LinkProps } from 'next/link'

type ButtonProps = {hasColor?: boolean};

function getClassName(props: ButtonProps & any) {
  return `${styles.button} ${props.hasColor ? styles.hasColor : ''} ${props.className ? props.className : ''}`
}

export default function Button(props: ButtonProps & PropsWithChildren<HTMLProps<HTMLAnchorElement>>) {
  const {hasColor, ...rest} = props;
  return (
    <a {...rest} className={getClassName(props)}>
      {props.children}
    </a>
  );
}


export function LinkButton({ children, ...props }: ButtonProps & PropsWithChildren<LinkProps>) {
  const {hasColor, ...rest} = props;
  return (
    <Link {...rest} className={getClassName(props)}>
      {children}
    </Link>
  );
}

export function TransparentButton(props: ButtonProps & PropsWithChildren<HTMLProps<HTMLAnchorElement>>) {
  const {hasColor, ...rest} = props;
  return (
    <a {...rest} className={`${getClassName(props)} ${styles.transparentButton}`}>
      {props.children}
    </a>
  );

}

export function IconButton(props: ButtonProps & PropsWithChildren<HTMLProps<HTMLAnchorElement>>) {
  const {hasColor, ...rest} = props;
  return (
    <a {...rest} className={`${getClassName(props)} ${styles.iconButton}`}>
      {props.children}
    </a>
  );
}

export function InputButton(props: ButtonProps & HTMLProps<HTMLInputElement>) {
  const {hasColor, ...rest} = props;
  return <input {...rest} className={`${getClassName(props)} ${styles.inputButton}`} />;
}

export function ClickButton(props: ButtonProps & HTMLProps<HTMLButtonElement>) {
  const {hasColor, ...rest} = props;
  return <button {...rest} className={getClassName(props)} type='button'/>;

}

export function IconCircle(props: PropsWithChildren<HTMLProps<HTMLSpanElement>>) {
  const {children, ...rest} = props;
  return <span {...rest} className={`${styles.iconCircle} ${rest.className ? rest.className : ''}`}>{children}</span>
}