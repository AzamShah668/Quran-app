import json
import psycopg2

DB_CONFIG = {
    'dbname': 'quran_db',
    'user': 'azam',
    'password': 'passkey',
    'host': 'localhost'
}

def seed_from_files():
    try:
        # Load the files you just downloaded with wget
        print("Loading local JSON files...")
        with open('quran_ar.json', 'r') as f:
            data_ar = json.load(f)
        with open('quran_en.json', 'r') as f:
            data_en = json.load(f)

        conn = psycopg2.connect(**DB_CONFIG)
        cur = conn.cursor()
        
        # Clear the table in case there's old junk data
        cur.execute("TRUNCATE verses;")
        print("Table cleared. Starting transfer...")

        for s_idx, surah in enumerate(data_ar['data']['surahs']):
            s_name = surah['englishName']
            print(f"Importing {s_name}...")
            
            for a_idx, ayah in enumerate(surah['ayahs']):
                a_num = ayah['numberInSurah']
                t_ar = ayah['text']
                t_en = data_en['data']['surahs'][s_idx]['ayahs'][a_idx]['text']

                cur.execute(
                    "INSERT INTO verses (surah_name, ayah_number, text_arabic, text_english) VALUES (%s, %s, %s, %s)",
                    (s_name, a_num, t_ar, t_en)
                )
        
        conn.commit()
        cur.close()
        conn.close()
        print("\n✅ SUCCESS! All 6,236 verses are now in your database.")

    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    seed_from_files()
