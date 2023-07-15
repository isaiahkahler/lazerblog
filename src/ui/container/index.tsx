import { HTMLProps, PropsWithChildren } from "react";
import styles from './container.module.css'

export default function Container(props: PropsWithChildren<HTMLProps<HTMLDivElement>>) {
  const { children, ...rest } = props;
  return (
    <div className={styles.container}>
      <div {...rest} className={`${styles.inner} ${rest.className ? rest.className : ''}`}>
        {children}
      </div>
    </div>
  );
}