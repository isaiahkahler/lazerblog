import styles from './box.module.css'


interface BoxProps {
    children?: React.ReactNode,
    style?: React.CSSProperties | undefined,
}

export default function Box(props: BoxProps) {
    return(
        <div className={styles.box} style={{...props.style}}>
            {props.children}
        </div>
    );
}