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

def view_laws():
    """Προβολή όλων των νόμων."""
    conn = connect_to_db()
    cur = conn.cursor()
    
    try:
        print("\n=== ΝΟΜΟΙ ===")
        cur.execute("SELECT id, title, description, created_at FROM laws")
        laws = cur.fetchall()
        for law in laws:
            print(f"\nID: {law[0]}")
            print(f"Τίτλος: {law[1]}")
            print(f"Περιγραφή: {law[2]}")
            print(f"Ημερομηνία εισαγωγής: {law[3]}")
            
            # Εμφάνιση αριθμού άρθρων για κάθε νόμο
            cur.execute(
                "SELECT COUNT(*) FROM articles WHERE law_id = %s",
                (law[0],)
            )
            article_count = cur.fetchone()[0]
            print(f"Αριθμός άρθρων: {article_count}")
            
            # Εμφάνιση των πρώτων 5 άρθρων
            print("\nΠρώτα 5 άρθρα:")
            cur.execute("""
                SELECT number, content 
                FROM articles 
                WHERE law_id = %s 
                ORDER BY CAST(REGEXP_REPLACE(number, '[^0-9]', '', 'g') AS INTEGER)
                LIMIT 5
            """, (law[0],))
            articles = cur.fetchall()
            for article in articles:
                print(f"\nΆρθρο {article[0]}:")
                print(f"{article[1][:200]}...")
            
    except Exception as e:
        print(f"Σφάλμα: {e}")
    finally:
        cur.close()
        conn.close()

if __name__ == "__main__":
    view_laws() 