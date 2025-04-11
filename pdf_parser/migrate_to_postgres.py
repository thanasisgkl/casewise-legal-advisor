import os
import sqlite3
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


def migrate_data():
    """Μεταφορά δεδομένων από SQLite σε PostgreSQL."""
    try:
        # Σύνδεση στις βάσεις
        sqlite_conn = sqlite3.connect('casewise.db')
        sqlite_cur = sqlite_conn.cursor()
        
        pg_conn = connect_to_postgres()
        pg_cur = pg_conn.cursor()
        
        # 1. Μεταφορά νόμων
        print("\nΜεταφορά νόμων...")
        sqlite_cur.execute("SELECT id, title, type, effective_date, created_at FROM laws")
        laws = sqlite_cur.fetchall()
        
        for law in laws:
            law_id = law[0]
            pg_cur.execute("""
                INSERT INTO laws (id, title, type, effective_date, created_at)
                VALUES (%s, %s, %s, %s, %s)
            """, law)
            print(f"Προστέθηκε νόμος: {law[1]} με ID: {law_id}")
        
        # Ρύθμιση της ακολουθίας ID για τους νόμους
        pg_cur.execute("""
            SELECT setval('laws_id_seq', (SELECT MAX(id) FROM laws))
        """)
        
        # 2. Μεταφορά άρθρων
        print("\nΜεταφορά άρθρων...")
        sqlite_cur.execute("""
            SELECT id, law_id, number, content, description, created_at 
            FROM articles
        """)
        articles = sqlite_cur.fetchall()
        
        for article in articles:
            pg_cur.execute("""
                INSERT INTO articles (id, law_id, number, content, description, created_at)
                VALUES (%s, %s, %s, %s, %s, %s)
            """, article)
            print(f"Προστέθηκε άρθρο {article[2]}")
        
        # Ρύθμιση της ακολουθίας ID για τα άρθρα
        pg_cur.execute("""
            SELECT setval('articles_id_seq', (SELECT MAX(id) FROM articles))
        """)
        
        # Commit των αλλαγών
        pg_conn.commit()
        print("\nΗ μεταφορά ολοκληρώθηκε επιτυχώς!")
        
    except Exception as e:
        print(f"Σφάλμα κατά τη μεταφορά: {str(e)}")
        if pg_conn:
            pg_conn.rollback()
    finally:
        if sqlite_conn:
            sqlite_conn.close()
        if pg_conn:
            pg_conn.close()


if __name__ == "__main__":
    migrate_data() 