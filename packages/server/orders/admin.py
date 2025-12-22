from django.contrib import admin
from .models import Order, OrderItem

class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = ('product_name', 'quantity', 'price', 'size', 'color')

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('reference', 'full_name', 'amount', 'status', 'created_at')
    search_fields = ('reference', 'full_name', 'email')
    list_filter = ('status', 'created_at')
    inlines = [OrderItemInline]
    readonly_fields = ('reference', 'amount', 'created_at')
