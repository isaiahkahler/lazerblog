import styles from './input.module.css'
import { HTMLProps } from 'react';

interface ExtraInputProps {
    children?: React.ReactNode,
    value: string,
    setValue: (newValue: string) => void,
    label?: string,
    isValid?: boolean,
    invalidMessage?: string,
}

type InputProps = ExtraInputProps & HTMLProps<HTMLInputElement>;
type TextAreaProps = ExtraInputProps & HTMLProps<HTMLTextAreaElement>;

// code review: turn warning colors into global constants? (used over multiple components as text)
export default function Input(props: InputProps) {
    const borderStyle = props.isValid === false ? { border: '2px solid #cc0f35' } : {};

    const newProps : any = {...props};

    const invalidMessage =  newProps.invalidMessage;
    delete newProps.invalidMessage;
    const label = newProps.label;
    delete newProps.label;
    const isValid = newProps.isValid;
    delete newProps.isValid;
    const setValue = newProps.setValue;
    delete newProps.setValue;

    return (
        <>
            {label ? <h2 className={styles.label}><label htmlFor={newProps.id}>{label}</label></h2> : undefined}
            <input {...newProps} type="text" className={`${newProps.className ? newProps.className : ''} ${styles.input}`} style={borderStyle} onChange={(event) => { setValue(event.target.value) }} />
            {isValid === false ? <h3 style={{ color: "#cc0f35", marginTop: '0' }}>{invalidMessage}</h3> : undefined}
        </>
    );
}


export function TextArea(props: TextAreaProps) {
    const borderStyle = props.isValid === false ? { border: '2px solid #cc0f35' } : {};


    const newProps : any = {...props};

    const invalidMessage = newProps.invalidMessage;
    delete newProps.invalidMessage;
    const label = newProps.label;
    delete newProps.label;
    const isValid = newProps.isValid;
    delete newProps.isValid;
    const setValue = newProps.setValue;
    delete newProps.setValue;

    return (
        <>
            {label ? <h2 className={styles.label}><label htmlFor={newProps.id}>{label}</label></h2> : undefined}
            <textarea className={styles.input} style={borderStyle} name={newProps.id} id={newProps.id} rows={3} placeholder={newProps.placeholder} onChange={(event) => { setValue(event.target.value) }} ></textarea>
            {isValid === false ? <h3 style={{ color: "#cc0f35", marginTop: '0' }}>{invalidMessage}</h3> : undefined}
        </>
    );
}