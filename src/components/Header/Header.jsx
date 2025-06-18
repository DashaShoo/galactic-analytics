import { Link, useLocation } from 'react-router-dom';
import styles from "./Header.module.css";

export const Header = () =>{
    const location = useLocation();

    return (
        <header className={styles.header}>
            <div className={styles.left}>
                <img src="/images/Logo.svg" alt="Логотип" className={styles.logo} />
                <span className={styles.title}>МЕЖГАЛАКТИЧЕСКАЯ АНАЛИТИКА</span>
            </div>
            <nav className={styles.menu}>
                <Link to="/" className={`${styles.link} ${location.pathname === '/' ? styles.active : ''}`}>
                    <img src="/images/Download.svg" alt=""/>
                    CSV Аналитик
                </Link>
                <Link to="/generate" className={`${styles.link} ${location.pathname === '/generate' ? styles.active : ''}`}>
                    <img src="/images/Generator.svg" alt=""/>
                    CSV Генератор
                </Link>
                <Link to="/history" className={`${styles.link} ${location.pathname === '/history' ? styles.active : ''}`}>
                    <img src="/images/History.svg" alt=""/>
                    История
                </Link>
            </nav>
        </header>
    );
};