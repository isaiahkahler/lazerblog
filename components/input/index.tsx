import styles from './input.module.css'
import { ForwardedRef, forwardRef, HTMLProps, LegacyRef } from 'react';

// interface ExtraInputProps {
//     children?: React.ReactNode,
//     setValue?: (newValue: string) => void,
//     isValid?: boolean,
//     invalidMessage?: string,
//     ref?: ForwardedRef<HTMLInputElement>
// }

// export type InputProps = ExtraInputProps & HTMLProps<HTMLInputElement>;
// type TextAreaProps = ExtraInputProps & HTMLProps<HTMLTextAreaElement>;

// code review: turn warning colors into global constants? (used over multiple components as text)

type CustomInputProps = HTMLProps<HTMLInputElement> & {isValid: boolean, ref: ForwardedRef<HTMLInputElement>};
type CustomTextAreaProps = HTMLProps<HTMLTextAreaElement> & {isValid: boolean};


export default function CustomInput(props: CustomInputProps) {
    const borderStyle = props.isValid === false ? { border: '2px solid #cc0f35' } : {};

    // const newProps : any = {...props};

    // const invalidMessage =  newProps.invalidMessage;
    // delete newProps.invalidMessage;
    // const label = newProps.label;
    // delete newProps.label;
    // const isValid = newProps.isValid;
    // delete newProps.isValid;
    // const setValue = newProps.setValue;
    // delete newProps.setValue;

    return (
        <input type="text" {...props} className={`${props.className ? props.className : ''} ${styles.input}`} style={{...props.style, ...borderStyle}} />
        // <>
            // {/* {label ? <h2 className={styles.label}><label htmlFor={newProps.id}>{label}</label></h2> : undefined} */}
            // {/* {isValid === false ? <h3 style={{ color: "#cc0f35", marginTop: '0' }}>{invalidMessage}</h3> : undefined} */}
        // </>
    );
}

// export const CustomInputWithRef = forwardRef<CustomInputProps>((props, ref) => <CustomInput {...props} ref={ref} />)
// CustomInputWithRef.displayName = 'CustomInputWithRef';

export function useCustomInputProps(isValid?: boolean, className?: string) {
    const borderStyle = (isValid === undefined) ? {} : isValid === false ? { border: '2px solid #cc0f35' } : {};
    return {
        className: className === undefined ? styles.input : `${className} ${styles.input}`,
        style: borderStyle,
    }
}

export function InputLabel(props: HTMLProps<HTMLHeadingElement>) {
    if (!props.children) return null;
    return (<p {...props} className={`${props.className} ${styles.label}`}><label htmlFor={props.id}>{props.children}</label></p>);
}

export function InputInvalidMessage(props: HTMLProps<HTMLHeadElement> & {isValid: boolean}) {
    return !props.isValid ? <p style={{ color: "#cc0f35", marginTop: '0' }}>{props.children}</p> : null;
}


/**
 * 
 * @param props make sure to include name, id, placeholder, onChange
 * @returns 
 */
export function CustomTextArea(props: CustomTextAreaProps) {
    const borderStyle = props.isValid === false ? { border: '2px solid #cc0f35' } : {};


    // const newProps : any = {...props};

    // const invalidMessage = newProps.invalidMessage;
    // delete newProps.invalidMessage;
    // const label = newProps.label;
    // delete newProps.label;
    // const isValid = newProps.isValid;
    // delete newProps.isValid;
    // const setValue = newProps.setValue;
    // delete newProps.setValue;

    return (
        // <>
        //     {label ? <h2 className={styles.label}><label htmlFor={newProps.id}>{label}</label></h2> : undefined}
            <textarea rows={3} {...props} className={`${props.className ? props.className : ''} ${styles.input}`} style={borderStyle}></textarea>
        //     {isValid === false ? <h3 style={{ color: "#cc0f35", marginTop: '0' }}>{invalidMessage}</h3> : undefined}
        // </>
    );
}