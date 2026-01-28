import { useState, useEffect } from 'react';
import GenericMaintainer from './GenericMaintainer';
import { baseFetch } from '../../../services/api';

export default function ProductsMaintainer() {
    const [categories, setCategories] = useState<{ value: any, label: string }[]>([]);

    useEffect(() => {
        baseFetch<any[]>('/catalog/categories')
            .then(data => {
                setCategories(data.map(c => ({ value: c.id, label: c.name })));
            })
            .catch(console.error);
    }, []);

    return (
        <GenericMaintainer
            title="Mantenedor de Productos"
            itemTitle="Producto"
            endpoint="/catalog/products"
            columns={[
                { key: 'id', label: 'ID' },
                { key: 'name', label: 'Nombre' },
                { key: 'category_id', label: 'ID Cat.' },
                { key: 'description', label: 'Descripción' }
            ]}
            fields={[
                { key: 'name', label: 'Nombre del Producto', type: 'text', required: true },
                {
                    key: 'category_id',
                    label: 'Categoría',
                    type: 'select',
                    required: true,
                    options: categories
                },
                { key: 'description', label: 'Descripción', type: 'textarea', required: false },
                { key: 'image_url', label: 'URL Imagen', type: 'text', required: false }
            ]}
        />
    );
}
