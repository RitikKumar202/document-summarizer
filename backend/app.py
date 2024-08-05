from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.utils import secure_filename
from transformers import pipeline
import os

app = Flask(__name__)
CORS(app)  # Enable CORS
app.config['UPLOAD_FOLDER'] = 'uploads'
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # Limit to 16MB

summarizer = pipeline("summarization", model="facebook/bart-large-cnn")

if not os.path.exists(app.config['UPLOAD_FOLDER']):
    os.makedirs(app.config['UPLOAD_FOLDER'])

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    if file:
        filename = secure_filename(file.filename)
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(file_path)
        return jsonify({'filename': filename}), 200

@app.route('/summarize', methods=['POST'])
def summarize_file():
    data = request.get_json()
    filename = data.get('filename')
    if not filename:
        return jsonify({'error': 'No filename provided'}), 400
    file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    if not os.path.exists(file_path):
        return jsonify({'error': 'File not found'}), 404
    with open(file_path, 'r', encoding='utf-8') as file:
        content = file.read()

    # Summarize without setting max_length or min_length
    summary = summarizer(content, do_sample=False)

    return jsonify({'summary': summary[0]['summary_text']}), 200

if __name__ == '__main__':
    app.run(debug=True)
