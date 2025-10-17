import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Input: React.FC<InputProps> = ({ label, ...props }) => {
  return (
    <>
      {label && <label style={{ display: 'block', marginBottom: 6 }}>{label}</label>}
      <input
        {...props}
        style={{
          padding: '8px 10px',
          borderRadius: 6,
          border: '1px solid #ccc',
          fontSize: 14,
        }}
      />
    </>
  );
};
