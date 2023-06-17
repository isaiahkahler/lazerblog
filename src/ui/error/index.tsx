import { mdiClose } from "@mdi/js";
import Icon from "@mdi/react";
import { HTMLProps, PropsWithChildren } from "react";
import { IconButton } from "../button";
import Card from "../card";
import Container from "../container";
import styles from './error.module.css';

export function ErrorText(props: PropsWithChildren<HTMLProps<HTMLParagraphElement>>) {
  const { children, ...rest } = props;
  return <p {...rest} className={styles.error}>{children}</p>
}

interface ErrorMessageProps {
  title?: string
}
export function ErrorMessage(props: PropsWithChildren<HTMLProps<HTMLParagraphElement>> & ErrorMessageProps) {
  const { title, children, ...rest } = props;
  return <>
    <h2 className={styles.error}>{title ? title : 'An error occurred:'}</h2>
    <ErrorText>{children}</ErrorText>
  </>

}

interface ErrorAlertUIProps {
  errors?: any[],
  removeIndex: (index: number) => void
}

function getMessage(error: any) {
  if (error.hasOwnProperty('message')) {
    return error.message;
  }
  return JSON.stringify(error);
}

export function ErrorAlertUI(props: ErrorAlertUIProps) {
  const { errors, removeIndex } = props;


  const messages = errors ? errors.map(error => getMessage(error)) : [];

  if (errors && errors.length > 0) {
    return (
      <div className={styles.errorAlertUI}>
        {messages.map((message, index) =>
          <Card key={index}>
            <button className={styles.errorAlertUIClose} onClick={() => {console.log('click', index);removeIndex(index)}}><Icon path={mdiClose} size={1} /></button>
            <ErrorMessage>{message}</ErrorMessage>
          </Card>)}
      </div>
    );
  }

  return <></>;
}