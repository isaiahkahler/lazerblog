import React, { CSSProperties, PropsWithChildren } from 'react'
import styles from './button.module.css'
import Link, { LinkProps } from 'next/link'

interface ButtonProps {
    children?: React.ReactNode,
    onClick?: React.MouseEventHandler<HTMLAnchorElement>,
    style?: CSSProperties,
}

export default function Button(props: ButtonProps) {
    return (
        <a className={styles.button} onClick={props.onClick} style={{...props.style, color: 'inherit'}}>
            {props.children}
        </a>
    );
}

export function LinkButton({ children, ...props }: PropsWithChildren<LinkProps>) {
    return (
        <Link {...props}>
            <a className={styles.button} style={{color: 'inherit'}}>
                {children}
            </a>
        </Link>
    );
}

export function TransparentButton(props: ButtonProps) {
    return (
        <a className={styles.button} onClick={props.onClick} style={{...props.style, backgroundColor: 'transparent', border: '2px solid #000', color: 'inherit'}}>
            {props.children}
        </a>
    );

}

export function IconButton (props: ButtonProps) {
    return (
        <a className={`${styles.button} ${styles.iconButton}`} onClick={props.onClick} style={{...props.style, color: 'inherit'}}>
            {props.children}
        </a>
    );
}