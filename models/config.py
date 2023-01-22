# PATH Configuration Files
import os
# Local
ROOT_DIR = os.path.dirname(os.path.abspath(__file__))
IMAGE_DIR = os.path.join(ROOT_DIR, "static", "satellite_images")
IMAGE_EXTENSIONS = ["JPEG", "JPG", "PNG", "GIF"]
IMAGE_SIZE = 0.5 * 1024 * 1024
