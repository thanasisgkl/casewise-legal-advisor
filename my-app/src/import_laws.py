from database.connection import SessionLocal
from database.import_laws import import_all_laws


def main():
    """Εκτελεί την εισαγωγή των νόμων"""
    db = SessionLocal()
    try:
        import_all_laws(db)
        print("Η εισαγωγή των νόμων ολοκληρώθηκε επιτυχώς!")
    finally:
        db.close()


if __name__ == "__main__":
    main() 