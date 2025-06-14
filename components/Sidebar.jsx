"use client";
import { useSelector } from 'react-redux';
import Link from 'next/link';

const Sidebar = () => {
    const { isDarkMode } = useSelector((state) => state.theme);
    const userMetrics = useSelector((state) => state.userMetrics || {});
    const imc = userMetrics.imc ?? 0;
    const weeklyCalories = userMetrics.weeklyCalories ?? 0;
    const user = useSelector((state) => state.user);

    const menuItems = [
        { title: 'Dashboard', icon: '📊', path: '/dashboard' },
        { title: 'Rutinas', icon: '💪', path: '/routines' },
        { title: 'Dieta', icon: '🥗', path: '/diet' },
        { title: 'Progreso', icon: '📈', path: '/progress' },
        { title: 'Comunidad', icon: '👥', path: '/community' },
    ];

    return (
        <aside className={`sidebar ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
            <style jsx>{`
                .sidebar {
                    position: fixed;
                    top: 64px;
                    left: 0;
                    width: 250px;
                    height: calc(100vh - 64px);
                    padding: 20px;
                    background: var(--bg-color);
                    color: var(--text-color);
                    box-shadow: 2px 0 5px rgba(0,0,0,0.1);
                    z-index: 1000;
                    overflow-y: auto;
                }

                .dark-mode {
                    --bg-color: #1a1a1a;
                    --text-color: #ffffff;
                }

                .light-mode {
                    --bg-color: #ffffff;
                    --text-color: #000000;
                }

                .stats-container {
                    margin-bottom: 20px;
                }

                .stat-card {
                    background: rgba(0,0,0,0.05);
                    border-radius: 8px;
                    padding: 12px;
                    margin-bottom: 8px;
                }

                .stat-card small {
                    display: block;
                    color: var(--text-color);
                    opacity: 0.7;
                }

                .nav-menu {
                    list-style: none;
                    padding: 0;
                    margin: 0;
                }

                .nav-item {
                    margin-bottom: 8px;
                }

                .nav-link {
                    display: flex;
                    align-items: center;
                    padding: 10px;
                    border-radius: 8px;
                    color: var(--text-color);
                    text-decoration: none;
                    transition: background-color 0.2s;
                }

                .nav-link:hover {
                    background-color: rgba(0,0,0,0.1);
                }

                .nav-link span {
                    margin-right: 10px;
                }

                .user-profile {
                    position: absolute;
                    bottom: 20px;
                    left: 20px;
                    display: flex;
                    align-items: center;
                }

                .user-photo {
                    width: 32px;
                    height: 32px;
                    border-radius: 50%;
                    object-fit: cover;
                }

                @media (max-width: 768px) {
                    .sidebar {
                        transform: translateX(-100%);
                        transition: transform 0.3s ease;
                    }

                    .sidebar.active {
                        transform: translateX(0);
                    }
                }
            `}</style>

            <div className="stats-container">
                <div className="stat-card">
                    <small>IMC</small>
                    <strong>{imc.toFixed(1)}</strong>
                </div>
                <div className="stat-card">
                    <small>Calorías/Semana</small>
                    <strong>{weeklyCalories} kcal</strong>
                </div>
            </div>

            <nav>
                <ul className="nav-menu">
                    {menuItems.map((item, index) => (
                        <li className="nav-item" key={index}>
                            <Link href={item.path} className="nav-link">
                                <span>{item.icon}</span>
                                {item.title}
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>

            {user.photoURL && (
                <div className="user-profile">
                    <img
                        src={user.photoURL}
                        alt="Foto de perfil"
                        className="user-photo"
                    />
                </div>
            )}
        </aside>
    );
};

export default Sidebar; 