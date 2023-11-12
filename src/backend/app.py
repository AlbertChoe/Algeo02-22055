from flask import Flask, request, jsonify, url_for, send_from_directory
import os
import zipfile
from werkzeug.utils import secure_filename
from flask_cors import CORS
import json
from PIL import Image
import numpy as np
# Assuming your image processing functions (rgb_to_hsv, hsv_to_hsvFeature, makeHistogram, imageToHistogram) are defined
from hitungan import imageBlockToHistogram, cosineSimilarity
import time
from multiprocessing import Pool


app = Flask(__name__, static_folder='static/image')


CORS(app)

image_dir = 'static/image'
os.makedirs(image_dir, exist_ok=True)

# Function to process images and create JSON


# def process_single_image(image_path):
#     if image_path.lower().endswith(('.png', '.jpg', '.jpeg')):
#         histogram = imageToHistogram(image_path)
#         return (image_path, histogram.tolist())
#     return None


# def process_images_to_json(image_folder):
#     image_paths = [os.path.join(image_folder, img)
#                    for img in os.listdir(image_folder)]

#     with Pool() as pool:
#         results = pool.map(process_single_image, image_paths)

#     # Filter out None results and convert to dictionary
#     image_data = {os.path.basename(
#         path): hist for path, hist in results if path is not None}

#     with open('image_histograms.json', 'w') as json_file:
#         json.dump(image_data, json_file)
# def process_batch_of_images(image_paths):
#     batch_histograms = {}
#     for image_path in image_paths:
#         if image_path.lower().endswith(('.png', '.jpg', '.jpeg')):
#             histogram = imageToHistogram(image_path)
#             batch_histograms[os.path.basename(image_path)] = histogram.tolist()
#     return batch_histograms

def process_batch_of_images(image_paths):
    batch_histograms = {}
    for image_path in image_paths:
        if image_path.lower().endswith(('.png', '.jpg', '.jpeg')):
            block_histograms = imageBlockToHistogram(image_path)
            batch_histograms[os.path.basename(image_path)] = [
                hist.tolist() for hist in block_histograms]
    return batch_histograms

# Adjust process_images_to_json to use the modified process_batch_of_images


def process_images_to_json(image_folder, batch_size=50):
    image_paths = [os.path.join(image_folder, img)
                   for img in os.listdir(image_folder)]

    # Create batches of image paths
    batches = [image_paths[i:i + batch_size]
               for i in range(0, len(image_paths), batch_size)]

    # Use multiprocessing to process each batch
    with Pool() as pool:
        results = pool.map(process_batch_of_images, batches)

    # Combine results from all batches
    all_histograms = {}
    for batch_result in results:
        all_histograms.update(batch_result)

    with open('image_histograms.json', 'w') as json_file:
        json.dump(all_histograms, json_file)


def clear_image_directory(directory):
    """Remove all files in the specified directory."""
    for item in os.listdir(directory):
        item_path = os.path.join(directory, item)
        if os.path.isfile(item_path):
            os.remove(item_path)


@app.route('/upload', methods=['POST'])
def upload_file():

    start_time = time.time()

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

    extraction_time = time.time()

    # Process the extracted images and create a JSON file
    process_images_to_json(image_dir)
    processing_time = time.time()
    total_time = processing_time - start_time
    print(f"Total Time: {total_time:.2f} seconds")
    print(f"Extraction Time: {extraction_time - start_time:.2f} seconds")
    print(f"Processing Time: {processing_time - extraction_time:.2f} seconds")
    return jsonify({"message": "File uploaded, extracted, and processed successfully"}), 200


@app.route('/images/<filename>')
def send_image(filename):
    return send_from_directory('static/image', filename)


@app.route('/search', methods=['POST'])
def search_image():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400

    target_file = request.files['file']
    if target_file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    start_time = time.time()

    target_block_histograms = imageBlockToHistogram(target_file)

    with open('image_histograms.json', 'r') as json_file:
        image_histograms = json.load(json_file)

    similarities = {}
    for image_name, block_histograms in image_histograms.items():
        total_similarity = 0
        for i, hist in enumerate(block_histograms):
            total_similarity += cosineSimilarity(
                np.array(hist), target_block_histograms[i])
        avg_similarity = total_similarity / len(block_histograms)
        if avg_similarity >= 0.6:  # 60% similarity threshold
            similarities[image_name] = avg_similarity

    end_time = time.time()
    search_duration = end_time - start_time

    # Pagination
    page = int(request.args.get('page', 1))
    per_page = 6
    total_pages = len(similarities) // per_page + \
        (1 if len(similarities) % per_page else 0)

    sorted_similarities = sorted(
        similarities.items(), key=lambda x: x[1], reverse=True)
    paginated_results = sorted_similarities[(page-1)*per_page: page*per_page]

    # Constructing response with images and their similarity scores
    response_data = {
        "search_duration": search_duration,
        "total_images": len(similarities),
        "current_page": page,
        "total_pages": total_pages,
        "images": [
            {
                "image_name": image_name,
                # Construct the URL using the new route
                "image_url": url_for('send_image', filename=image_name),
                "similarity": round(similarity * 100, 2)
            }
            for image_name, similarity in paginated_results
        ]
    }

    return jsonify(response_data), 200


if __name__ == '__main__':
    app.run(debug=True)


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
