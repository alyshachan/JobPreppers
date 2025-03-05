import styles from "./Pacman.module.css";
const PacmanLoader = ({
  size = 60,
  pacmanColor = "#fffb16",
  ballColor = "#db851c",
}) => {
  return (
    <>
      <div
        className={styles.loader}
        style={{
          "--pacman-size": `${size}px`,
          "--pacman-color": pacmanColor,
          "--ball-color": ballColor,
        }}
      >
        <div className={styles.circles}>
          <span className={styles.one}></span>
          <span className={styles.two}></span>
          <span className={styles.three}></span>
        </div>
        <div className={styles.pacman}>
          <span className={styles.top}></span>
          <span className={styles.bottom}></span>
          <span className={styles.left}></span>
        </div>
      </div>
    </>
  );
};

export default PacmanLoader;
