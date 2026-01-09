import psycopg2

try:
    conn = psycopg2.connect(dbname="quran_db", user="azam", password="passkey", host="localhost")
    cur = conn.cursor()

    # 1. Get unique surah names in the order they were inserted
    print("Fetching Surah names...")
    cur.execute("""
        SELECT surah_name 
        FROM verses 
        GROUP BY surah_name 
        ORDER BY MIN(id) ASC;
    """)
    surahs = [row[0] for row in cur.fetchall()]

    print(f"Found {len(surahs)} Surahs. Updating rows...")

    # 2. Update each row with the correct surah_no
    for index, name in enumerate(surahs):
        surah_number = index + 1
        cur.execute("UPDATE verses SET surah_no = %s WHERE surah_name = %s", (surah_number, name))
        print(f"Updated {name} -> Surah #{surah_number}")

    conn.commit()
    print("\nSuccess! Database updated.")

except Exception as e:
    print(f"Error: {e}")
finally:
    if 'cur' in locals(): cur.close()
    if 'conn' in locals(): conn.close()
