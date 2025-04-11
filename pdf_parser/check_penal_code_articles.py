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


def check_penal_code_articles():
    """Έλεγχος των άρθρων του Ποινικού Κώδικα."""
    conn = None
    try:
        conn = connect_to_db()
        cur = conn.cursor()
        
        # Εύρεση του ID του Ποινικού Κώδικα
        cur.execute("SELECT id FROM laws WHERE title = 'Ποινικός Κώδικας'")
        law_id = cur.fetchone()[0]
        
        # Έλεγχος για διπλόγραφα άρθρα
        cur.execute("""
            SELECT number, COUNT(*) as count
            FROM articles
            WHERE law_id = %s
            GROUP BY number
            HAVING COUNT(*) > 1
        """, (law_id,))
        
        duplicates = cur.fetchall()
        if duplicates:
            print("Βρέθηκαν διπλόγραφα άρθρα:")
            for number, count in duplicates:
                print(f"Άρθρο {number}: {count} φορές")
        
        # Έλεγχος του εύρους των αριθμών των άρθρων
        cur.execute("""
            SELECT number
            FROM articles
            WHERE law_id = %s
            ORDER BY number
        """, (law_id,))
        
        articles = cur.fetchall()
        print("\nΛίστα άρθρων:")
        for number, in articles:
            print(f"Άρθρο {number}")
        
        print(f"\nΣυνολικός αριθμός άρθρων: {len(articles)}")
        
    except Exception as e:
        print(f"Σφάλμα κατά τον έλεγχο των άρθρων: {str(e)}")
    finally:
        if conn:
            conn.close()


if __name__ == "__main__":
    check_penal_code_articles() 