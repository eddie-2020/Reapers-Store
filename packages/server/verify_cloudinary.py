
import os
import django
from django.conf import settings
from django.core.files.base import ContentFile

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.base')
django.setup()

from products.models import Product, ProductImage

def test_upload():
    print(f"DJANGO VERSION: {django.get_version()}")
    print(f"DEFAULT_FILE_STORAGE: {getattr(settings, 'DEFAULT_FILE_STORAGE', 'Not Set')}")
    print(f"STORAGES: {getattr(settings, 'STORAGES', 'Not Set')}")
    print(f"CLOUDINARY CONFIG: {settings.CLOUDINARY_STORAGE}")

    # Create dummy product
    p = Product.objects.create(
        name="Cloudinary Test Product",
        description="Testing upload",
        price=10.00,
        category="Test"
    )

    # Create dummy image content
    img_content = b'\x47\x49\x46\x38\x39\x61\x01\x00\x01\x00\x80\x00\x00\x05\x04\x04\x00\x00\x00\x2c\x00\x00\x00\x00\x01\x00\x01\x00\x00\x02\x02\x44\x01\x00\x3b'
    img_file = ContentFile(img_content, name='test_cloud.gif')

    # Create ProductImage
    pi = ProductImage.objects.create(product=p, image=img_file)

    print(f"\n--- Result ---")
    print(f"Image Name (DB value): {pi.image.name}")
    print(f"Image URL (Computed): {pi.image.url}")

    if "cloudinary.com" in pi.image.url:
        print("\nSUCCESS: Image is serving from Cloudinary.")
    else:
        print("\nFAILURE: Image seems to be local.")

if __name__ == "__main__":
    test_upload()
