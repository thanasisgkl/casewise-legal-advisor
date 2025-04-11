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


def alter_tables():
    """Αλλαγή του τύπου του πεδίου number στον πίνακα articles."""
    conn = None
    try:
        conn = connect_to_db()
        cur = conn.cursor()
        
        # Αλλαγή του τύπου του πεδίου number
        cur.execute("""
            ALTER TABLE articles 
            ALTER COLUMN number TYPE INTEGER USING number::integer
        """)
        
        conn.commit()
        print("Ο πίνακας articles τροποποιήθηκε επιτυχώς!")
        
    except Exception as e:
        print(f"Σφάλμα κατά την τροποποίηση του πίνακα: {str(e)}")
        if conn:
            conn.rollback()
    finally:
        if conn:
            conn.close()


if __name__ == "__main__":
    alter_tables() 