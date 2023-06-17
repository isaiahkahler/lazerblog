import { HTMLProps, PropsWithChildren } from "react";
import styles from './card.module.css'

export default function Card(props: PropsWithChildren<HTMLProps<HTMLDivElement>>) {
  const {children, ...rest} = props;
  return (
    <span {...rest} className={`${styles.card} ${rest.className ? rest.className : ''}`}>
      {children}
    </span>
  );
}