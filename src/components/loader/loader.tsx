import styles from "./loader.module.css";

export default function Loader({
    width,
    height
}: {
    width?: number;
    height?: number;
}) {
    return <div style={{
        width: width ? `${width}px` : '100%',
        height: height ? `${height}px` : '100%',
    }} className={styles.loaderContainer}>
        <p style={{
            color: "white"
        }}>
            Loading...
        </p>
        <div className={styles.loader}>

        </div>
    </div>
}