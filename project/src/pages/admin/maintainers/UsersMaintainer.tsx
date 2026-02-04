import React from 'react';
import GenericMaintainer from './GenericMaintainer';

// Definición de las opciones para los selects
const ROLE_OPTIONS = [
    { value: 'admin', label: 'Administrador' },
    { value: 'user_cli', label: 'Cliente' },
    { value: 'scanner', label: 'Scanner' }
];

const GENDER_OPTIONS = [
    { value: 'M', label: 'Masculino' },
    { value: 'F', label: 'Femenino' },
    { value: 'Otro', label: 'Otro' }
];

export default function UsersMaintainer() {
    return (
        <GenericMaintainer
            title="Gestión de Usuarios"
            itemTitle="Usuario"
            endpoint="/users"
            columns={[
                { key: 'id', label: 'ID', visible: false },
                { key: 'name', label: 'Nombre' },
                { key: 'email', label: 'Email' },
                { key: 'role', label: 'Rol' },
                { key: 'phone', label: 'Teléfono' },
                { key: 'has_priority_access', label: 'Acceso Prioritario', type: 'boolean' },
                { key: 'created_at', label: 'Creado', visible: false }
            ]}
            fields={[
                { key: 'name', label: 'Nombre', type: 'text', required: true },
                { key: 'email', label: 'Email', type: 'email', required: true },
                { key: 'password', label: 'Contraseña (Dejar en blanco para no cambiar)', type: 'password', required: false },
                { key: 'phone', label: 'Teléfono', type: 'tel', required: false },
                { key: 'role', label: 'Rol', type: 'select', options: ROLE_OPTIONS, required: true },
                { key: 'gender', label: 'Género', type: 'select', options: GENDER_OPTIONS, required: false },
                { key: 'dob', label: 'Fecha de Nacimiento', type: 'date', required: false },
                { key: 'has_priority_access', label: 'Tiene Acceso Prioritario', type: 'checkbox', required: false }
            ]}
            processData={(data) => {
                // Opcional: Procesamiento adicional si la data necesita formateo antes de entrar a la tabla
                return data;
            }}
        />
    );
}
