from django.contrib import admin
from .models import ForumQuestion,ForumAnswer

admin.site.register(ForumQuestion)
admin.site.register(ForumAnswer)

