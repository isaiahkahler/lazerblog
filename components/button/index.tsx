import React, { PropsWithChildren } from 'react'
import styles from './button.module.css'
import Link, {LinkProps} from 'next/link'

interface ButtonProps {
    children?: React.ReactNode,
    onClick?: () => void
}

export default function Button(props: ButtonProps) {
    return(
        <a className={styles.button} onClick={props.onClick}>
            {props.children}
        </a>
    );
}

export function LinkButton({children, ...props}: PropsWithChildren<LinkProps>) {
    return(
        <Link {...props}>
            <a className={styles.button}>
                {children}
            </a>
        </Link>
    );
}