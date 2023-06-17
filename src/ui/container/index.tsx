import { HTMLProps, PropsWithChildren } from "react";
import styles from './container.module.css'

export default function Container(props: PropsWithChildren<HTMLProps<HTMLDivElement>>) {
  const { children, ...rest } = props;
  return (
    <div {...rest} className={`${styles.container} ${rest.className ? rest.className : ''}`}>
      <div className={styles.inner}>
        {children}
      </div>
    </div>
  );
}