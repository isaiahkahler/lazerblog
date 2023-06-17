import styles from './progress.module.css'

export default function CircleProgress() {
  return(
    <progress className={styles['pure-material-progress-circular']} />
  );
}

export function SmallCircleProgress() {
  return(
    <progress className={styles['pure-material-progress-circular']} style={{width: '30px', height: '30px'}} />
  );
}