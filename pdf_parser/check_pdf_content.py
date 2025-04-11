import os
from pdfminer.high_level import extract_text


def check_pdf_content(pdf_path: str):
    """Έλεγχος του περιεχομένου του PDF αρχείου."""
    try:
        # Εξαγωγή κειμένου από το PDF
        text = extract_text(pdf_path)
        
        # Εκτύπωση των πρώτων 5000 χαρακτήρων
        print("Πρώτοι 5000 χαρακτήρες του κειμένου:")
        print(text[:5000])
        
        # Αναζήτηση για συγκεκριμένα άρθρα
        print("\nΈλεγχος για συγκεκριμένα άρθρα:")
        for article_num in [1, 70, 100, 200, 300, 400, 474]:
            # Αναζήτηση για διάφορες μορφές του αριθμού άρθρου
            patterns = [
                f"Άρθρο {article_num}",
                f"Άρθρον {article_num}",
                f"Άρθρο {article_num}.",
                f"Άρθρον {article_num}."
            ]
            found = False
            for pattern in patterns:
                if pattern in text:
                    print(f"Βρέθηκε: {pattern}")
                    found = True
                    break
            if not found:
                print(f"Δεν βρέθηκε το άρθρο {article_num}")
        
    except Exception as e:
        print(f"Σφάλμα κατά τον έλεγχο του PDF: {str(e)}")


if __name__ == "__main__":
    pdf_path = "pdf_parser/Ποινικός-Κώδικας.pdf"
    check_pdf_content(pdf_path) 