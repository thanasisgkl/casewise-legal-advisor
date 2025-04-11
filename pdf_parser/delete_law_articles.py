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


def delete_law_articles():
    """Διαγραφή όλων των άρθρων του Ποινικού Κώδικα."""
    conn = None
    try:
        conn = connect_to_db()
        cur = conn.cursor()
        
        # Εύρεση του ID του Ποινικού Κώδικα
        cur.execute("SELECT id FROM laws WHERE title = 'Ποινικός Κώδικας'")
        law_id = cur.fetchone()[0]
        
        # Διαγραφή όλων των άρθρων του Ποινικού Κώδικα
        cur.execute("""
            DELETE FROM articles
            WHERE law_id = %s
        """, (law_id,))
        
        # Διαγραφή του νόμου
        cur.execute("""
            DELETE FROM laws
            WHERE id = %s
        """, (law_id,))
        
        conn.commit()
        print("Τα άρθρα του Ποινικού Κώδικα διαγράφηκαν επιτυχώς!")
        
    except Exception as e:
        print(f"Σφάλμα κατά τη διαγραφή των άρθρων: {str(e)}")
        if conn:
            conn.rollback()
    finally:
        if conn:
            conn.close()


if __name__ == "__main__":
    delete_law_articles() 