from flask import Flask, render_template

app = Flask(__name__)

# Main route - Loads index.html
@app.route('/')
def index():
    return render_template('index.html')

# Sub-route to serve the partial HTML files (dashboard, login, etc.)
@app.route('/pages/<page_name>')
def get_page(page_name):
    # This looks inside the templates/pages/ folder
    return render_template(f'pages/{page_name}.html')

if __name__ == '__main__':
    # Setting host='0.0.0.0' makes it accessible on your local network
    app.run(debug=True, host='0.0.0.0', port=5000)
