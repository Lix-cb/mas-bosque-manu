import { Navigate, Outlet, Route, Routes } from 'react-router-dom';

import { AdminShell } from '../components/admin-shell';
import { useDemo } from '../hooks/use-demo';
import { ContentPage } from '../pages/content';
import { DashboardPage } from '../pages/dashboard';
import { ErrorPage, NotFoundPage } from '../pages/error';
import { IncidentDetailPage } from '../pages/incident-detail';
import { IncidentsPage } from '../pages/incidents';
import { LocationsPage } from '../pages/locations';
import { LoginPage } from '../pages/login';
import { ReportsPage } from '../pages/reports';
import { RescuersPage } from '../pages/rescuers';
import { SettingsPage } from '../pages/settings';

/**
 * Route tree of the admin panel:
 *   access   A01 → A02
 *   menu     A02 ↔ A03 / A04 / A05 / A06 / A07 / A08
 *   errors   A03–A08 → A09, and A09 → previous section or A02
 */
export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LoginGate />} />
      <Route element={<RequireDemoSession />}>
        <Route element={<AdminShell />}>
          <Route path="/panel" element={<DashboardPage />} />
          <Route path="/incidentes" element={<IncidentsPage />} />
          <Route path="/incidentes/:id" element={<IncidentDetailPage />} />
          <Route path="/rescatistas" element={<RescuersPage />} />
          <Route path="/mapas" element={<LocationsPage />} />
          <Route path="/contenido" element={<ContentPage />} />
          <Route path="/reportes" element={<ReportsPage />} />
          <Route path="/configuracion" element={<SettingsPage />} />
          <Route path="/error" element={<ErrorPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Route>
    </Routes>
  );
}

/** A01. Skips straight to the dashboard when the demo session is already open. */
function LoginGate() {
  const { signedIn } = useDemo();
  if (signedIn) return <Navigate to="/panel" replace />;
  return <LoginPage />;
}

/**
 * Keeps the panel behind A01. This is only navigation, not security: there is no
 * backend or authorization in this stage.
 */
function RequireDemoSession() {
  const { signedIn } = useDemo();
  if (!signedIn) return <Navigate to="/" replace />;
  return <Outlet />;
}
