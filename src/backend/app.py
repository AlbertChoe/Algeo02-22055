from flask import Flask, jsonify, request
import os
from werkzeug.utils import secure_filename
from flask_cors import CORS
import shutil

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = 'path/to/save/uploads'


@app.route('/test', methods=['GET'])
def test_connection():
    return


@app.route('/api/data', methods=['GET'])
def get_data():
    # Your data goes here, for example, a dictionary
    data = {
        "message": "Backend-frontend connection is successful!",
        "other_data": "Some other data you want to include"
    }
    shutil.copyfile(r"img\messageImage_1699171165667.jpg",
                    r"img\albert.jpg")
    # Return the data as JSON
    return jsonify(data)


@app.route('/')
def hello():
    return "Hello, World!"


@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return 'No file part'
    file = request.files['file']
    if file.filename == '':
        return 'No selected file'
    if file:
        filename = secure_filename(file.filename)
        file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
        return 'File successfully uploaded'


# Configuration
app.config['UPLOADED_ARCHIVES_DEST'] = 'path/to/save/uploads'  # set your path

if __name__ == '__main__':
    app.run(debug=True)


CORS(app)
