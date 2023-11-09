from flask import Flask, request, jsonify
import os
import zipfile
from werkzeug.utils import secure_filename
from flask_cors import CORS
import json
from PIL import Image
import numpy as np
# Assuming your image processing functions (rgb_to_hsv, hsv_to_hsvFeature, makeHistogram, imageToHistogram) are defined
from hitungan import imageToHistogram, cosineSimilarity

app = Flask(__name__)
CORS(app)

image_dir = 'image'
os.makedirs(image_dir, exist_ok=True)

# Function to process images and create JSON


def process_images_to_json(image_folder):
    image_data = {}
    for image_name in os.listdir(image_folder):
        if image_name.lower().endswith(('.png', '.jpg', '.jpeg')):
            image_path = os.path.join(image_folder, image_name)
            histogram = imageToHistogram(image_path)
            image_data[image_name] = histogram.tolist()

    with open('image_histograms.json', 'w') as json_file:
        json.dump(image_data, json_file)


def clear_image_directory(directory):
    """Remove all files in the specified directory."""
    for item in os.listdir(directory):
        item_path = os.path.join(directory, item)
        if os.path.isfile(item_path):
            os.remove(item_path)


@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    # Clear existing data in the image directory
    clear_image_directory(image_dir)

    # Save the ZIP file temporarily
    temp_zip_path = os.path.join(image_dir, 'temp.zip')
    file.save(temp_zip_path)

    # Extract only the allowed file types
    allowed_extensions = {'jpg', 'jpeg', 'png'}
    try:
        with zipfile.ZipFile(temp_zip_path, 'r') as zip_ref:
            for file_info in zip_ref.infolist():
                if file_info.filename.split('.')[-1].lower() in allowed_extensions:
                    # Extract files directly to the image directory, ignoring any folder structure in the ZIP file
                    file_info.filename = os.path.basename(file_info.filename)
                    zip_ref.extract(file_info, image_dir)
    except zipfile.BadZipFile:
        return jsonify({"error": "Invalid ZIP file"}), 400
    finally:
        os.remove(temp_zip_path)

    # Process the extracted images and create a JSON file
    process_images_to_json(image_dir)

    return jsonify({"message": "File uploaded, extracted, and processed successfully"}), 200


@app.route('/search', methods=['POST'])
def search_image():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400

    target_file = request.files['file']
    if target_file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    # Process the target image to get its histogram
    target_histogram = imageToHistogram(target_file)

    # Read the histogram JSON file
    with open('image_histograms.json', 'r') as json_file:
        image_histograms = json.load(json_file)

    # Compare histograms and calculate similarity
    similarities = {}
    for image_name, histogram in image_histograms.items():
        similarity = cosineSimilarity(np.array(histogram), target_histogram)
        similarities[image_name] = similarity

    # Sort by similarity score (higher is more similar)
    sorted_similarities = sorted(
        similarities.items(), key=lambda x: x[1], reverse=True)

    return jsonify(sorted_similarities), 200

# @app.route('/search', methods=['POST'])
# def search_image():
#     if 'file' not in request.files:
#         return jsonify({"error": "No file part"}), 400

#     target_file = request.files['file']
#     if target_file.filename == '':
#         return jsonify({"error": "No selected file"}), 400

#     # Process the target image to get its histogram
#     target_histogram = imageToHistogram(target_file)

#     # Read the histogram JSON file
#     with open('image_histograms.json', 'r') as json_file:
#         image_histograms = json.load(json_file)

#     # Compare histograms and calculate similarity
#     similarities = {}
#     for image_name, histogram in image_histograms.items():
#         similarity = cosineSimilarity(np.array(histogram), target_histogram)
#         similarities[image_name] = similarity

#     # Sort by similarity score (higher is more similar)
#     sorted_similarities = sorted(
#         similarities.items(), key=lambda x: x[1], reverse=True)

#     # Creating a structured response with image names and their similarity scores
#     similarity_list = [{"image_name": name, "similarity_score": score}
#                        for name, score in sorted_similarities]

#     return jsonify(similarity_list), 200


if __name__ == '__main__':
    app.run(debug=True)
