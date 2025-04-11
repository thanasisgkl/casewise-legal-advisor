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


def clean_tables():
    """Καθαρισμός των πινάκων στην PostgreSQL."""
    try:
        conn = connect_to_postgres()
        cur = conn.cursor()
        
        # Απενεργοποίηση των foreign key constraints
        cur.execute("SET CONSTRAINTS ALL DEFERRED")
        
        # Καθαρισμός των πινάκων
        tables = ['articles', 'laws', 'categories', 'article_categories']
        for table in tables:
            cur.execute(f"TRUNCATE TABLE {table} CASCADE")
            print(f"Καθαρίστηκε ο πίνακας {table}")
        
        # Commit των αλλαγών
        conn.commit()
        print("\nΟι πίνακες καθαρίστηκαν επιτυχώς!")
        
    except Exception as e:
        print(f"Σφάλμα κατά τον καθαρισμό: {str(e)}")
        if conn:
            conn.rollback()
    finally:
        if conn:
            conn.close()


if __name__ == "__main__":
    clean_tables() 