from database.connection import SessionLocal
from database.schema import Legislation


def view_articles():
    """Εμφανίζει όλα τα άρθρα του Ποινικού Κώδικα"""
    db = SessionLocal()
    try:
        # Αναζήτηση του Ποινικού Κώδικα
        penal_code = db.query(Legislation).filter(
            Legislation.title == "Ποινικός Κώδικας"
        ).first()

        if not penal_code:
            print("Ο Ποινικός Κώδικας δεν βρέθηκε στη βάση δεδομένων.")
            return

        print(f"Τίτλος: {penal_code.title}")
        print(f"Αριθμός: {penal_code.number}/{penal_code.year}")
        print("\nΆρθρα:")
        print("-" * 50)

        # Εμφάνιση των άρθρων
        for article in penal_code.articles:
            print(f"\nΆρθρο {article.number}")
            if article.title:
                print(f"Τίτλος: {article.title}")
            print("Περιεχόμενο:")
            print(article.content)
            print("-" * 50)

    finally:
        db.close()


if __name__ == "__main__":
    view_articles() 