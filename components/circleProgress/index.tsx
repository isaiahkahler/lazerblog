import styles from './progress.module.css'

export default function CircleProgress() {
  return(
    <progress className={styles['pure-material-progress-circular']} />
  );
}