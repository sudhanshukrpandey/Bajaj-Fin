from flask import Flask, request, jsonify
from flask_cors import CORS
import base64

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Enable CORS for all domains on all routes with allowed headers
CORS(app, resources={r"/*": {"origins": "*"}}, headers=['Content-Type'])

@app.route('/bfhl', methods=['POST'])
def process_data():
    data = request.json.get('data', [])
    file_b64 = request.json.get('file_b64', None)  # Base64 encoded file string

    # Collect numbers and alphabets
    numbers = [x for x in data if x.isdigit()]
    alphabets = [x for x in data if x.isalpha()]
    lowercase_alphabets = [x for x in alphabets if x.islower()]

    # Find highest lowercase alphabet
    highest_lowercase_alphabet = max(lowercase_alphabets, default=None)

    # File handling
    file_valid = False
    file_mime_type = None
    file_size_kb = None

    if file_b64:
        try:
            # Decode Base64 string and calculate file size in KB
            file_data = base64.b64decode(file_b64)
            file_size_kb = round(len(file_data) / 1024, 2)  # Size in KB
            file_valid = True  # Set file as valid since decoding didn't fail
            
            # Simple MIME type check based on file signature (magic bytes)
            if file_data.startswith(b'\x89PNG'):
                file_mime_type = 'image/png'
            elif file_data.startswith(b'%PDF'):
                file_mime_type = 'application/pdf'
            else:
                file_mime_type = 'application/octet-stream'
        except Exception as e:
            file_valid = False  # Invalid file if decoding fails

    # Prepare response
    response = {
        "is_success": True,
        "user_id": "john_doe_17091999",  # Replace with your full name and DOB
        "email": "john@xyz.com",         # Replace with your email
        "roll_number": "ABCD123",        # Replace with your roll number
        "numbers": numbers,
        "alphabets": alphabets,
        "highest_lowercase_alphabet": [highest_lowercase_alphabet] if highest_lowercase_alphabet else [],
        "file_valid": file_valid,
        "file_mime_type": file_mime_type,
        "file_size_kb": file_size_kb
    }

    return jsonify(response)

@app.route('/bfhl', methods=['GET'])
def get_operation_code():
    return jsonify({"operation_code": 1})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
