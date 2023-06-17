import { HTMLProps, PropsWithChildren } from 'react';
import styles from './layout.module.css';

export default function Layout(props: PropsWithChildren<HTMLProps<HTMLDivElement>>) {
  const {children, ...rest} = props;

    return (
        <div {...rest} className={`${styles.layout} ${rest.className ? rest.className : ''}`}>
            {children}
        </div>
    );
}