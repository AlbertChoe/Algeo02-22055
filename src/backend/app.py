from flask import Flask, request, jsonify, url_for, send_from_directory, make_response
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
from io import BytesIO
import os
import zipfile
from werkzeug.utils import secure_filename
from flask_cors import CORS
import json
from PIL import Image
import numpy as np
# Assuming your image processing functions (rgb_to_hsv, hsv_to_hsvFeature, makeHistogram, imageToHistogram) are defined
from hitungancolor import imageBlockToHistogram, cosineSimilarity
from hitungantexture import convertImageToGrayScale, createOccurenceMatrix, getTextureFeatures, cosineSimilarityTexture
import time
from multiprocessing import Pool
from concurrent.futures import ThreadPoolExecutor, as_completed
import requests
from bs4 import BeautifulSoup
import re
from urllib.parse import urlparse, urljoin, unquote


app = Flask(__name__, static_folder='static/image')


CORS(app)

image_dir = 'static/image'
os.makedirs(image_dir, exist_ok=True)


def process_single_image(image_path):
    if image_path.lower().endswith(('.png', '.jpg', '.jpeg')):
        # Process color histograms
        block_histograms = imageBlockToHistogram(image_path)

        # Process texture features
        gray_scale_image = convertImageToGrayScale(image_path)
        occurrence_matrix = createOccurenceMatrix(gray_scale_image)
        texture_features = getTextureFeatures(occurrence_matrix)

        return {
            'path': os.path.basename(image_path),
            'color': [hist.tolist() for hist in block_histograms],
            'texture': texture_features.tolist()
        }
    return None


def process_images_to_json(image_folder, batch_size=50):
    image_paths = [os.path.join(image_folder, img)
                   for img in os.listdir(image_folder)]
    batches = [image_paths[i:i + batch_size]
               for i in range(0, len(image_paths), batch_size)]

    all_features = {}
    with Pool() as pool:
        for batch in batches:
            results = pool.map(process_single_image, batch)
            for result in results:
                if result:
                    all_features[result['path']] = {
                        'color': result['color'],
                        'texture': result['texture']
                    }

    with open('image_features.json', 'w') as file:
        json.dump(all_features, file)


def clear_image_directory(directory):
    """Remove all files in the specified directory."""
    for item in os.listdir(directory):
        item_path = os.path.join(directory, item)
        if os.path.isfile(item_path):
            os.remove(item_path)

# def is_valid_url(url):
#     try:
#         result = urlparse(url)
#         return all([result.scheme, result.netloc])
#     except ValueError:
#         return False

# # def download_images_from_url(url, target_folder):
# #     response = requests.get(url)
# #     soup = BeautifulSoup(response.text, 'html.parser')
# #     images = soup.find_all('img')
# #     for img in images:
# #         src = img.get('src')
# #         if src and (src.endswith('.jpg') or src.endswith('.jpeg') or src.endswith('.png')):
# #             # Handle relative URLs
# #             if not src.startswith('http'):
# #                 src = url + src
# #             download_image(src, target_folder)

# # def download_image(image_url, target_folder):
# #     response = requests.get(image_url)
# #     if response.status_code == 200:
# #         filename = os.path.join(target_folder, image_url.split('/')[-1])
# #         with open(filename, 'wb') as f:
# #             f.write(response.content)

# # def download_image(image_url, target_folder):
# #     response = requests.get(image_url)
# #     if response.status_code == 200 and 'image' in response.headers.get('Content-Type', ''):
# #         filename = os.path.join(target_folder, secure_filename(image_url.split('/')[-1]))
# #         with open(filename, 'wb') as f:
# #             f.write(response.content)
# #     else:
# #         print(f"Failed to download or not an image: {image_url}")

# # def download_images_from_url(url, target_folder):
# #     response = requests.get(url)
# #     if response.status_code == 200:
# #         soup = BeautifulSoup(response.text, 'html.parser')
# #         images = soup.find_all('img')
        
# #         # Regex to match URLs ending with .jpg, .jpeg, or .png before any query or fragment
# #         img_regex = re.compile(r'\.(jpg|jpeg|png)(?![\w\d])', re.IGNORECASE)

# #         for img in images:
# #             src = img.get('src')
# #             if src and img_regex.search(src):
# #                 src = urljoin(url, src)
# #                 download_image(src, target_folder)

# def clean_image_url(url):
#     """
#     Clean, decode the image URL, and remove any query parameters or extra strings after the image extension.
#     """
#     # Decode URL-encoded characters
#     url = unquote(url)
    
#     # Regular expression to capture the URL up to the image extension
#     match = re.search(r'(.*\.(jpg|jpeg|png))', url, re.IGNORECASE)
    
#     if match:
#         # Return only the part of the URL up to the image extension
#         return match.group(1)
#     else:
#         # If no image extension is found, return the original URL
#         return url
# def download_image(image_url, target_folder, counter):
#     image_url = clean_image_url(image_url)

#     if image_url.endswith(('.png', '.jpg', '.jpeg')):
#         response = requests.get(image_url)
#         if response.status_code == 200:
#             filename = os.path.join(target_folder, f'image{counter}.png') # All images saved as PNG
#             with open(filename, 'wb') as f:
#                 f.write(response.content)
#         else:
#             print(f"Failed to download: {image_url}")
#     else:
#         print(f"Not an image or unsupported format: {image_url}")

# def download_images_from_url(url, target_folder):
#     response = requests.get(url)
#     if response.status_code == 200:
#         soup = BeautifulSoup(response.text, 'html.parser')
#         images = soup.find_all('img')

#         counter = 1
#         for img in images:
#             src = img.get('src')
#             if src:
#                 src = urljoin(url, src)
#                 download_image(src, target_folder, counter)
#                 counter += 1

@app.route('/upload_link', methods=['POST'])
def scrape_images():
    # Get URL from the frontend
    data = request.json
    url = data['url']

    # Fetch the webpage
    response = requests.get(url)
    soup = BeautifulSoup(response.content, 'html.parser')

    # Find all image tags on the webpage
    images = soup.find_all('img')

    if images:
        saved_images = []
        allowed_extensions = ['.jpg', '.png', '.jpeg']

        for index, image in enumerate(images):
            # Construct the full URL for the image
            image_url = urljoin(url, image['src'])

            # Parse the URL to isolate the extension
            parsed_url = urlparse(image_url)
            path = parsed_url.path
            ext = os.path.splitext(path)[1].lower()

            # Check if the extension is one of the allowed types
            clear_image_directory(image_dir)
            if ext in allowed_extensions:
                # Download the image
                image_response = requests.get(image_url)

                # Save the image with a unique name
                image_name = f'downloaded_image_{index}{ext}'
                image_path = os.path.join(image_dir, image_name)

                with open(image_path, 'wb') as file:
                    file.write(image_response.content)
                saved_images.append(image_name)

        return {'message': 'Images saved', 'saved_images': saved_images}
    else:
        return {'error': 'No images found'}, 404
# def upload_from_link():
#     start_time = time.time()
#     data = request.get_json()
#     link = data.get('link')

#     if not link or not is_valid_url(link):
#         return jsonify({"error": "No link provided"}), 400

#     image_dir = 'static/image'
#     clear_image_directory(image_dir)

#     try:
#         download_images_from_url(link, image_dir)
#         if not os.listdir(image_dir):  # Check if directory is still empty
#             return jsonify({"error": "No images found at the provided link"}), 400
#     except Exception as e:
#         return jsonify({"error": "Error processing the link: " + str(e)}), 500
    
#     extraction_time = time.time()

#     process_images_to_json(image_dir)
#     processing_time = time.time()
#     total_time = processing_time - start_time
#     print(f"Total Time: {total_time:.2f} seconds")
#     print(f"Extraction Time: {extraction_time - start_time:.2f} seconds")
#     print(f"Processing Time: {processing_time - extraction_time:.2f} seconds")

#     return jsonify({"message": "Images from link processed successfully"}), 200

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


# def compute_similarity(image_name, features, target_features, search_type):
#     if search_type == 'color':
#         total_similarity = sum(cosineSimilarity(np.array(hist), target_hist)
#                                for hist, target_hist in zip(features['color'], target_features))
#         avg_similarity = total_similarity / len(target_features)
#     else:
#         avg_similarity = cosineSimilarityTexture(
#             features['texture'], target_features)

#     if avg_similarity >= 0.6:
#         return image_name, avg_similarity
#     return None


@app.route('/search', methods=['POST'])
def search_image():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400

    target_file = request.files['file']
    if target_file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    start_time = time.time()
    search_type = request.args.get('type', 'color')

    with open('image_features.json', 'r') as json_file:
        image_features = json.load(json_file)

    if search_type == 'color':
        target_features = [np.array(hist)
                           for hist in imageBlockToHistogram(target_file)]
    else:  # Assume texture search
        gray_scale_image = convertImageToGrayScale(target_file)
        occurrence_matrix = createOccurenceMatrix(gray_scale_image)
        target_features = np.array(getTextureFeatures(occurrence_matrix))

    similarities = {}
    for image_name, features in image_features.items():
        if search_type == 'color':
            # Assuming color histograms are stored in a list of arrays
            total_similarity = sum(cosineSimilarity(np.array(hist), target_hist)
                                   for hist, target_hist in zip(features['color'], target_features))
            avg_similarity = total_similarity / len(target_features)
        else:
            # For texture, we have a single feature array
            avg_similarity = cosineSimilarityTexture(
                features['texture'], target_features)

        if avg_similarity >= 0.6:  # Adjust the threshold as needed
            similarities[image_name] = avg_similarity

    end_time = time.time()
    search_duration = end_time - start_time

    # Sorting and storing similarities
    sorted_similarities = sorted(
        similarities.items(), key=lambda x: x[1], reverse=True)
    paginated_results = sorted_similarities[:6]  # First page results

    # Store results in JSON
    with open('search_results.json', 'w') as file:
        json.dump({
            "total_images": len(sorted_similarities),
            "search_duration": search_duration,
            "sorted_similarities": sorted_similarities
        }, file)

    # Response for the first page
    response_data = {
        "search_duration": search_duration,
        "total_images": len(sorted_similarities),
        "current_page": 1,
        "total_pages": len(sorted_similarities) // 6 + (1 if len(sorted_similarities) % 6 else 0),
        "images": [
            {
                "image_name": image_name,
                "image_url": url_for('send_image', filename=image_name),
                "similarity": round(similarity * 100, 5)
            }
            for image_name, similarity in paginated_results
        ]
    }
    return jsonify(response_data), 200


@app.route('/change_page', methods=['GET'])
def change_page():
    page = int(request.args.get('page', 1))
    per_page = 6

    # Read the stored results
    with open('search_results.json', 'r') as file:
        data = json.load(file)

    start_index = (page - 1) * per_page
    end_index = start_index + per_page
    paginated_results = data["sorted_similarities"][start_index:end_index]

    # Constructing paginated response
    response_data = {
        "search_duration": data["search_duration"],
        "total_images": data["total_images"],
        "current_page": page,
        "total_pages": data["total_images"] // per_page + (1 if data["total_images"] % per_page else 0),
        "images": [
            {
                "image_name": image_name,
                "image_url": url_for('send_image', filename=image_name),
                "similarity": round(similarity*100, 5)
            }
            for image_name, similarity in paginated_results
        ]
    }
    return jsonify(response_data), 200


def generate_pdf(sorted_similarities, total_images, search_duration):
    buffer = BytesIO()
    c = canvas.Canvas(buffer, pagesize=letter)
    width, height = letter
    y_position = height - 30  # Start from top

    # Adding summary information at the beginning of the PDF
    c.drawString(30, y_position, f"Total Images: {total_images}")
    y_position -= 20
    c.drawString(30, y_position,
                 f"Search Duration: {search_duration:.2f} seconds")
    y_position -= 40  # Adjust position for first image

    for image_name, similarity in sorted_similarities:
        # Check space and add new page if needed
        if y_position < 200:  # Adjust as per your image height
            c.showPage()
            y_position = height - 30

        # Text for image name and similarity
        c.drawString(
            30, y_position, f"{image_name} - Similarity: {round(similarity * 100, 5)}%")
        y_position -= 10  # Adjust text position

        # Load and draw the image directly from static folder
        image_path = os.path.join('static', 'image', image_name)
        if os.path.exists(image_path):
            c.drawImage(image_path, 30, y_position - 150,
                        width=200, height=150)  # Adjust image position

        y_position -= 175  # Adjust for next image

    c.save()
    buffer.seek(0)
    return buffer


@app.route('/download_pdf', methods=['GET'])
def download_pdf():
    with open('search_results.json', 'r') as file:
        data = json.load(file)
        sorted_similarities = data["sorted_similarities"]
        total_images = data["total_images"]
        search_duration = data["search_duration"]

    pdf_buffer = generate_pdf(
        sorted_similarities, total_images, search_duration)
    response = make_response(pdf_buffer.getvalue())
    response.headers['Content-Type'] = 'application/pdf'
    response.headers['Content-Disposition'] = 'attachment; filename=sorted_similarities.pdf'
    return response


if __name__ == '__main__':
    app.run(debug=True)
