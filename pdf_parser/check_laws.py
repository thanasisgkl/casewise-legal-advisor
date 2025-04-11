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


def check_laws():
    """Εμφανίζει όλους τους νόμους στη βάση δεδομένων."""
    conn = None
    try:
        conn = connect_to_db()
        cur = conn.cursor()
        
        # Εμφάνιση όλων των νόμων
        cur.execute("SELECT id, title FROM laws")
        laws = cur.fetchall()
        
        print("\nΝόμοι στη βάση δεδομένων:")
        print("-" * 50)
        for law in laws:
            print(f"ID: {law[0]}, Τίτλος: {law[1]}")
            
    except Exception as e:
        print(f"Σφάλμα: {str(e)}")
    finally:
        if conn:
            conn.close()


if __name__ == "__main__":
    check_laws() 