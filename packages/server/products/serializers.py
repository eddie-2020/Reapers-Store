from rest_framework import serializers
from .models import Product, ProductImage

class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ['id', 'image']

class ProductSerializer(serializers.ModelSerializer):
    images = ProductImageSerializer(many=True, read_only=True)
    uploaded_images = serializers.ListField(
        child=serializers.ImageField(max_length=1000000, allow_empty_file=False, use_url=False),
        write_only=True,
        required=False,
        help_text="Upload multiple images"
    )
    
    # Allow passing JSON arrays or lists
    color = serializers.JSONField(required=False)
    size = serializers.JSONField(required=False)

    class Meta:
        model = Product
        fields = ['id', 'name', 'description', 'price', 'images', 'uploaded_images', 'category', 'color', 'size', 'created_at']

    def to_internal_value(self, data):
        # Transform QueryDict to a standard dict to handle JSON parsing reliably.
        # We must explicitly handle list fields like 'uploaded_images' that depend on getlist().
        mutable_data = {}
        
        # Copy standard fields (takes last value from QueryDict)
        for key, value in data.items():
            mutable_data[key] = value

        # Handle uploaded_images specifically if data is a QueryDict
        if hasattr(data, 'getlist'):
            images = data.getlist('uploaded_images')
            if images:
                mutable_data['uploaded_images'] = images

        import json
        for field in ['color', 'size']:
            if field in mutable_data and isinstance(mutable_data[field], str):
                try:
                    mutable_data[field] = json.loads(mutable_data[field])
                except json.JSONDecodeError:
                    pass  # Let validation fail naturally
        
        return super().to_internal_value(mutable_data)

    def create(self, validated_data):
        uploaded_images = validated_data.pop('uploaded_images', [])
        product = Product.objects.create(**validated_data)
        
        for image in uploaded_images:
            ProductImage.objects.create(product=product, image=image)
            
        return product
    
    def update(self, instance, validated_data):
        uploaded_images = validated_data.pop('uploaded_images', [])
        
        # Update standard fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        
        if uploaded_images:
            # Just add the new images (user can delete specific ones via specific API endpoint)
            for image in uploaded_images:
                ProductImage.objects.create(product=instance, image=image)
            
        return instance
