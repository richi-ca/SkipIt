
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
                { key: 'display_order', label: 'Orden' }
            ]}
            fields={[
                { key: 'name', label: 'Nombre de la Categoría', type: 'text', required: true },
                { key: 'display_order', label: 'Orden de Visualización', type: 'number', required: false }
            ]}
        />
    );
}
