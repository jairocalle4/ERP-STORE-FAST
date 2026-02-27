DO $$
DECLARE
    row record;
    max_id integer;
    seq_name text;
BEGIN
    FOR row IN
        SELECT table_name
        FROM information_schema.tables
        WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
    LOOP
        -- Check if table has an "Id" column
        IF EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_schema = 'public' 
              AND table_name = row.table_name 
              AND column_name = 'Id'
        ) THEN
            
            -- Get highest ID
            EXECUTE format('SELECT COALESCE(MAX("Id"), 0) FROM %I', row.table_name) INTO max_id;
            
            -- Look for sequence. EF Core typically names them exactly match table, or uses pg_get_serial_sequence
            BEGIN
                EXECUTE format('SELECT pg_get_serial_sequence(''%I'', ''Id'')', row.table_name) INTO seq_name;
                
                IF seq_name IS NOT NULL THEN
                    EXECUTE format('SELECT setval(''%s'', %s, true)', seq_name, GREATEST(max_id, 1));
                    RAISE NOTICE 'Updated sequence % to %', seq_name, GREATEST(max_id, 1);
                END IF;
            EXCEPTION WHEN OTHERS THEN
                -- Ignore errors from tables that might not have sequences defined this way
            END;
            
        END IF;
    END LOOP;
END;
$$;
