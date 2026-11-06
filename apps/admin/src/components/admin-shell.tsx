import {
  Bell,
  FileText,
  Home,
  Map,
  Menu,
  Search,
  Settings,
  ShieldCheck,
  TriangleAlert,
  Users,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';

import { useDemo } from '../hooks/use-demo';
import { Toast } from './ui';
import styles from './layout.module.css';

/**
 * Desktop layout for A02–A09: dark sidebar, light top bar (search, notifications,
 * profile) and the content area. At 1024 px or less the sidebar becomes a drawer.
 */

const NAV = [
  { to: '/panel', label: 'Panel general', Icon: Home },
  { to: '/incidentes', label: 'Incidentes', Icon: TriangleAlert },
  { to: '/rescatistas', label: 'Rescatistas', Icon: Users },
  { to: '/mapas', label: 'Mapas y puntos', Icon: Map },
  { to: '/contenido', label: 'Contenido', Icon: ShieldCheck },
  { to: '/reportes', label: 'Reportes', Icon: FileText },
  { to: '/configuracion', label: 'Configuración', Icon: Settings },
];

export function AdminShell() {
  const location = useLocation();
  const navigate = useNavigate();
  const { incidents, teams, lastSaveLabel, clearSaveLabel } = useDemo();
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState('');

  // Close the drawer and clear the search when the route changes. Adjusting state
  // during render avoids the extra render pass a useEffect would cause.
  const [lastPath, setLastPath] = useState(location.pathname);
  if (lastPath !== location.pathname) {
    setLastPath(location.pathname);
    setMenuOpen(false);
    setQuery('');
  }

  const results = useMemo(() => {
    const needle = normalize(query);
    if (needle.length < 2) return [];
    const incidentHits = incidents
      .filter((incident) =>
        [incident.id, incident.title, incident.zone, incident.category].some((field) =>
          normalize(field).includes(needle),
        ),
      )
      .map((incident) => ({
        key: incident.id,
        label: `${incident.id} · ${incident.title}`,
        meta: `Incidente · ${incident.zone}`,
        to: `/incidentes/${incident.id}`,
      }));
    const teamHits = teams
      .filter((team) => normalize(team.name).includes(needle))
      .map((team) => ({
        key: team.id,
        label: team.name,
        meta: 'Rescatistas',
        to: '/rescatistas',
      }));
    return [...incidentHits, ...teamHits].slice(0, 6);
  }, [incidents, query, teams]);

  return (
    <div className={styles.shell}>
      <aside
        className={`${styles.sidebar} ${menuOpen ? styles.sidebarOpen : ''}`}
        aria-label="Navegación principal"
      >
        <div className={styles.brand}>
          <div className={styles.brandMark} aria-hidden>
            <ShieldCheck size={20} color="#fff" />
          </div>
          <div>
            <div className={styles.brandName}>MÁS BOSQUE</div>
            <div className={styles.brandRole}>MANU · ADMIN</div>
          </div>
        </div>

        <nav className={styles.nav}>
          {NAV.map(({ to, label, Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`
              }
            >
              <Icon size={19} aria-hidden />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className={styles.envBadge}>
          <div className={styles.envTitle}>
            <span className={styles.envDot} aria-hidden />
            Entorno conceptual
          </div>
          <div className={styles.envDetail}>Datos de demostración</div>
        </div>
      </aside>

      {menuOpen ? (
        <div className={styles.scrim} onClick={() => setMenuOpen(false)} role="presentation" />
      ) : null}

      <div className={styles.main}>
        <header className={styles.topbar}>
          <button
            type="button"
            className={styles.menuButton}
            onClick={() => setMenuOpen((open) => !open)}
            aria-label="Abrir el menú lateral"
            aria-expanded={menuOpen}
          >
            <Menu size={20} />
          </button>

          <div className={styles.search}>
            <Search size={18} aria-hidden />
            <input
              className={styles.searchInput}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Buscar incidentes, rescatistas..."
              aria-label="Buscar incidentes o rescatistas"
            />
          </div>

          <div className={styles.topbarSpacer} />

          <button
            type="button"
            className={styles.iconButton}
            onClick={() => navigate('/configuracion')}
            aria-label="Notificaciones de demostración"
          >
            <Bell size={19} />
          </button>
          <button
            type="button"
            className={styles.avatar}
            onClick={() => navigate('/configuracion')}
            aria-label="Cuenta de administración de demostración"
          >
            AD
          </button>

          {query.trim().length >= 2 ? (
            <div className={styles.searchResults} role="listbox" aria-label="Resultados de búsqueda">
              {results.length === 0 ? (
                <p className={styles.searchEmpty}>
                  Sin coincidencias en los datos de demostración.
                </p>
              ) : (
                results.map((result) => (
                  <button
                    key={`${result.meta}-${result.key}`}
                    type="button"
                    role="option"
                    aria-selected={false}
                    className={styles.searchResult}
                    onClick={() => navigate(result.to)}
                  >
                    {result.label}
                    <span className={styles.searchResultMeta}>{result.meta}</span>
                  </button>
                ))
              )}
            </div>
          ) : null}
        </header>

        <main className={styles.content}>
          <Outlet />
        </main>
      </div>

      {lastSaveLabel ? <Toast message={lastSaveLabel} onClose={clearSaveLabel} /> : null}
    </div>
  );
}

function normalize(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('es-MX')
    .trim();
}
