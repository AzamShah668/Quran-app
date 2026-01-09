from flask import Flask, render_template, jsonify  # Added jsonify
import psycopg2                                    # Added for Database
import psycopg2.extras                             # Added for Dictionary support

app = Flask(__name__)

# --- DATABASE CONFIG ---
DB_CONFIG = {
    'dbname': 'quran_db',
    'user': 'azam',
    'password': 'passkey',
    'host': 'localhost',
    'port': '5432'
}

def get_db_connection():
    return psycopg2.connect(**DB_CONFIG, cursor_factory=psycopg2.extras.RealDictCursor)

# --- PAGE ROUTES (The part that is working now) ---

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/pages/<page_name>')
def get_page(page_name):
    return render_template(f'pages/{page_name}.html')

# --- DATABASE API ROUTE (The new part) ---

@app.route('/api/random-verse')
def get_random_verse():
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute('SELECT surah_name, ayah_number, text_arabic, text_english FROM verses ORDER BY RANDOM() LIMIT 1;')
        verse = cur.fetchone()
        cur.close()
        conn.close()
        return jsonify(verse)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
