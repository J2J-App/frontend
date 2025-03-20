import styles from './Switch.module.css';

export default function Switch({checked=false}: {
    checked?: boolean;
}){
  return (
    <div>
        <label className={`${styles.switch}`}>
            <input className={`${styles.checked}`} defaultChecked={checked} type='checkbox'/>
            <span className={`${styles.slider} ${styles.round}`}></span>
        </label>
    </div>
  );
};
