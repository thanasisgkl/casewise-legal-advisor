import os
import psycopg2
from dotenv import load_dotenv

# Φόρτωση των μεταβλητών περιβάλλοντος
load_dotenv()


def connect_to_postgres():
    """Σύνδεση στη βάση PostgreSQL."""
    return psycopg2.connect(
        dbname=os.getenv('DB_NAME'),
        user=os.getenv('DB_USER'),
        password=os.getenv('DB_PASSWORD'),
        host=os.getenv('DB_HOST'),
        port=os.getenv('DB_PORT')
    )


def update_law_name():
    """Ενημέρωση του ονόματος του νόμου."""
    conn = None
    try:
        conn = connect_to_postgres()
        cur = conn.cursor()
        
        # Ενημέρωση του ονόματος του νόμου
        cur.execute("""
            UPDATE laws 
            SET title = 'Αστικός Κώδικας'
            WHERE title = 'Unknown'
        """)
        
        conn.commit()
        print("Το όνομα του νόμου ενημερώθηκε επιτυχώς!")
        
    except Exception as e:
        print(f"Σφάλμα κατά την ενημέρωση: {str(e)}")
        if conn:
            conn.rollback()
    finally:
        if conn:
            conn.close()


if __name__ == "__main__":
    update_law_name() 