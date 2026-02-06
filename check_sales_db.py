import sqlite3
import os

db_path = "c:/Users/Admin/Desktop/JAIRO/PROYECTOS/ERP-STORE-FAST/backend-api/erp_store.db"

if not os.path.exists(db_path):
    print(f"Database not found at {db_path}")
    exit(1)

try:
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    tables = ["Sales", "SaleDetails", "Clients", "Employees", "Products", "Categories"]
    for table in tables:
        try:
            cursor.execute(f"SELECT COUNT(*) FROM {table}")
            count = cursor.fetchone()[0]
            print(f"{table}: {count}")
            
            if count > 0:
                cursor.execute(f"SELECT * FROM {table} LIMIT 1")
                # print(f"First row in {table}: {cursor.fetchone()}")
        except sqlite3.OperationalError as e:
            print(f"Error querying {table}: {e}")

    conn.close()

except Exception as e:
    print(f"Error connecting to DB: {e}")
