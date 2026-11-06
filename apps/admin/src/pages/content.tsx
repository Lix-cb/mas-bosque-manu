import { FolderOpen, Map, Plus, ShieldCheck, TriangleAlert } from 'lucide-react';
import { useState } from 'react';

import {
  Button,
  Card,
  Field,
  ListRow,
  Modal,
  Notice,
  PageHead,
  Tag,
} from '../components/ui';
import { fieldStyles } from '../components/ui-styles';
import { useDemo } from '../hooks/use-demo';
import type { DemoContent } from '../types/models';
import styles from './pages.module.css';

const ICONS = {
  shield: ShieldCheck,
  map: Map,
  alert: TriangleAlert,
  folder: FolderOpen,
};

/** A06 · Safety content. Saving only updates memory; nothing is published. */
export function ContentPage() {
  const { contents, saveContent, addContent } = useDemo();
  const [editing, setEditing] = useState<DemoContent | null>(null);
  const [creating, setCreating] = useState(false);

  const drafts = contents.filter((item) => item.status === 'borrador').length;

  return (
    <div className={styles.stack}>
      <PageHead title="Contenido de seguridad" subtitle="Información disponible para visitantes" />

      <div className={styles.toolbar}>
        <Button icon={<Plus size={18} aria-hidden />} onClick={() => setCreating(true)}>
          Nuevo contenido
        </Button>
        <Tag tone="warning">{`Borradores ${drafts}`}</Tag>
      </div>

      <Card>
        <h2 className={styles.sectionTitle}>Biblioteca de contenidos</h2>
        {contents.map((item) => {
          const Icon = ICONS[item.icon];
          return (
            <ListRow
              key={item.id}
              icon={<Icon size={19} />}
              title={item.title}
              detail={item.summary}
              right={
                <div className={styles.inlineActions}>
                  <Tag tone={item.status === 'publicado' ? 'success' : 'warning'}>
                    {item.status === 'publicado' ? 'Publicado' : 'Borrador'}
                  </Tag>
                  <Button kind="ghost" onClick={() => setEditing(item)}>
                    Editar
                  </Button>
                </div>
              }
            />
          );
        })}
      </Card>

      <div className={styles.highlight}>
        <p className={styles.highlightBody}>
          Los cambios deben revisarse antes de publicarse en mapas y guías.
        </p>
      </div>

      <Notice tone="warning">
        No hay CMS ni publicación real. Guardar sólo modifica la copia en memoria de este
        navegador; nada llega a la aplicación del visitante.
      </Notice>

      <ContentEditor
        content={editing}
        onClose={() => setEditing(null)}
        onSave={(next) => {
          saveContent(next);
          setEditing(null);
        }}
      />

      <NewContentModal
        open={creating}
        onClose={() => setCreating(false)}
        onCreate={(next) => {
          addContent(next);
          setCreating(false);
        }}
      />
    </div>
  );
}

function ContentEditor({
  content,
  onClose,
  onSave,
}: {
  content: DemoContent | null;
  onClose: () => void;
  onSave: (content: DemoContent) => void;
}) {
  const [draft, setDraft] = useState<DemoContent | null>(content);

  // Reset the draft when a different item is opened.
  if (content && (!draft || draft.id !== content.id)) {
    setDraft(content);
  }

  if (!content || !draft) {
    return (
      <Modal open={false} title="" onClose={onClose} actions={null} />
    );
  }

  const titleError = draft.title.trim().length < 3;

  return (
    <Modal
      open
      title={`Editar «${content.title}»`}
      description="Edición local de demostración. No se publica nada."
      onClose={onClose}
      actions={
        <>
          <Button kind="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            onClick={() => {
              if (titleError) return;
              onSave(draft);
            }}
            disabled={titleError}
          >
            Guardar cambios
          </Button>
        </>
      }
    >
      <div className={styles.formGrid}>
        <Field label="Título" htmlFor="content-title">
          <input
            id="content-title"
            className={fieldStyles.input}
            value={draft.title}
            onChange={(event) => setDraft({ ...draft, title: event.target.value })}
            aria-invalid={titleError}
          />
          {titleError ? (
            <p style={{ color: 'var(--danger)', fontSize: 13, marginTop: 6 }}>
              El título necesita al menos tres caracteres.
            </p>
          ) : null}
        </Field>

        <Field label="Resumen" htmlFor="content-summary">
          <input
            id="content-summary"
            className={fieldStyles.input}
            value={draft.summary}
            onChange={(event) => setDraft({ ...draft, summary: event.target.value })}
          />
        </Field>

        <Field label="Cuerpo" htmlFor="content-body">
          <textarea
            id="content-body"
            className={fieldStyles.textarea}
            value={draft.body}
            onChange={(event) => setDraft({ ...draft, body: event.target.value })}
          />
        </Field>

        <Field label="Estado" htmlFor="content-status">
          <select
            id="content-status"
            className={fieldStyles.select}
            value={draft.status}
            onChange={(event) =>
              setDraft({ ...draft, status: event.target.value as DemoContent['status'] })
            }
          >
            <option value="borrador">Borrador</option>
            <option value="publicado">Publicado</option>
          </select>
        </Field>
      </div>
    </Modal>
  );
}

function NewContentModal({
  open,
  onClose,
  onCreate,
}: {
  open: boolean;
  onClose: () => void;
  onCreate: (content: DemoContent) => void;
}) {
  const [title, setTitle] = useState('');
  const [touched, setTouched] = useState(false);
  const titleError = touched && title.trim().length < 3;

  const submit = () => {
    setTouched(true);
    if (title.trim().length < 3) return;
    onCreate({
      id: `contenido-${Date.now()}`,
      title: title.trim(),
      summary: 'Resumen pendiente',
      body: 'Contenido pendiente de redacción.',
      status: 'borrador',
      icon: 'folder',
      isDemo: true,
    });
    setTitle('');
    setTouched(false);
  };

  return (
    <Modal
      open={open}
      title="Nuevo contenido de demostración"
      description="Se crea como borrador local. No se publica en ninguna aplicación."
      onClose={onClose}
      actions={
        <>
          <Button kind="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={submit}>Crear borrador</Button>
        </>
      }
    >
      <div className={styles.formGrid}>
        <Field label="Título" htmlFor="new-content-title">
          <input
            id="new-content-title"
            className={fieldStyles.input}
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            onBlur={() => setTouched(true)}
            aria-invalid={titleError}
            placeholder="Ej. Qué llevar en temporada de lluvias"
          />
          {titleError ? (
            <p style={{ color: 'var(--danger)', fontSize: 13, marginTop: 6 }}>
              Escribe al menos tres caracteres.
            </p>
          ) : null}
        </Field>
      </div>
    </Modal>
  );
}
