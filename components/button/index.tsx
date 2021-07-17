import React, { CSSProperties, PropsWithChildren } from 'react'
import styles from './button.module.css'
import Link, { LinkProps } from 'next/link'

interface ButtonProps {
    children?: React.ReactNode,
    onClick?: () => void,
    style?: CSSProperties,
}

export default function Button(props: ButtonProps) {
    return (
        <a className={styles.button} onClick={props.onClick} style={{...props.style}}>
            {props.children}
        </a>
    );
}

export function LinkButton({ children, ...props }: PropsWithChildren<LinkProps>) {
    return (
        <Link {...props}>
            <a className={styles.button}>
                {children}
            </a>
        </Link>
    );
}

export function TransparentButton(props: ButtonProps) {
    return (
        <a className={styles.button} onClick={props.onClick} style={{...props.style, backgroundColor: 'transparent', border: '2px solid #000'}}>
            {props.children}
        </a>
    );

}