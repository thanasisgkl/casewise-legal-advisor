import os
import psycopg2
from dotenv import load_dotenv

def clean_database():
    """Διαγράφει όλα τα άρθρα και τους νόμους από τη βάση δεδομένων."""
    load_dotenv()
    
    try:
        conn = psycopg2.connect(
            dbname=os.getenv('DB_NAME'),
            user=os.getenv('DB_USER'),
            password=os.getenv('DB_PASSWORD'),
            host=os.getenv('DB_HOST'),
            port=os.getenv('DB_PORT')
        )
        
        with conn.cursor() as cur:
            # Διαγραφή όλων των άρθρων
            cur.execute("DELETE FROM articles")
            articles_count = cur.rowcount
            
            # Διαγραφή όλων των νόμων
            cur.execute("DELETE FROM laws")
            laws_count = cur.rowcount
            
            conn.commit()
            
            print(f"Διαγράφηκαν {articles_count} άρθρα και {laws_count} νόμοι.")
            
    except Exception as e:
        print(f"Σφάλμα κατά τον καθαρισμό της βάσης: {str(e)}")
    finally:
        if 'conn' in locals():
            conn.close()

if __name__ == "__main__":
    clean_database() 