import { Lock, Plus, ShieldCheck } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  Button,
  Notice,
} from '../components/ui';
import { useDemo } from '../hooks/use-demo';
import styles from './login.module.css';

/**
 * A01 · Admin sign in. There is no real authentication: any input opens the demo
 * session, and nothing is stored or sent. Goes to A02.
 */
export function LoginPage() {
  const navigate = useNavigate();
  const { signIn } = useDemo();
  const [email, setEmail] = useState('admin@organizacion.mx');
  const [password, setPassword] = useState('demostracion');

  const enter = () => {
    signIn();
    navigate('/panel');
  };

  return (
    <div className={styles.page}>
      <section className={styles.intro}>
        <div className={styles.mark} aria-hidden>
          <ShieldCheck size={30} color="#fff" />
        </div>
        <h1 className={styles.title}>Más Bosque Manu</h1>
        <p className={styles.subtitle}>Central de administración</p>
        <p className={styles.lead}>Seguridad, coordinación y seguimiento para el bosque.</p>

        <div className={styles.restricted}>
          <Lock size={18} aria-hidden />
          <span className={styles.restrictedLabel}>ACCESO RESTRINGIDO · DEMO</span>
        </div>
      </section>

      <form
        className={styles.formCard}
        onSubmit={(event) => {
          event.preventDefault();
          enter();
        }}
      >
        <h2 className={styles.formTitle}>Iniciar sesión</h2>
        <p className={styles.formLead}>Ingresa tus credenciales autorizadas</p>

        <div className={styles.fields}>
          <div className={styles.fieldShell}>
            <label className={styles.fieldLabel} htmlFor="admin-email">
              Correo electrónico
            </label>
            <input
              id="admin-email"
              className={styles.fieldInput}
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="off"
            />
          </div>

          <div className={styles.fieldShell}>
            <label className={styles.fieldLabel} htmlFor="admin-password">
              Contraseña
            </label>
            <input
              id="admin-password"
              className={styles.fieldInput}
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="off"
            />
          </div>
        </div>

        <div className={styles.submit}>
          <Button type="submit" icon={<Plus size={18} aria-hidden />}>
            Entrar al panel
          </Button>
        </div>

        <p className={styles.help}>¿Problemas de acceso? Contacta al administrador.</p>

        <div className={styles.demoNote}>
          <Notice tone="warning">
            Acceso de demostración. No se validan credenciales ni se guarda ninguna
            contraseña; cualquier valor entra al panel.
          </Notice>
        </div>
      </form>
    </div>
  );
}
