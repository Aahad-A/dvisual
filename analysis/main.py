from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import json
from data_analysis import analyze_data
import csv

app = Flask(__name__)
CORS(app)

def detect_delimiter(file):
    file.seek(0)  # Reset file pointer to the beginning
    sample = file.read(1024).decode('utf-8')  # Read a sample of the file
    file.seek(0)  # Reset file pointer again
    
    sniffer = csv.Sniffer()
    dialect = sniffer.sniff(sample)
    return dialect.delimiter

@app.route('/analyze', methods=['POST'])
def analyze():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    
    options = json.loads(request.form.get('options', '{}'))
    
    if file:
        try:
            if file.filename.endswith('.csv'):
                # Detect the delimiter
                delimiter = detect_delimiter(file)
                print(f"Detected delimiter: {delimiter}")
                
                # Read CSV with detected delimiter, quoted fields, and force numeric columns
                df = pd.read_csv(file, sep=delimiter, quotechar='"', decimal='.', thousands=',')
            elif file.filename.endswith('.json'):
                df = pd.read_json(file)
            else:
                return jsonify({'error': 'Unsupported file format'}), 400
            
            result = analyze_data(df, options)
            return jsonify(result)
        except Exception as e:
            return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)