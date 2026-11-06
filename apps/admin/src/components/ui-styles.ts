import styles from './ui.module.css';

/**
 * CSS module classes that pages apply directly to `<input>`, `<select>` and
 * `<table>`. Kept out of `ui.tsx` so that file only exports components (Fast Refresh).
 */
export const fieldStyles = {
  input: styles.input,
  textarea: styles.textarea,
  select: styles.select,
};

export const tableStyles = {
  wrapper: styles.tableWrapper,
  table: styles.table,
  rowButton: styles.tableRowButton,
};
