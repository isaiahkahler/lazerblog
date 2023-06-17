import styles from './input.module.css'
import { ForwardedRef, forwardRef, HTMLProps, PropsWithChildren, useId } from 'react';


type CustomInputProps = { invalid?: boolean };

// function Input(props: HTMLProps<HTMLInputElement> & CustomInputProps) {
//   const { invalid, ...rest } = props;

//   return (
//     <input type="text" {...rest} className={`${props.className ? props.className : ''} ${styles.input} ${invalid ? styles.invalid : ''}`} />
//   );
// }

const Input = forwardRef<HTMLInputElement, HTMLProps<HTMLInputElement> & CustomInputProps>((props: HTMLProps<HTMLInputElement> & CustomInputProps, ref) => {
  const { invalid, ...rest } = props;

  return (<input ref={ref} type="text" {...rest} className={`${props.className ? props.className : ''} ${styles.input} ${invalid ? styles.invalid : ''}`} />);
});
Input.displayName = 'Input';
export default Input;


export function InputLabel(props: HTMLProps<HTMLLabelElement>) {
  if (!props.children) return null;
  return (<label {...props} className={`${props.className} ${styles.label}`}>{props.children}</label>);
}

export function InputInvalidMessage(props: HTMLProps<HTMLParagraphElement> & CustomInputProps) {
  const { invalid, ...rest } = props;
  return invalid ? <p {...rest} className={styles.invalidLabel} style={{ marginTop: '0' }}>{props.children}</p> : null;
}


export function InputTextArea(props: HTMLProps<HTMLTextAreaElement> & CustomInputProps) {
  const { invalid, ...rest } = props;

  return (
    <textarea rows={3} {...rest} className={`${props.className ? props.className : ''} ${styles.input} ${invalid ? styles.invalid : ''}`}></textarea>
  );
}

export function InputContainer(props: PropsWithChildren<HTMLProps<HTMLSpanElement>>) {
  const { children, ...rest } = props;

  return (
    <span {...rest} className={`${styles.inputLabelContainer} ${rest.className ? rest.className : ''}`}>
      {children}
    </span>
  );
}

