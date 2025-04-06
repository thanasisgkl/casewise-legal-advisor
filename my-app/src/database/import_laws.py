from sqlalchemy.orm import Session
from database.schema import Legislation, Article, Tag
import os
from typing import List, Dict


def read_law_file(file_path: str) -> List[Dict[str, str]]:
    """Διαβάζει ένα αρχείο νόμου και επιστρέφει τα άρθρα του"""
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    articles = []
    current_article = None
    current_content = []

    for line in content.split('\n'):
        line = line.strip()
        if not line:
            if current_article:
                articles.append({
                    'number': current_article['number'],
                    'title': current_article['title'],
                    'content': '\n'.join(current_content).strip()
                })
                current_article = None
                current_content = []
            continue

        if line.startswith('Άρθρο') or line.startswith('ΑΡΘΡΟ'):
            if current_article:
                articles.append({
                    'number': current_article['number'],
                    'title': current_article['title'],
                    'content': '\n'.join(current_content).strip()
                })
                current_content = []

            # Διαχωρισμός αριθμού και τίτλου άρθρου
            parts = line.split('.', 1)
            article_num = parts[0].replace('Άρθρο', '').replace(
                'ΑΡΘΡΟ', ''
            ).strip()
            title = parts[1].strip() if len(parts) > 1 else ''

            current_article = {
                'number': article_num,
                'title': title
            }
        elif current_article:
            current_content.append(line)

    # Προσθήκη του τελευταίου άρθρου
    if current_article:
        articles.append({
            'number': current_article['number'],
            'title': current_article['title'],
            'content': '\n'.join(current_content).strip()
        })

    return articles


def import_law_from_file(
    db: Session,
    file_path: str,
    law_type: str,
    law_number: str,
    year: int,
    title: str,
    tag_name: str,
    tag_description: str
) -> bool:
    """Εισάγει ένα νόμο από αρχείο στη βάση δεδομένων"""
    try:
        # Δημιουργία του tag
        tag = Tag(
            name=tag_name,
            description=tag_description
        )
        db.add(tag)

        # Δημιουργία του νόμου
        law = Legislation(
            type=law_type,
            number=law_number,
            year=year,
            title=title,
            status="Σε ισχύ"
        )
        law.tags.append(tag)
        db.add(law)

        # Διάβασμα και εισαγωγή των άρθρων
        articles = read_law_file(file_path)
        for article_data in articles:
            article = Article(
                legislation=law,
                number=article_data['number'],
                title=article_data['title'],
                content=article_data['content']
            )
            db.add(article)

        db.commit()
        print(f"Επιτυχής εισαγωγή του νόμου: {title}")
        print(f"Επιτυχής εισαγωγή {len(articles)} άρθρων από το {law.title}")
        return True

    except Exception as e:
        db.rollback()
        print(f"Σφάλμα κατά την εισαγωγή του νόμου {title}: {str(e)}")
        return False


def import_all_laws(db: Session, laws_dir: str = "laws"):
    """Εισάγει όλους τους νόμους από τον κατάλογο laws"""
    # Εισαγωγή Ποινικού Κώδικα
    penal_code_path = os.path.join(laws_dir, "penal_code.txt")
    if os.path.exists(penal_code_path):
        import_law_from_file(
            db=db,
            file_path=penal_code_path,
            law_type="ΚΩΔΙΚΑΣ",
            law_number="4619",
            year=2019,
            title="Ποινικός Κώδικας",
            tag_name="ΠΟΙΝΙΚΟ_ΔΙΚΑΙΟ",
            tag_description="Διατάξεις Ποινικού Δικαίου"
        )
    else:
        print(f"Το αρχείο {penal_code_path} δεν βρέθηκε")