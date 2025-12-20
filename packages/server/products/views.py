from rest_framework import viewsets, parsers, permissions
from .models import Product
from .serializers import ProductSerializer

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all().order_by('-created_at')
    serializer_class = ProductSerializer
    parser_classes = (parsers.MultiPartParser, parsers.FormParser)
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

from .models import ProductImage
from .serializers import ProductImageSerializer

class ProductImageViewSet(viewsets.ModelViewSet):
    queryset = ProductImage.objects.all()
    serializer_class = ProductImageSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
