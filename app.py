from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import io
import PyPDF2

app = Flask(__name__)
CORS(app)  # Enable cross-origin resource sharing for all routes

def parse_pdf_from_url(pdf_url):
    # Fetch the PDF file from the URL
    response = requests.get(pdf_url)
    response.raise_for_status()  # Raise an error if the request failed
    file_stream = io.BytesIO(response.content)
    pdf_reader = PyPDF2.PdfReader(file_stream)
    text = ""
    # Loop through all pages and concatenate extracted text.
    for page in pdf_reader.pages:
        page_text = page.extract_text()
        if page_text:
            text += page_text
    return text

@app.route('/api/parse_pdf', methods=['POST'])
def parse_pdf_endpoint():
    data = request.get_json()
    if not data or 'url' not in data:
        return jsonify({'error': 'No URL provided'}), 400
    
    pdf_url = data['url']
    try:
        parsed_text = parse_pdf_from_url(pdf_url)
        return jsonify({'text': parsed_text})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000) 