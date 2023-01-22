from config import IMAGE_EXTENSIONS, IMAGE_SIZE
from flask import request


def image_upload_input_validation():
    response = {"status": 0, "message": "", "errors": [], "data": []}

    # Validate Inputs
    if "image_1" in request.files:
        image_1 = request.files["image_1"]
    else:
        response["errors"].append({"image_1": "Missing file: image_1"})

    if "image_2" in request.files:
        image_2 = request.files["image_2"]
    else:
        response["errors"].append({"image_2": "Missing file: image_2"})

    if "image_1_description" in request.form:
        image_1_description = request.form["image_1_description"]
    else:
        response["errors"].append(
            {'image_1_description': "Missing form args; image_1_description"})

    if "image_2_description" in request.form:
        image_2_description = request.form["image_2_description"]
    else:
        response["errors"].append(
            {'image_2_description': "Missing form args; image_2_description"})

     # Validate project_id and resource_id input

    if "project_id" in request.form:
        project_id = request.form["project_id"]
        if project_id == "":
            response["errors"].append(
                {'project_id': "Project ID must be provided"})
    else:
        response["errors"].append(
            {'project_id': "Missing form args; project_id"})

    if "resource_id" in request.form:
        resource_id = request.form["resource_id"]
        if resource_id == "":
            response["errors"].append(
                {'resource_id': "Resource ID must be provided"})
    else:
        response["errors"].append(
            {'resource_id': "Missing form args; resource_id"})

    return response


def project_input_validation():

    response = {"status": 0, "message": "", "errors": [], "data": []}

    # Validate inputs
    if "project_id" in request.json:
        project_id = request.json["project_id"]
        if project_id == "":
            response["errors"].append(
                {'project_id': "Project ID must be provided"})
    else:
        response["errors"].append(
            {'project_id': "Missing form args; project_id"})

    if "resource_id" in request.json:
        resource_id = request.json["resource_id"]
        if resource_id == "":
            response["errors"].append(
                {'resource_id': "Resource ID must be provided"})
    else:
        response["errors"].append(
            {'resource_id': "Missing form args; resource_id"})

    return response


def image_description_validation(key, image_description, image_name):
    """
    Inputs: Image description (From the image description provided by the client ) & Image Name (From the image uploaded)

    Output: validation response & status code
    """

    # Init errors object

    errors = []

    # Check that an image description is provided by the client
    if image_description == "":
        errors.append(
            {f"{key}_description": "Valid image description must be provided"})

    # Check that an image is available
    if image_name == "":
        errors.append({key: "Image uploaded must have a name"})

    # Check that the image name has a file extension
    elif "." not in image_name.filename:
        errors.append({key: "Upload a valid image file"})

    # Check that the file extension on the image name is available in the list of supported extensions
    #
    elif (image_name.filename.rsplit(".", 1)[1]).upper() not in IMAGE_EXTENSIONS:
        errors.append({
            key: f"Upload an image with a valid extension. Supported extensions: {IMAGE_EXTENSIONS}"})

    return errors


def image_size_validation(file_size):

    # Init errors object

    errors = {}

    if int(file_size) >= IMAGE_SIZE:

        errors['status'] = 400
        errors['description'] = "Satellite image exceeds the file size limit"

    return errors
