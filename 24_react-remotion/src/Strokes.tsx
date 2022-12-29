import styles from './Strokes.module.css';

export const Strokes = () => {
	return (
		<svg className={styles['strokes-container']} viewBox="0 0 1 1">
			<path
				d="M0.3,0.5a0.2,0.45 0 1,0 0.4,0a0.2,0.45 0 1,0 -0.4,0"
				className={`${styles['stroke-path']} ${styles['stroke-path--first']}`}
			/>
			<path
				d="M0.3,0.5a0.2,0.45 0 1,0 0.4,0a0.2,0.45 0 1,0 -0.4,0"
				className={`${styles['stroke-path']} ${styles['stroke-path--second']}`}
			/>
			<path
				d="M0.3,0.5a0.2,0.45 0 1,0 0.4,0a0.2,0.45 0 1,0 -0.4,0"
				className={`${styles['stroke-path']} ${styles['stroke-path--third']}`}
			/>
		</svg>
	);
};
