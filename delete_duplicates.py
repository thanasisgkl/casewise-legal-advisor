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

def delete_duplicate_articles():
    """Διαγραφή διπλόγραφων άρθρων."""
    conn = None
    try:
        conn = connect_to_db()
        cur = conn.cursor()
        
        # Εύρεση του ID του Ποινικού Κώδικα
        cur.execute("SELECT id FROM laws WHERE title = 'Ποινικός Κώδικας'")
        law_id = cur.fetchone()[0]
        
        # Διαγραφή διπλόγραφων άρθρων
        cur.execute("""
            DELETE FROM articles a1
            USING articles a2
            WHERE a1.id > a2.id
            AND a1.law_id = a2.law_id
            AND a1.number = a2.number
            AND a1.law_id = %s
        """, (law_id,))
        
        conn.commit()
        print(f"Διαγράφηκαν {cur.rowcount} διπλόγραφα άρθρα.")
        
    except Exception as e:
        print(f"Σφάλμα: {e}")
    finally:
        if conn:
            conn.close()

if __name__ == "__main__":
    delete_duplicate_articles() 