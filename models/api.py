from flask import Flask, jsonify, request, redirect, url_for, make_response
import os
from werkzeug.utils import secure_filename
from config import IMAGE_DIR
import cv2
from flask_cors import CORS

# Validation functions
from middleware.validation import *

# Algorithms
from src.image_differencing_algorithm import *

app = Flask(__name__)
CORS(app)

environment = "dev"


# @route   POST /upload_satellite_images
# @desc    Upload a maximum of two satellite images for analysis
# @params  image_1(file), image_2(file), image_1_description, image_2_description, project_id, resource_id
# @access  Private

@app.route('/upload_satellite_images', methods=['POST'])
def upload_satellite_images():

    response = {"status": 0, "message": "", "errors": [], "data": []}

    # Validate input data for project and resource IDs

    response = image_upload_input_validation()

    if len(response['errors']) > 0:
        response["status"] = 400
        response['message'] = "error"
        return make_response(jsonify(response), response['status'])

    # Validate input images

    image_1_description = request.form["image_1_description"]
    image_1 = request.files["image_1"]
    image_2_description = request.form["image_2_description"]
    image_2 = request.files["image_2"]

    image_1_validation_errors = image_description_validation(
        key="image_1", image_description=image_1_description, image_name=image_1)

    if len(image_1_validation_errors) > 0:
        response['errors'].append(image_1_validation_errors)

    image_2_validation_errors = image_description_validation(
        key="image_2", image_description=image_2_description, image_name=image_2)

    if len(image_2_validation_errors) > 0:
        response['errors'].append(image_2_validation_errors)

    if len(response['errors']) > 0:
        response["status"] = 400
        response['message'] = "error"
        return make_response(jsonify(response), response['status'])

    # Create resource path for the project - ignore if already exist

    project_id = request.form["project_id"]
    resource_id = request.form["resource_id"]

    IMAGE_PATH = os.path.join(IMAGE_DIR, project_id, resource_id)
    os.makedirs(IMAGE_PATH, exist_ok=True)

    # Change filename to reflect the image desctiption
    image_1_ext = image_1.filename.rsplit(".", 1)[1]
    image_2_ext = image_2.filename.rsplit(".", 1)[1]

    image_1.save(os.path.join(
        IMAGE_PATH, f"{image_1_description}.{image_1_ext}"))
    image_2.save(os.path.join(
        IMAGE_PATH, f"{image_2_description}.{image_2_ext}"))

    # Convert the images to the maximum size if above

    image_1_cropped = crop_input_image(os.path.join(
        IMAGE_PATH, f"{image_1_description}.{image_1_ext}"))
    image_2_cropped = crop_input_image(os.path.join(
        IMAGE_PATH, f"{image_2_description}.{image_2_ext}"))

    CROPPED_IMAGE_PATH = os.path.join(
        IMAGE_PATH, "cropped")
    os.makedirs(CROPPED_IMAGE_PATH, exist_ok=True)

    # Save cropped image to the cropped subfolder

    image_1_cropped.save(os.path.join(
        CROPPED_IMAGE_PATH, f"{image_1_description}.{image_1_ext}"))
    image_2_cropped.save(os.path.join(
        CROPPED_IMAGE_PATH, f"{image_2_description}.{image_2_ext}"))

    IMAGE_URL = os.path.join(
        "satellite_images", project_id, resource_id, "cropped")

    response['status'] = 200
    response['message'] = "success"
    response['data'] = {
        "image_1_name": f"{image_1_description}.{image_1_ext}",
        "image_2_name": f"{image_2_description}.{image_2_ext}",
        "image_1_url": url_for('static', filename=os.path.join(IMAGE_URL, f"{image_1_description}.{image_1_ext}")),
        "image_2_url": url_for('static', filename=os.path.join(IMAGE_URL, f"{image_2_description}.{image_2_ext}"))

    }

    return make_response(jsonify(response), response['status'])


# @route   GET /images
# @desc    Get available images for a specified project ID and resource
# @params  project_id, resource_id (There can only be maximum of two images in any project resource)
# @access  Private

@app.route('/get_satellite_images', methods=['POST'])
def get_satellite_images():
    response = {"status": 0, "message": "", "errors": [], "data": []}

    print(request.json)

    # Validate project ID and resource ID input
    response = project_input_validation()

    if len(response['errors']) > 0:
        response["status"] = 400
        response['message'] = "error"
        return make_response(jsonify(response))

    project_id = request.json["project_id"]
    resource_id = request.json["resource_id"]

    # Check if project ID and resource ID exist
    if project_id not in os.listdir(IMAGE_DIR):
        response["errors"].append(
            {'project_id': "Project not found"})

    if len(response['errors']) > 0:
        response["status"] = 400
        response['message'] = "error"
        return make_response(jsonify(response))

    if resource_id not in os.listdir(os.path.join(IMAGE_DIR, project_id)):

        response["errors"].append(
            {'resource_id': "Resource not found"})

    if len(response['errors']) > 0:
        response["status"] = 400
        response['message'] = "error"
        return make_response(jsonify(response))

    IMAGE_PATH = os.path.join(IMAGE_DIR, project_id, resource_id, "cropped")
    images = os.listdir(IMAGE_PATH)

    image_url = os.path.join(
        "satellite_images", project_id, resource_id, "cropped")

    if len(images) != 2:
        response["errors"].append(
            {'images': "No images available, upload images"})

    if len(response['errors']) > 0:
        response["status"] = 400
        response['message'] = "error"
        return make_response(jsonify(response))

    image_1 = images[0]
    image_2 = images[1]

    # Fetch Image

    response['status'] = 200
    response['message'] = "success"
    response['data'] = {
        "image_1_name": image_1,
        "image_2_name": image_2,
        "image_1_url": url_for('static', filename=os.path.join(image_url, image_1)),
        "image_2_url": url_for('static', filename=os.path.join(image_url, image_2))
    }

    return make_response(jsonify(response), response['status'])


# @route   POST /image_differencing_algorithm_block
# @desc    Compute the image differencing and calculate the image differeincing score
# @access  Private

@app.route('/image_differencing_algorithm_block', methods=['POST'])
def image_differencing_algorithm_block():

    response = {"status": 0, "message": "", "errors": [], "data": []}

    # Validate project ID and resource ID input
    response = project_input_validation()

    if len(response['errors']) > 0:
        response["status"] = 400
        response['message'] = "error"
        return make_response(jsonify(response), response['status'])

    project_id = request.json["project_id"]
    resource_id = request.json["resource_id"]

    # Check if project ID and resource ID exist
    if project_id not in os.listdir(IMAGE_DIR):
        response["errors"].append(
            {'project_id': "Project not found"})

    if len(response['errors']) > 0:
        response["status"] = 400
        response['message'] = "error"
        return make_response(jsonify(response), response['status'])

    if resource_id not in os.listdir(os.path.join(IMAGE_DIR, project_id)):

        response["errors"].append(
            {'resource_id': "Resource not found"})

    if len(response['errors']) > 0:
        response["status"] = 400
        response['message'] = "error"
        return make_response(jsonify(response), response['status'])

    IMAGE_PATH = os.path.join(IMAGE_DIR, project_id, resource_id, "cropped")
    images = os.listdir(IMAGE_PATH)

    if len(images) != 2:
        response["errors"].append(
            {'images': "No images available, upload images"})

    if len(response['errors']) > 0:
        response["status"] = 400
        response['message'] = "error"
        return make_response(jsonify(response), response['status'])

    image_1 = images[0]
    image_2 = images[1]

    image1_diff, image2_diff, negative_diff = extract_image_diff_outputs(
        IMAGE_PATH, IMAGE_PATH, image_1, image_2)

    # Create the storage directories for the differenced image
    BLOCK_IMAGE_DIFF_PATH = os.path.join(
        IMAGE_DIR, project_id, resource_id, "block_diff")

    os.makedirs(BLOCK_IMAGE_DIFF_PATH, exist_ok=True)

    cv2.imwrite(
        f'{BLOCK_IMAGE_DIFF_PATH}/old_image_{image_1}', image1_diff)

    cv2.imwrite(
        f'{BLOCK_IMAGE_DIFF_PATH}/new_image_{image_2}', image2_diff)

    cv2.imwrite(f'{BLOCK_IMAGE_DIFF_PATH}/image_diff.png', negative_diff)

    # Calculate SIRS Urban Development Index

    UDIndex = get_image_diff_percentage(
        IMAGE_PATH, IMAGE_PATH, image_1, image_2)

    # Generate Output

    DIFF_IMAGE_URL = os.path.join(
        "satellite_images", project_id, resource_id, "block_diff")
    IMAGE_URL = os.path.join(
        "satellite_images", project_id, resource_id, "cropped")

    response['status'] = 200
    response['message'] = "success"
    response['data'] = {

        "image_1_name": image_1,
        "image_2_name": image_2,
        "image_1_url": url_for('static', filename=os.path.join(IMAGE_URL, image_1)),
        "image_2_url": url_for('static', filename=os.path.join(IMAGE_URL, image_2)),
        "diff_image_1_url": url_for('static', filename=os.path.join(DIFF_IMAGE_URL, f"old_image_{image_1}")),
        "diff_image_2_url": url_for('static', filename=os.path.join(DIFF_IMAGE_URL, f"new_image_{image_2}")),
        "image_diff_url": url_for('static', filename=os.path.join(DIFF_IMAGE_URL, f"image_diff.png")),
        "urban_development_index": round(UDIndex, 2),
    }

    return make_response(jsonify(response), response['status'])


# @route   POST /image_differencing_algorithm_grid
# @desc    Compute the image grids and calculate the differencing and calculate the image differeincing score
# @access  Private

@app.route('/image_differencing_algorithm_grid', methods=['POST'])
def image_differencing_algorithm_grid():

    # Validate Inputs
    response = {"status": 0, "message": "", "errors": [], "data": []}

    # Validate project ID and resource ID input
    response = project_input_validation()

    if len(response['errors']) > 0:
        response["status"] = 400
        response['message'] = "error"
        return make_response(jsonify(response), response['status'])

    project_id = request.json["project_id"]
    resource_id = request.json["resource_id"]

    # Check if project ID and resource ID exist
    if project_id not in os.listdir(IMAGE_DIR):
        response["errors"].append(
            {'project_id': "Project not found"})

    if len(response['errors']) > 0:
        response["status"] = 400
        response['message'] = "error"
        return make_response(jsonify(response), response['status'])

    if resource_id not in os.listdir(os.path.join(IMAGE_DIR, project_id)):

        response["errors"].append(
            {'resource_id': "Resource not found"})

    if len(response['errors']) > 0:
        response["status"] = 400
        response['message'] = "error"
        return make_response(jsonify(response), response['status'])

    IMAGE_PATH = os.path.join(IMAGE_DIR, project_id, resource_id, "cropped")
    images = os.listdir(IMAGE_PATH)
    IMAGE_GRID_PATH = os.path.join(IMAGE_DIR, project_id, resource_id, "grid")
    os.makedirs(os.path.join(IMAGE_GRID_PATH, "image_1"), exist_ok=True)
    os.makedirs(os.path.join(IMAGE_GRID_PATH, "image_2"), exist_ok=True)

    if len(images) != 2:
        response["errors"].append(
            {'images': "No images available, upload images"})

    if len(response['errors']) > 0:
        response["status"] = 400
        response['message'] = "error"
        return make_response(jsonify(response), response['status'])

    image_1 = images[0]
    image_2 = images[1]

    # Run grid splitting algorithm for both new and old images

    splitting_algorithm(IMAGE_PATH, IMAGE_GRID_PATH, image_1, key="image_1")
    splitting_algorithm(IMAGE_PATH, IMAGE_GRID_PATH, image_2, key="image_2")

    # For each grid run the image differencing algorithm on each batch of images

    image_1_grid_list = os.listdir(os.path.join(IMAGE_GRID_PATH, "image_1"))
    image_2_grid_list = os.listdir(os.path.join(IMAGE_GRID_PATH, "image_2"))

    # Create the storage directories for the differenced images

    GRID_IMAGE_DIFF_PATH = os.path.join(
        IMAGE_DIR, project_id, resource_id, "grid_diff")

    os.makedirs(GRID_IMAGE_DIFF_PATH, exist_ok=True)

    grid_item = 0
    UDIndex = {}
    while grid_item < len(image_1_grid_list) and grid_item < len(image_2_grid_list):
        try:
            IMAGE_1_GRID_PATH = os.path.join(IMAGE_GRID_PATH, "image_1")
            IMAGE_2_GRID_PATH = os.path.join(IMAGE_GRID_PATH, "image_2")
            image_1 = f"{str(grid_item)}.png"
            image_2 = f"{str(grid_item)}.png"

            image1_diff, image2_diff, negative_diff = extract_image_diff_outputs(
                IMAGE_1_GRID_PATH, IMAGE_2_GRID_PATH, image_1, image_2)

            # Create a directory for the grid item
            os.makedirs(os.path.join(
                GRID_IMAGE_DIFF_PATH, str(grid_item)), exist_ok=True)

            cv2.imwrite(
                f'{GRID_IMAGE_DIFF_PATH}/{str(grid_item)}/old_image_{image_1}', image1_diff)

            cv2.imwrite(
                f'{GRID_IMAGE_DIFF_PATH}/{str(grid_item)}/new_image_{image_2}', image2_diff)

            cv2.imwrite(
                f'{GRID_IMAGE_DIFF_PATH}/{str(grid_item)}/image_diff_{grid_item}.png', negative_diff)

            # Calculate SIRS Urban Development Index

            UDIndex[f"{grid_item}"] = get_image_diff_percentage(
                IMAGE_1_GRID_PATH, IMAGE_2_GRID_PATH, f"{str(grid_item)}.png", f"{str(grid_item)}.png")

        except:
            # Except to pass the .DS_Store file created
            pass

        grid_item += 1

    # Generate Output

    IMAGE_URL = os.path.join(
        "satellite_images", project_id, resource_id, "cropped")

    GRID_IMAGE_URL = os.path.join(
        "satellite_images", project_id, resource_id, "grid")

    DIFF_IMAGE_URL = os.path.join(
        "satellite_images", project_id, resource_id, "grid_diff")

    images = os.listdir(IMAGE_PATH)
    image_1 = images[0]
    image_2 = images[1]

    response['status'] = 200
    response['message'] = "success"
    response['data'] = {
        "image_1_name": image_1,
        "image_2_name": image_2,
        "image_1_url": url_for('static', filename=os.path.join(IMAGE_URL, image_1)),
        "image_2_url": url_for('static', filename=os.path.join(IMAGE_URL, image_2)),
        "image_grid": []
    }

    grid_item = 0

    while grid_item < len(image_1_grid_list) and grid_item < len(image_2_grid_list):
        try:
            response['data']['image_grid'].append({
                # Grid Image 1 and 2, un-differenced
                "image_1_grid_url": url_for('static', filename=os.path.join(GRID_IMAGE_URL, "image_1", f"{str(grid_item)}.png")),
                "image_2_grid_url": url_for('static', filename=os.path.join(GRID_IMAGE_URL, "image_2", f"{str(grid_item)}.png")),

                # Grid Images 1 and 2 differenced
                "diff_image_1_url": url_for('static', filename=os.path.join(DIFF_IMAGE_URL, str(grid_item), f"old_image_{str(grid_item)}.png")),
                "diff_image_2_url": url_for('static', filename=os.path.join(DIFF_IMAGE_URL, str(grid_item), f"new_image_{str(grid_item)}.png")),

                # Grid Image Negative
                "image_diff_url": url_for('static', filename=os.path.join(DIFF_IMAGE_URL, str(grid_item), f"image_diff_{str(grid_item)}.png")),
                "urban_development_index": round(UDIndex[str(grid_item)], 2)


            })

        except:
            pass

        grid_item += 1

    return make_response(jsonify(response), response['status'])


if environment == "dev":
    if __name__ == '__main__':
        app.run()

else:
    if __name__ == '__main__':
        # Bind to PORT if defined, otherwise default to 5000.
        port = int(os.environ.get('PORT', 9000))
        app.run(host='0.0.0.0', port=port)
