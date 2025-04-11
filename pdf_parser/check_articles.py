import os
import psycopg2
from dotenv import load_dotenv


def connect_to_db():
    """Σύνδεση στη βάση δεδομένων PostgreSQL."""
    load_dotenv()
    return psycopg2.connect(
        dbname=os.getenv('DB_NAME'),
        user=os.getenv('DB_USER'),
        password=os.getenv('DB_PASSWORD'),
        host=os.getenv('DB_HOST'),
        port=os.getenv('DB_PORT')
    )


def check_articles():
    """Έλεγχος των άρθρων στη βάση δεδομένων."""
    conn = None
    try:
        conn = connect_to_db()
        cur = conn.cursor()
        
        # Εύρεση του ID του Ποινικού Κώδικα
        cur.execute("SELECT id FROM laws WHERE title = 'Ποινικός Κώδικας'")
        law_id = cur.fetchone()[0]
        
        # Ανάκτηση όλων των άρθρων
        cur.execute("""
            SELECT number, description, content
            FROM articles
            WHERE law_id = %s
            ORDER BY 
                CASE 
                    WHEN number ~ '^[0-9]+$' THEN CAST(number AS INTEGER)
                    ELSE 0
                END,
                number
        """, (law_id,))
        
        articles = cur.fetchall()
        
        # Εύρεση διπλών άρθρων
        cur.execute("""
            SELECT number, COUNT(*)
            FROM articles
            WHERE law_id = %s
            GROUP BY number
            HAVING COUNT(*) > 1
            ORDER BY number
        """, (law_id,))
        
        duplicates = cur.fetchall()
        
        print("Διπλά άρθρα:")
        for number, count in duplicates:
            print(f"Άρθρο {number}: {count} φορές")
        
        print("\nΛίστα άρθρων:")
        for number, description, content in articles:
            print(f"\nΆρθρο {number}")
            print(f"Περιγραφή: {description}")
            if content:
                # Καθαρισμός του περιεχομένου
                content = content.replace('\n', ' ').strip()
                print(f"Περιεχόμενο: {content[:200]}...")  # Εμφάνιση των πρώτων 200 χαρακτήρων
            else:
                print("Περιεχόμενο: (κενό)")
        
        print(f"\nΣυνολικός αριθμός άρθρων: {len(articles)}")
        
    except Exception as e:
        print(f"Σφάλμα κατά τον έλεγχο των άρθρων: {str(e)}")
    finally:
        if conn:
            conn.close()


if __name__ == "__main__":
    check_articles() 