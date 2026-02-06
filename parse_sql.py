import re
import json

def split_values(s):
    parts = []
    current = ""
    in_quotes = False
    in_cast = 0
    for i, char in enumerate(s):
        if char == "'" and (not current or current[-1] != "\\"):
            in_quotes = not in_quotes
        if not in_quotes:
            if char == "(": in_cast += 1
            if char == ")": in_cast -= 1
        
        if char == "," and not in_quotes and in_cast == 0:
            parts.append(current.strip())
            current = ""
        else:
            current += char
    parts.append(current.strip())
    return parts

def extract_numeric(s):
    m = re.search(r"CAST\(\s*([\d\.-]+)\s+AS", s, re.IGNORECASE)
    if m: return float(m.group(1))
    clean = re.sub(r'[^\d\.-]', '', s)
    return float(clean) if clean else 0.0

def clean_str(s):
    if s == "NULL": return None
    return s.strip("N' ").replace("CAST(N'", "").replace("' AS DateTime)", "").replace("' AS Date)", "")

def state_machine_parse(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    data = {
        "categories": [], 
        "subcategories": [], 
        "products": [], 
        "product_images": [],
        "clients": [],
        "employees": [],
        "company_settings": [],
        "sales": [],
        "sale_details": []
    }
    
    current_statement = ""
    in_insert = False
    table_name = None
    
    for line in lines:
        line_clean = line.strip()
        if not line_clean: continue
        
        if line_clean.upper().startswith("INSERT "):
            in_insert = True
            current_statement = line_clean
            # Identify table
            if "[dbo].[Categorias]" in line_clean: table_name = "categories"
            elif "[dbo].[Subcategorias]" in line_clean: table_name = "subcategories"
            elif "[dbo].[Productos]" in line_clean: table_name = "products"
            elif "[dbo].[ProductoImagenes]" in line_clean: table_name = "product_images"
            elif "[dbo].[Clientes]" in line_clean: table_name = "clients"
            elif "[dbo].[Empleado]" in line_clean: table_name = "employees"
            elif "[dbo].[ConfiguracionEmpresa]" in line_clean: table_name = "company_settings"
            elif "[dbo].[Ventas]" in line_clean: table_name = "sales"
            elif "[dbo].[DetalleVentas]" in line_clean: table_name = "sale_details"
            else: table_name = "other"
        
        elif in_insert:
            current_statement += " " + line_clean
            
        if in_insert and "VALUES" in current_statement:
            v_start = current_statement.find("VALUES")
            v_block = current_statement[v_start:]
            
            open_p = v_block.count("(")
            close_p = v_block.count(")")
            
            if open_p == close_p and open_p > 0:
                m = re.search(r"VALUES\s*\((.*)\)", current_statement, re.IGNORECASE)
                if m:
                    parts = split_values(m.group(1))
                    process_entry(table_name, parts, data)
                
                in_insert = False
                current_statement = ""
                table_name = None

    return data

def process_entry(table, parts, data):
    try:
        if table == "categories" and len(parts) >= 3:
            data["categories"].append({
                "id": int(parts[0]),
                "name": clean_str(parts[1]),
                "isActive": parts[2] == "1"
            })
        elif table == "subcategories" and len(parts) >= 4:
            data["subcategories"].append({
                "id": int(parts[0]),
                "name": clean_str(parts[1]),
                "categoryId": int(parts[2]),
                "isActive": parts[3] == "1"
            })
        elif table == "products" and len(parts) >= 12:
            data["products"].append({
                "id": int(parts[0]),
                "name": clean_str(parts[1]),
                "categoryId": int(parts[2]),
                "stock": int(parts[3]),
                "price": extract_numeric(parts[4]),
                "date": clean_str(parts[5]),
                "isActive": parts[6] == "1",
                "description": clean_str(parts[7]),
                "subcategoryId": int(parts[8]) if parts[8] != "NULL" else None,
                "imageUrl": clean_str(parts[9]),
                "cost": extract_numeric(parts[10]),
                "videoUrl": clean_str(parts[11])
            })
        elif table == "product_images" and len(parts) >= 3:
            data["product_images"].append({
                "id": int(parts[0]),
                "productId": int(parts[1]),
                "url": clean_str(parts[2])
            })
        elif table == "clients" and len(parts) >= 7:
            data["clients"].append({
                "id": int(parts[0]),
                "name": clean_str(parts[1]),
                "cedulaRuc": clean_str(parts[2]),
                "phone": clean_str(parts[3]),
                "address": clean_str(parts[4]),
                "email": clean_str(parts[5]),
                "registeredAt": clean_str(parts[6])
            })
        elif table == "employees" and len(parts) >= 4:
            data["employees"].append({
                "id": int(parts[0]),
                "name": clean_str(parts[1]),
                "role": clean_str(parts[2]),
                "isActive": parts[3] == "1"
            })
        elif table == "company_settings" and len(parts) >= 14:
            data["company_settings"].append({
                "id": int(parts[0]),
                "name": clean_str(parts[1]),
                "ruc": clean_str(parts[2]),
                "address": clean_str(parts[3]),
                "phone": clean_str(parts[4]),
                "email": clean_str(parts[5]),
                "legalMessage": clean_str(parts[6]),
                "sriAuth": clean_str(parts[8]),
                "establishment": clean_str(parts[9]),
                "pointOfIssue": clean_str(parts[10]),
                "currentSequence": int(parts[11]),
                "expirationDate": clean_str(parts[12]),
                "socialReason": clean_str(parts[13])
            })
        elif table == "sales":
            data["sales"].append({
                "id": int(parts[0]),
                "date": clean_str(parts[1]),
                "employeeId": int(parts[2]),
                "total": extract_numeric(parts[3]),
                "observation": clean_str(parts[4]),
                "clientId": int(parts[5]) if parts[5] != "NULL" else None,
                "noteNumber": clean_str(parts[6]),
                "isVoid": parts[7] == "1"
            })
        elif table == "sale_details" and len(parts) >= 6:
             data["sale_details"].append({
                "id": int(parts[0]),
                "saleId": int(parts[1]),
                "productId": int(parts[2]),
                "quantity": int(parts[3]),
                "subtotal": extract_numeric(parts[4]),
                "unitPrice": extract_numeric(parts[5])
             })

    except Exception as e:
        print(f"Skipping error in {table}: {e}")
        pass

if __name__ == "__main__":
    result = state_machine_parse("c:/Users/Admin/Desktop/JAIRO/PROYECTOS/ERP-STORE-FAST/restore_utf8.sql")
    with open("c:/Users/Admin/Desktop/JAIRO/PROYECTOS/ERP-STORE-FAST/migration_data.json", "w", encoding='utf-8') as f:
        json.dump(result, f, indent=4, ensure_ascii=False)
    print(f"Extracted: {len(result['categories'])} categories, {len(result['products'])} products, {len(result['clients'])} clients, {len(result['sales'])} sales.")
