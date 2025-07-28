import React from 'react';

export default function TextInput({
  label,
  name,
  type = 'text',
  value,
  onChange,
  placeholder,
  readOnly,
  required = false,
}) {
  return (
    <div className="mb-4">
      {label && (
        <label
          htmlFor={name}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
        </label>
      )}
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        readOnly={readOnly}
        className="w-full px-3 text-lg py-3 border border-gray-300 shadow-sm focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-gray-200 transition"
      />
    </div>
  );
}
