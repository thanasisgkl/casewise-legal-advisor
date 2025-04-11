import os
import psycopg2
from dotenv import load_dotenv

# Φόρτωση των μεταβλητών περιβάλλοντος
load_dotenv()

def check_postgres_db():
    try:
        # Σύνδεση στη βάση
        conn = psycopg2.connect(
            dbname=os.getenv('DB_NAME'),
            user=os.getenv('DB_USER'),
            password=os.getenv('DB_PASSWORD'),
            host=os.getenv('DB_HOST'),
            port=os.getenv('DB_PORT')
        )
        cur = conn.cursor()
        
        # Έλεγχος πινάκων
        cur.execute("""
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public'
        """)
        tables = cur.fetchall()
        
        print("\nΠίνακες στη βάση PostgreSQL:")
        for table in tables:
            table_name = table[0]
            print(f"\n- {table_name}")
            
            # Δομή πίνακα
            cur.execute(f"""
                SELECT column_name, data_type 
                FROM information_schema.columns 
                WHERE table_name = '{table_name}'
            """)
            columns = cur.fetchall()
            print("  Στήλες:")
            for col in columns:
                print(f"    {col[0]} ({col[1]})")
            
            # Αριθμός εγγραφών
            cur.execute(f"SELECT COUNT(*) FROM {table_name}")
            count = cur.fetchone()[0]
            print(f"  Αριθμός εγγραφών: {count}")
            
            # Αν είναι ο πίνακας laws, δείξε τα περιεχόμενα
            if table_name == 'laws':
                cur.execute("SELECT * FROM laws")
                laws = cur.fetchall()
                print("\n  Περιεχόμενα του πίνακα laws:")
                for law in laws:
                    print(f"    {law}")
        
        cur.close()
        conn.close()
        
    except Exception as e:
        print(f"Σφάλμα: {str(e)}")

if __name__ == "__main__":
    check_postgres_db() 