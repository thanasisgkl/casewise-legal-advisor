import sqlite3

def check_database():
    try:
        print("Προσπάθεια σύνδεσης στη βάση δεδομένων...")
        # Σύνδεση στη βάση δεδομένων
        conn = sqlite3.connect('casewise.db')
        cursor = conn.cursor()
        print("Σύνδεση επιτυχής!")
        
        # Λήψη όλων των πινάκων
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
        tables = cursor.fetchall()
        
        if not tables:
            print("Δεν βρέθηκαν πίνακες στη βάση δεδομένων!")
            return
            
        print("\nΠίνακες στη βάση δεδομένων:")
        for table in tables:
            print(f"\n- {table[0]}")
            # Λήψη της δομής του πίνακα
            cursor.execute(f"PRAGMA table_info({table[0]})")
            columns = cursor.fetchall()
            print("  Στήλες:")
            for col in columns:
                print(f"    {col[1]} ({col[2]})")
            
            # Λήψη του αριθμού των εγγραφών
            cursor.execute(f"SELECT COUNT(*) FROM {table[0]}")
            count = cursor.fetchone()[0]
            print(f"  Αριθμός εγγραφών: {count}")
        
        conn.close()
        print("\nΈλεγχος ολοκληρώθηκε επιτυχώς!")
        
    except sqlite3.Error as e:
        print(f"Σφάλμα SQLite: {e}")
    except Exception as e:
        print(f"Γενικό σφάλμα: {e}")

if __name__ == "__main__":
    check_database() 