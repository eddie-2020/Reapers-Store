from .base import *

DEBUG = False

ALLOWED_HOSTS = os.environ.get(
    "ALLOWED_HOSTS", ".onrender.com"
).split(",")