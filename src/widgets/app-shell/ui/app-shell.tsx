import { NavLink, Outlet } from 'react-router-dom';

import styles from './appShell.module.css';

export function AppShell() {
  return (
    <div className={styles.shell}>
      <aside className={styles.sidebar}>
        <div className={styles.logo}>
          Deploy<span className={styles.logoAccent}>Watch</span>
        </div>

        <nav className={styles.nav}>
          <NavLink to="/projects">Projects</NavLink>
          <NavLink to="/approvals">Approvals</NavLink>
          <NavLink to="/settings">Settings</NavLink>
        </nav>
      </aside>

      <div className={styles.content}>
        <header className={styles.header}>
          <span className={styles.headerTitle}>CI/CD Monitoring Dashboard</span>
          <span className={styles.headerMeta}>Release Manager</span>
        </header>

        <main className={styles.main}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
