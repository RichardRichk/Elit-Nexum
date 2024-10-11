import React from 'react';
import styles from './style.module.css';

const WaveComponent = ({ children }) => {
    return (
        <div className={styles.box}>
            <div className={`${styles.wave} ${styles.one}`}></div>
            <div className={`${styles.wave} ${styles.two}`}></div>
            <div className={`${styles.wave} ${styles.three}`}></div>
            <div className={styles.content}>{children}</div>
        </div>
    );
};

export default WaveComponent;