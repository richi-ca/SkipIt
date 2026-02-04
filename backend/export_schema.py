import csv
import os
from app import create_app, db
from app import models  # Ensure models are loaded

def generate_report():
    app = create_app()
    with app.app_context():
        # Get all tables from metadata
        # db.Model.metadata.reflect(bind=db.engine) # Not needed if models are imported?
        # Actually, since we imported models.py, the metadata should be populated.
        
        tables = db.metadata.sorted_tables
        
        output_file = 'database_schema_report.csv'
        
        with open(output_file, 'w', newline='', encoding='utf-8') as csvfile:
            fieldnames = ['Table', 'Column', 'Type', 'Nullable', 'Primary Key', 'Foreign Keys']
            writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
            
            writer.writeheader()
            
            for table in tables:
                for column in table.columns:
                    # Format Foreign Keys
                    fks = []
                    for fk in column.foreign_keys:
                        fks.append(f"{fk.column.table.name}.{fk.column.name}")
                    
                    writer.writerow({
                        'Table': table.name,
                        'Column': column.name,
                        'Type': str(column.type),
                        'Nullable': column.nullable,
                        'Primary Key': column.primary_key,
                        'Foreign Keys': ", ".join(fks)
                    })
                    
        print(f"Report generated: {os.path.abspath(output_file)}")

if __name__ == '__main__':
    generate_report()
