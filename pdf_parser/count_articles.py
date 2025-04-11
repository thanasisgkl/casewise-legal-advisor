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


def count_articles():
    """Μέτρηση του αριθμού των άρθρων στη βάση δεδομένων."""
    conn = None
    try:
        conn = connect_to_db()
        cur = conn.cursor()
        
        # Μέτρηση άρθρων ανά νόμο
        cur.execute("""
            SELECT l.title, COUNT(*) as article_count
            FROM laws l
            JOIN articles a ON l.id = a.law_id
            GROUP BY l.title
        """)
        
        results = cur.fetchall()
        print("Αριθμός άρθρων ανά νόμο:")
        for title, count in results:
            print(f"{title}: {count} άρθρα")
        
        # Συνολικός αριθμός άρθρων
        cur.execute("SELECT COUNT(*) FROM articles")
        total_count = cur.fetchone()[0]
        print(f"\nΣυνολικός αριθμός άρθρων: {total_count}")
        
    except Exception as e:
        print(f"Σφάλμα κατά τη μέτρηση των άρθρων: {str(e)}")
    finally:
        if conn:
            conn.close()


if __name__ == "__main__":
    count_articles() 