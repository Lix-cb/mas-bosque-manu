import { AlertCircle, AlertTriangle, CheckCircle2, Info, X } from 'lucide-react';
import { useEffect, useEffectEvent, useRef, type ReactNode } from 'react';

import styles from './ui.module.css';

export function Card({
  children,
  tone = 'surface',
  flush = false,
  className,
}: {
  children: ReactNode;
  tone?: 'surface' | 'soft';
  flush?: boolean;
  className?: string;
}) {
  return (
    <section
      className={[styles.card, tone === 'soft' && styles.cardSoft, flush && styles.cardFlush, className]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </section>
  );
}

export function PageHead({
  title,
  subtitle,
  actions,
}: {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}) {
  return (
    <header className={styles.pageHead}>
      <div className={styles.pageHeadText}>
        <h1 className={styles.pageTitle}>{title}</h1>
        {subtitle ? <p className={styles.pageSubtitle}>{subtitle}</p> : null}
      </div>
      {actions}
    </header>
  );
}

type ButtonKind = 'primary' | 'secondary' | 'ghost' | 'danger';

export function Button({
  children,
  onClick,
  kind = 'primary',
  type = 'button',
  disabled = false,
  icon,
  title,
}: {
  children: ReactNode;
  onClick?: () => void;
  kind?: ButtonKind;
  type?: 'button' | 'submit';
  disabled?: boolean;
  icon?: ReactNode;
  title?: string;
}) {
  const kindClass = {
    primary: styles.buttonPrimary,
    secondary: styles.buttonSecondary,
    ghost: styles.buttonGhost,
    danger: styles.buttonDanger,
  }[kind];

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`${styles.button} ${kindClass}`}
    >
      {icon}
      {children}
    </button>
  );
}

export type TagTone = 'danger' | 'warning' | 'success' | 'info' | 'neutral';

export function Tag({ children, tone }: { children: string; tone: TagTone }) {
  const toneClass = {
    danger: styles.tagDanger,
    warning: styles.tagWarning,
    success: styles.tagSuccess,
    info: styles.tagInfo,
    neutral: styles.tagNeutral,
  }[tone];
  return <span className={`${styles.tag} ${toneClass}`}>{children}</span>;
}

export function Notice({
  tone,
  children,
}: {
  tone: 'info' | 'warning' | 'danger' | 'success' | 'admin';
  children: ReactNode;
}) {
  const toneClass = {
    info: styles.noticeInfo,
    warning: styles.noticeWarning,
    danger: styles.noticeDanger,
    success: styles.noticeSuccess,
    admin: styles.noticeAdmin,
  }[tone];

  const Icon = {
    info: Info,
    warning: AlertTriangle,
    danger: AlertCircle,
    success: CheckCircle2,
    admin: Info,
  }[tone];

  return (
    <div role="status" className={`${styles.notice} ${toneClass}`}>
      <Icon size={16} className={styles.noticeIcon} aria-hidden />
      <div>{children}</div>
    </div>
  );
}

/** Single-choice chip row used as a filter. */
export function ChipGroup<T extends string>({
  options,
  value,
  onChange,
  label,
  extra,
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
  label: string;
  extra?: ReactNode;
}) {
  return (
    <div className={styles.chipRow} role="tablist" aria-label={label}>
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            role="tab"
            aria-selected={selected}
            onClick={() => onChange(option.value)}
            className={`${styles.chip} ${selected ? styles.chipActive : ''}`}
          >
            {option.label}
          </button>
        );
      })}
      {extra}
    </div>
  );
}

export function ListRow({
  icon,
  title,
  detail,
  right,
}: {
  icon: ReactNode;
  title: string;
  detail?: string;
  right?: ReactNode;
}) {
  return (
    <div className={styles.listRow}>
      <div className={styles.listIcon} aria-hidden>
        {icon}
      </div>
      <div className={styles.listText}>
        <div className={styles.listTitle}>{title}</div>
        {detail ? <div className={styles.listDetail}>{detail}</div> : null}
      </div>
      {right}
    </div>
  );
}

export function Field({
  label,
  children,
  htmlFor,
}: {
  label: string;
  children: ReactNode;
  htmlFor?: string;
}) {
  return (
    <div className={styles.field}>
      <label className={styles.fieldLabel} htmlFor={htmlFor}>
        {label}
      </label>
      {children}
    </div>
  );
}

export function EmptyState({
  icon,
  title,
  body,
  action,
}: {
  icon: ReactNode;
  title: string;
  body: string;
  action?: ReactNode;
}) {
  return (
    <div className={styles.emptyState}>
      <div className={styles.emptyIcon} aria-hidden>
        {icon}
      </div>
      <h2 className={styles.emptyTitle}>{title}</h2>
      <p className={styles.emptyBody}>{body}</p>
      {action}
    </div>
  );
}

/**
 * Accessible dialog. Closes with Escape or a click on the backdrop, locks page
 * scroll while open and returns focus to the previous element when it closes.
 */
export function Modal({
  open,
  title,
  description,
  onClose,
  children,
  actions,
}: {
  open: boolean;
  title: string;
  description?: string;
  onClose: () => void;
  children?: ReactNode;
  actions: ReactNode;
}) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);
  // Read the latest onClose without re-running the effect below. Otherwise a parent
  // re-render with a new callback would move focus out of the input being typed in.
  const handleClose = useEffectEvent(onClose);

  useEffect(() => {
    if (!open) return;
    previouslyFocused.current = document.activeElement as HTMLElement | null;
    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') handleClose();
    };
    document.addEventListener('keydown', onKeyDown);
    dialogRef.current?.focus();

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = overflow;
      previouslyFocused.current?.focus();
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className={styles.backdrop} onClick={onClose} role="presentation">
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
        className={styles.dialog}
        onClick={(event) => event.stopPropagation()}
      >
        <h2 className={styles.dialogTitle}>{title}</h2>
        {description ? <p className={styles.dialogBody}>{description}</p> : null}
        {children}
        <div className={styles.dialogActions}>{actions}</div>
      </div>
    </div>
  );
}

/** Auto-dismissing confirmation message (5 s). */
export function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  useEffect(() => {
    const timer = window.setTimeout(onClose, 5000);
    return () => window.clearTimeout(timer);
  }, [message, onClose]);

  return (
    <div className={styles.toast} role="status" aria-live="polite">
      <CheckCircle2 size={18} color="var(--success)" aria-hidden />
      <div style={{ flex: 1 }}>{message}</div>
      <button type="button" className={styles.toastClose} onClick={onClose} aria-label="Cerrar aviso">
        <X size={16} />
      </button>
    </div>
  );
}
