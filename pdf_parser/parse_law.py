import os
import re
import fitz  # PyMuPDF
import psycopg2
from psycopg2 import sql
from dotenv import load_dotenv
from typing import List, Dict
import argparse
from datetime import datetime


def extract_text_from_pdf(pdf_path: str) -> str:
    """Εξάγει το κείμενο από ένα PDF αρχείο."""
    try:
        doc = fitz.open(pdf_path)
        text = ""
        for page in doc:
            text += page.get_text()
        # Καθαρισμός μηδενικών χαρακτήρων
        text = text.replace('\x00', '')
        print("Πρώτα 1000 χαρακτήρες του κειμένου:")
        print(text[:1000])
        return text
    except Exception as e:
        print(f"Σφάλμα κατά την εξαγωγή κειμένου: {e}")
        return ""


def parse_law(text: str) -> Dict:
    """Αναλύει το κείμενο του νόμου και εξάγει πληροφορίες."""
    print("Έναρξη ανάλυσης κειμένου...")
    
    # Εξαγωγή άρθρων
    print("Αναζήτηση άρθρων...")
    # Βρίσκουμε όλα τα άρθρα στο κείμενο
    article_pattern = (
        r'(?:^|\n)(?:Άρθρο|Αρθρο|ΑΡΘΡΟ)[:\s]+'  # Αρχή του άρθρου
        r'(\d+(?:[Α-Ω])?)\s*\n'  # Αριθμός άρθρου
        r'(?:[^\n]*\n)*?'  # Οποιεσδήποτε γραμμές
        r'(?:Τίτλος Αρθρου\n)?'  # Προαιρετικός τίτλος
        r'([^\n]*)\n'  # Τίτλος άρθρου
        r'(?:[^\n]*\n)*?'  # Οποιεσδήποτε γραμμές
        r'(?:Κείμενο Αρθρου\n)?'  # Προαιρετική επικεφαλίδα
        r'(.*?)'  # Περιεχόμενο άρθρου
        r'(?=(?:\n(?:Άρθρο|Αρθρο|ΑΡΘΡΟ)[:\s]+\d+|$))'  # Μέχρι το επόμενο
    )
    
    articles = {}
    matches = re.finditer(article_pattern, text, re.DOTALL | re.IGNORECASE)
    
    for match in matches:
        article_num = match.group(1)
        article_title = match.group(2).strip()
        article_content = match.group(3).strip()
        
        # Έλεγχος για εγκυρότητα άρθρου
        if (
            article_num and  # Έχει αριθμό
            article_title and  # Έχει τίτλο
            article_content and  # Έχει περιεχόμενο
            not article_title.startswith('ΟΘΟΝΗ ΕΚΤΥΠΩΣΗΣ') and  # Δεν είναι header
            not article_title.startswith('www.dsanet.gr') and  # Δεν είναι URL
            not article_content.startswith('ΟΘΟΝΗ ΕΚΤΥΠΩΣΗΣ') and  # Δεν είναι header
            not article_content.startswith('www.dsanet.gr') and  # Δεν είναι URL
            len(article_content) > 10 and  # Έχει αρκετό περιεχόμενο
            not re.search(r'άρθρ(?:ο|ου|ων|α)\s+\d+', article_title, re.IGNORECASE) and
            not re.search(r'άρθρ(?:ο|ου|ων|α)\s+\d+', article_content[:100], re.IGNORECASE)
        ):
            articles[article_num] = {
                'number': article_num,
                'title': article_title,
                'description': '',
                'content': article_content
            }
            
    # Ταξινόμηση των άρθρων με βάση τον αριθμό
    sorted_articles = sorted(
        articles.items(), 
        key=lambda x: (int(re.sub(r'[^\d]', '', x[0])), x[0])
    )
    
    print(f"Βρέθηκαν {len(articles)} άρθρα")
    
    # Εξαγωγή πληροφοριών νόμου
    law_type = extract_law_type(text)
    title = extract_title(text)
    publication_date = extract_publication_date(text)
    
    # Επιστροφή δεδομένων νόμου
    law_data = {
        'type': law_type[:50],
        'title': title[:200],
        'publication_date': publication_date,
        'articles': [
            {
                'number': data['number'],
                'title': data['title'],
                'description': data['description'],
                'content': data['content']
            }
            for num, data in sorted_articles
        ]
    }
    return law_data


def connect_to_db() -> psycopg2.extensions.connection:
    """Connect to PostgreSQL database."""
    load_dotenv()
    return psycopg2.connect(
        dbname=os.getenv('DB_NAME'),
        user=os.getenv('DB_USER'),
        password=os.getenv('DB_PASSWORD'),
        host=os.getenv('DB_HOST'),
        port=os.getenv('DB_PORT')
    )


def insert_law(conn: psycopg2.extensions.connection, law_data: Dict) -> int:
    """Εισάγει έναν νόμο στη βάση δεδομένων."""
    with conn.cursor() as cur:
        # Διαγραφή υπαρχόντων άρθρων
        delete_articles_sql = """
            DELETE FROM articles 
            WHERE law_id IN (
                SELECT id FROM laws WHERE title = %s
            )
        """
        cur.execute(delete_articles_sql, (law_data['title'][:200],))
        
        # Διαγραφή υπάρχοντος νόμου
        delete_law_sql = "DELETE FROM laws WHERE title = %s"
        cur.execute(delete_law_sql, (law_data['title'][:200],))

        cur.execute(
            sql.SQL("""
                INSERT INTO laws (title, type, effective_date)
                VALUES (%s, %s, %s)
                RETURNING id
            """),
            (
                law_data['title'][:200],  # Κόβουμε το τίτλο στα 200 χαρακτήρες
                law_data['type'][:50],    # Κόβουμε τον τύπο στα 50 χαρακτήρες
                law_data['publication_date']
            )
        )
        law_id = cur.fetchone()[0]
        conn.commit()
        return law_id


def insert_article(conn: psycopg2.extensions.connection, law_id: int, article_data: Dict) -> None:
    """Insert article into database."""
    with conn.cursor() as cur:
        # Μετατροπή του αριθμού άρθρου σε string
        article_number = str(article_data['number'])
        
        cur.execute(
            sql.SQL("""
                INSERT INTO articles (law_id, number, content, description)
                VALUES (%s, %s, %s, %s)
            """),
            (
                law_id,
                article_number,  # Χρήση του αριθμού ως string
                article_data['content'],
                article_data['title']  # Χρησιμοποιούμε το title ως description
            )
        )
        conn.commit()


def insert_articles(
    conn: psycopg2.extensions.connection,
    law_id: int,
    articles: List[Dict]
):
    """Insert articles into database."""
    with conn.cursor() as cur:
        # Διαγραφή παλιών άρθρων
        cur.execute(
            sql.SQL("""
                DELETE FROM articles
                WHERE law_id = %s
            """),
            (law_id,)
        )
        
        # Εισαγωγή νέων άρθρων
        for article in articles:
            insert_article(conn, law_id, article)


def process_pdf(pdf_path: str):
    """Process PDF file and store data in database."""
    try:
        # Extract and parse text
        text = extract_text_from_pdf(pdf_path)
        law_data = parse_law(text)

        # Connect to database
        conn = connect_to_db()
        
        with conn.cursor() as cur:
            # Delete existing articles and law
            cur.execute(
                sql.SQL("SELECT id FROM laws WHERE title = %s"),
                (law_data['title'],)
            )
            existing_law = cur.fetchone()
            if existing_law:
                cur.execute(
                    sql.SQL("DELETE FROM articles WHERE law_id = %s"),
                    (existing_law[0],)
                )
                cur.execute(
                    sql.SQL("DELETE FROM laws WHERE id = %s"),
                    (existing_law[0],)
                )
            conn.commit()

        # Insert law and articles
        law_id = insert_law(conn, law_data)
        insert_articles(conn, law_id, law_data['articles'])

        print(f"Successfully processed {pdf_path}")
        print(
            f"Inserted law with {len(law_data['articles'])} articles"
        )

    except Exception as e:
        print(f"Error processing {pdf_path}: {str(e)}")
    finally:
        if 'conn' in locals():
            conn.close()


def extract_law_type(text):
    """Εξάγει τον τύπο του νόμου από το κείμενο."""
    pattern = (
        r'Είδος:\s*'
        r'([^\n]+)'
    )
    law_type_match = re.search(pattern, text)
    return law_type_match.group(1).strip() if law_type_match else "Unknown"


def extract_title(text):
    """Εξάγει τον τίτλο του νόμου από το κείμενο."""
    pattern = (
        r'Τίτλος\s*\n\s*'
        r'([^\n]+)'
    )
    title_match = re.search(pattern, text)
    return title_match.group(1).strip() if title_match else "Unknown"


def extract_publication_date(text):
    """Εξάγει την ημερομηνία δημοσίευσης από το κείμενο."""
    pattern = (
        r'Τέθηκε σε ισχύ:\s*'
        r'(\d{2}\.\d{2}\.\d{4})'
    )
    date_match = re.search(pattern, text)
    if not date_match:
        return None
    
    date_str = date_match.group(1)
    try:
        return datetime.strptime(date_str, '%d.%m.%Y').date()
    except ValueError:
        return None


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='Process a law PDF file.')
    parser.add_argument('pdf_path', help='Path to the PDF file to process')
    args = parser.parse_args()
    process_pdf(args.pdf_path) 