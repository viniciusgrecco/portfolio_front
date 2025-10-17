import React from 'react';

/**
 * Simple placeholder alert-dialog components to satisfy imports.
 * Replace with Radix/shadcn implementation later if needed.
 */

export const AlertDialog: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <div role="dialog" aria-modal="true">{children}</div>
);

export const AlertDialogTrigger: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <span>{children}</span>
);

export const AlertDialogPortal: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <div>{children}</div>
);

export const AlertDialogCancel: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <button>{children ?? 'Cancel'}</button>
);

export const AlertDialogContent: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <div style={{ padding: 12, border: '1px solid #ddd', borderRadius: 8 }}>{children}</div>
);

export const AlertDialogDescription: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <p>{children}</p>
);

export const AlertDialogFooter: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <div style={{ marginTop: 8 }}>{children}</div>
);

export const AlertDialogHeader: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <div style={{ fontWeight: 700 }}>{children}</div>
);

export const AlertDialogTitle: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <h3 style={{ margin: 0 }}>{children}</h3>
);
export const AlertDialogAction: React.FC<{
  children?: React.ReactNode;
  onClick?: () => void;
}> = ({ children, onClick }) => (
  <button
    onClick={onClick}
    style={{
      marginLeft: 8,
      padding: '8px 12px',
      borderRadius: 6,
      background: '#2563eb',
      color: '#fff',
      border: 'none',
      cursor: 'pointer',
    }}
  >
    {children ?? 'Confirmar'}
  </button>
);
