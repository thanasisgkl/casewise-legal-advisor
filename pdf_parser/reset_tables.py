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

def reset_tables():
    """Διαγραφή και επαναδημιουργία των πινάκων."""
    conn = None
    try:
        conn = connect_to_db()
        cur = conn.cursor()
        
        # Διαγραφή των υπαρχόντων πινάκων
        cur.execute("""
            DROP TABLE IF EXISTS articles CASCADE;
            DROP TABLE IF EXISTS laws CASCADE;
            DROP TABLE IF EXISTS categories CASCADE;
        """)
        
        # Δημιουργία πίνακα laws
        cur.execute("""
            CREATE TABLE laws (
                id SERIAL PRIMARY KEY,
                title VARCHAR(200) NOT NULL,
                type VARCHAR(50) NOT NULL,
                effective_date DATE NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        
        # Δημιουργία πίνακα categories
        cur.execute("""
            CREATE TABLE categories (
                id SERIAL PRIMARY KEY,
                name VARCHAR(100) NOT NULL UNIQUE,
                description TEXT
            )
        """)
        
        # Δημιουργία πίνακα articles
        cur.execute("""
            CREATE TABLE articles (
                id SERIAL PRIMARY KEY,
                law_id INTEGER REFERENCES laws(id),
                number INTEGER NOT NULL,
                content TEXT NOT NULL,
                description TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        
        conn.commit()
        print("Οι πίνακες διαγράφηκαν και δημιουργήθηκαν ξανά επιτυχώς!")
        
    except Exception as e:
        print(f"Σφάλμα: {str(e)}")
        if conn:
            conn.rollback()
    finally:
        if conn:
            conn.close()

if __name__ == "__main__":
    reset_tables() 