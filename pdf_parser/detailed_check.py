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


def detailed_check():
    """Εμφανίζει αναλυτικά τα δεδομένα στη βάση."""
    conn = None
    try:
        conn = connect_to_db()
        cur = conn.cursor()
        
        # 1. Εμφάνιση πληροφοριών για τον νόμο
        print("\n=== ΠΛΗΡΟΦΟΡΙΕΣ ΝΟΜΟΥ ===")
        cur.execute("""
            SELECT id, title, description, created_at 
            FROM laws 
            WHERE id = 20
        """)
        law = cur.fetchone()
        print(f"ID: {law[0]}")
        print(f"Τίτλος: {law[1]}")
        print(f"Περιγραφή: {law[2]}")
        print(f"Ημερομηνία εισαγωγής: {law[3]}")
        
        # 2. Εμφάνιση αριθμού άρθρων
        print("\n=== ΑΡΙΘΜΟΣ ΑΡΘΡΩΝ ===")
        cur.execute("""
            SELECT COUNT(*) 
            FROM articles 
            WHERE law_id = 20
        """)
        article_count = cur.fetchone()[0]
        print(f"Συνολικός αριθμός άρθρων: {article_count}")
        
        # 3. Εμφάνιση λίστας άρθρων
        print("\n=== ΛΙΣΤΑ ΑΡΘΡΩΝ ===")
        cur.execute("""
            SELECT number, content 
            FROM articles 
            WHERE law_id = 20 
            ORDER BY CAST(REGEXP_REPLACE(number, '[^0-9]', '', 'g') AS INTEGER)
        """)
        articles = cur.fetchall()
        for article in articles:
            print(f"\nΆρθρο {article[0]}:")
            print(f"Περιεχόμενο: {article[1][:200]}...")
            
    except Exception as e:
        print(f"Σφάλμα: {str(e)}")
    finally:
        if conn:
            conn.close()


if __name__ == "__main__":
    detailed_check() 