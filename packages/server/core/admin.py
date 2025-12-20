from django.contrib import admin
from .models import Announcement

@admin.register(Announcement)
class AnnouncementAdmin(admin.ModelAdmin):
    list_display = ('text', 'is_active', 'order', 'created_at')
    list_editable = ('is_active', 'order')
    search_fields = ('text',)
    list_filter = ('is_active',)
