
import GenericMaintainer from './GenericMaintainer';

export default function CategoriesMaintainer() {
    // No menús needed anymore
    return (
        <GenericMaintainer
            title="Mantenedor de Categorías"
            itemTitle="Categoría"
            endpoint="/catalog/categories"
            columns={[
                { key: 'id', label: 'ID' },
                { key: 'name', label: 'Nombre' },
                { key: 'description', label: 'Descripción' }
            ]}
            fields={[
                { key: 'name', label: 'Nombre de la Categoría', type: 'text', required: true },
                { key: 'description', label: 'Descripción', type: 'textarea', required: true }
            ]}
        />
    );
}
