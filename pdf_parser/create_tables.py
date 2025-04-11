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


def create_tables():
    """Δημιουργία των πινάκων της βάσης δεδομένων."""
    conn = None
    try:
        conn = connect_to_db()
        cur = conn.cursor()
        
        # Δημιουργία πίνακα laws
        cur.execute("""
            CREATE TABLE IF NOT EXISTS laws (
                id SERIAL PRIMARY KEY,
                title VARCHAR(200) NOT NULL,
                type VARCHAR(50) NOT NULL,
                effective_date DATE NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        
        # Δημιουργία πίνακα categories
        cur.execute("""
            CREATE TABLE IF NOT EXISTS categories (
                id SERIAL PRIMARY KEY,
                name VARCHAR(100) NOT NULL UNIQUE,
                description TEXT
            )
        """)
        
        # Δημιουργία πίνακα articles
        cur.execute("""
            CREATE TABLE IF NOT EXISTS articles (
                id SERIAL PRIMARY KEY,
                law_id INTEGER REFERENCES laws(id),
                number VARCHAR(10) NOT NULL,
                content TEXT NOT NULL,
                description TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        
        conn.commit()
        print("Οι πίνακες δημιουργήθηκαν επιτυχώς!")
        
    except Exception as e:
        print(f"Σφάλμα κατά τη δημιουργία των πινάκων: {str(e)}")
        if conn:
            conn.rollback()
    finally:
        if conn:
            conn.close()


if __name__ == "__main__":
    create_tables() 