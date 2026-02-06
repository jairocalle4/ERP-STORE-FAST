import sqlite3
import json
import os
from datetime import datetime

DB_PATH = "c:/Users/Admin/Desktop/JAIRO/PROYECTOS/ERP-STORE-FAST/backend-api/erp_store.db"
DATA_PATH = "c:/Users/Admin/Desktop/JAIRO/PROYECTOS/ERP-STORE-FAST/migration_data.json"

def import_data():
    if not os.path.exists(DATA_PATH):
        print("No data file found.")
        return

    with open(DATA_PATH, 'r', encoding='utf-8') as f:
        data = json.load(f)

    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    try:
        # 1. Clear existing data
        print("Cleaning tables...")
        cursor.execute("DELETE FROM Products")
        cursor.execute("DELETE FROM Subcategories")
        cursor.execute("DELETE FROM Categories")
        
        # 2. Insert Categories
        print(f"Importing {len(data['categories'])} categories...")
        for cat in data['categories']:
            cursor.execute(
                "INSERT INTO Categories (Id, Name, IsActive, CreatedAt, UpdatedAt) VALUES (?, ?, ?, ?, ?)",
                (cat['id'], cat['name'], 1 if cat['isActive'] else 0, now, now)
            )

        # 3. Insert Subcategories
        print(f"Importing {len(data['subcategories'])} subcategories...")
        for sub in data['subcategories']:
            cursor.execute(
                "INSERT INTO Subcategories (Id, Name, CategoryId, IsActive, CreatedAt, UpdatedAt) VALUES (?, ?, ?, ?, ?, ?)",
                (sub['id'], sub['name'], sub['categoryId'], 1 if sub['isActive'] else 0, now, now)
            )

        # 4. Insert Products
        print(f"Importing {len(data['products'])} products...")
        for prod in data['products']:
            # Generate SKU if missing
            sku = f"RE-{(prod['name'][:3]).upper()}-{prod['id']}"
            
            # Format date for Product
            # Original: 2026-01-06T14:32:27.300
            p_date = prod['date'].replace('T', ' ') if 'T' in prod['date'] else prod['date']
            
            cursor.execute(
                """INSERT INTO Products (
                    Id, Name, Description, Price, Cost, Stock, 
                    SKU, Barcode, ImageUrl, VideoUrl, 
                    CategoryId, SubcategoryId, IsActive, CreatedAt, UpdatedAt
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
                (
                    prod['id'], 
                    prod['name'], 
                    prod['description'], 
                    prod['price'], 
                    prod['cost'], 
                    prod['stock'],
                    sku,
                    f"BAR-{prod['id']}",
                    prod['imageUrl'],
                    prod['videoUrl'],
                    prod['categoryId'],
                    prod['subcategoryId'],
                    1 if prod['isActive'] else 0,
                    p_date,
                    now
                )
            )

        conn.commit()
        print("Migration completed successfully!")

    except Exception as e:
        conn.rollback()
        print(f"Error during migration: {e}")
    finally:
        conn.close()

if __name__ == "__main__":
    import_data()
