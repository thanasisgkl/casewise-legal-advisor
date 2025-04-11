import os
import psycopg2
from dotenv import load_dotenv

# Φόρτωση των μεταβλητών περιβάλλοντος
load_dotenv()

def connect_to_db():
    """Σύνδεση στη βάση δεδομένων PostgreSQL."""
    return psycopg2.connect(
        dbname=os.getenv('DB_NAME'),
        user=os.getenv('DB_USER'),
        password=os.getenv('DB_PASSWORD'),
        host=os.getenv('DB_HOST'),
        port=os.getenv('DB_PORT')
    )

def check_table_structure():
    """Έλεγχος της δομής των πινάκων."""
    conn = None
    try:
        conn = connect_to_db()
        cur = conn.cursor()
        
        # Έλεγχος των στηλών του πίνακα laws
        cur.execute("""
            SELECT column_name, data_type, character_maximum_length
            FROM information_schema.columns
            WHERE table_name = 'laws'
            ORDER BY ordinal_position;
        """)
        
        columns = cur.fetchall()
        print("Δομή του πίνακα laws:")
        for column in columns:
            print(f"Στήλη: {column[0]}, Τύπος: {column[1]}, Μέγιστο μήκος: {column[2]}")
            
        # Έλεγχος των στηλών του πίνακα articles
        cur.execute("""
            SELECT column_name, data_type, character_maximum_length
            FROM information_schema.columns
            WHERE table_name = 'articles'
            ORDER BY ordinal_position;
        """)
        
        columns = cur.fetchall()
        print("\nΔομή του πίνακα articles:")
        for column in columns:
            print(f"Στήλη: {column[0]}, Τύπος: {column[1]}, Μέγιστο μήκος: {column[2]}")
        
    except Exception as e:
        print(f"Σφάλμα κατά τον έλεγχο της δομής των πινάκων: {str(e)}")
    finally:
        if conn:
            conn.close()

if __name__ == "__main__":
    check_table_structure() 