import cv2
from PIL import Image
from skimage.metrics import structural_similarity as compare_ssim
import os


def crop_input_image(input_image):
    """
    desc: crops the input image to the standard input format (3072, 2048) i.e. 6X4, 512px X 512px
    params: input_image
    output: saves cropped image to project_id, resource_id directory
    """

    input_image = Image.open(input_image)

    width, height = input_image.size

    std_width = 512*6
    std_height = 512*4

    if width > std_width and height > std_height:

        left = (width - std_width)/2
        top = (height - std_height)/2
        right = (width + std_width)/2
        bottom = (height + std_height)/2

        # Crop the center of the image
        cropped_img = input_image.crop((left, top, right, bottom))
    else:
        cropped_img = input_image

    return cropped_img


def crop(input_file):
    """
    desc: define the bounding boxes for the output images
    params: cropped image

    """

    height = 512
    width = 512

    img = Image.open(input_file)
    img_width, img_height = img.size
    for i in range(img_height//height):
        for j in range(img_width//width):
            box = (j*width, i*height, (j+1)*width, (i+1)*height)
            yield img.crop(box)


def splitting_algorithm(IMAGE_PATH, IMAGE_GRID_PATH, infile, key):
    """
    desc: split the input image by the defined bounding boxes
    params: input image directory, output directory, start number?
    output: 6X4, 512px X 512px images
    """

    height = 512
    width = 512

    IMAGE_PATH = os.path.join(IMAGE_PATH, infile)
    file_num = 0

    for k, piece in enumerate(crop(IMAGE_PATH)):
        img = Image.new('RGB', (height, width), 255)
        img.paste(piece)

        img_path = os.path.join(IMAGE_GRID_PATH, key, str(k) + '.png')
        img.save(img_path)

        file_num += 1


def extract_image_diff_outputs(IMAGE_1_PATH, IMAGE_2_PATH, image1, image2):

    image1 = cv2.imread(os.path.join(IMAGE_1_PATH, image1))
    image2 = cv2.imread(os.path.join(IMAGE_2_PATH, image2))

    # compute difference
    difference = cv2.subtract(image1, image2)

    # color the mask red
    Conv_hsv_Gray = cv2.cvtColor(difference, cv2.COLOR_BGR2GRAY)
    ret, mask = cv2.threshold(Conv_hsv_Gray, 0, 255,
                              cv2.THRESH_BINARY_INV | cv2.THRESH_OTSU)
    difference[mask != 255] = [0, 0, 255]

    # add the mask to the images to make the differences obvious
    image1[mask != 255] = [46, 134, 193]
    image2[mask != 255] = [203, 67, 53]

    return image1, image2, difference


def get_image_diff_percentage(IMAGE_1_PATH, IMAGE_2_PATH, image1, image2):

    i1 = Image.open(os.path.join(IMAGE_1_PATH, image1))
    i2 = Image.open(os.path.join(IMAGE_2_PATH, image2))
    assert i1.mode == i2.mode, "Different kinds of images."
    assert i1.size == i2.size, "Different sizes."

    pairs = zip(i1.getdata(), i2.getdata())
    if len(i1.getbands()) == 1:
        # for gray-scale jpegs
        dif = sum(abs(p1-p2) for p1, p2 in pairs)
    else:
        dif = sum(abs(c1-c2) for p1, p2 in pairs for c1, c2 in zip(p1, p2))

    ncomponents = i1.size[0] * i1.size[1] * 3

    image_diff_percentage = (dif / 255.0 * 100) / ncomponents

    return image_diff_percentage
