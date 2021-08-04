import styles from './input.module.css'

interface InputProps {
    children?: React.ReactNode,
    value: string,
    setValue: (newValue: string) => void,
    id?: string,
    label?: string,
    isValid?: boolean,
    invalidMessage?: string,
    placeholder?: string,
    className?: string
}

// code review: turn warning colors into global constants? (used over multiple components as text)
export default function Input(props: InputProps) {
    const borderStyle = props.isValid === false ? {border: '2px solid #cc0f35'} : {};
    return(
        <>
            {props.label ? <h2 className={styles.label}><label htmlFor={props.id}>{props.label}</label></h2> : undefined}
            <input type="text" className={`${props.className ? props.className : ''} ${styles.input}`} style={borderStyle} value={props.value} onChange={(event) => {props.setValue(event.target.value)}} id={props.id} placeholder={props.placeholder} />
            {props.isValid === false ? <h3 style={{color: "#cc0f35", marginTop: '0'}}>{props.invalidMessage}</h3> : undefined}
        </>
    );
}

interface TextAreaProps {
    placeholder?: string,
}

export function TextArea(props: InputProps & TextAreaProps) {
    const borderStyle = props.isValid === false ? {border: '2px solid #cc0f35'} : {};
    return(
        <>
            {props.label? <h2 className={styles.label}><label htmlFor={props.id}>{props.label}</label></h2> : undefined}
            <textarea className={styles.input} style={borderStyle} name={props.id} id={props.id} rows={3} placeholder={props.placeholder} value={props.value} onChange={(event) => {props.setValue(event.target.value)}} ></textarea>
            {props.isValid === false ? <h3 style={{color: "#cc0f35", marginTop: '0'}}>{props.invalidMessage}</h3> : undefined}
        </>
    );
}