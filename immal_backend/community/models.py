from django.db import models
from django.conf import settings

CATEGORY_CHOICES = [
    ('Diabetes', 'Diabetes'),
    ('Cancer', 'Cancer'),
    ('Mental Health', 'Mental Health'),
    ('Heart Disease', 'Heart Disease'),
    ('Asthma', 'Asthma'),
]

class ForumQuestion(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,  # ✅ Allow anonymous
        blank=True  # ✅ Allow blank in admin forms
    )
    title = models.CharField(max_length=255)
    body = models.TextField()
    category = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)
    
def __str__(self):
    username = self.user.username if self.user else "Anonymous"
    return f"{username}'s question: {self.title}"


class ForumAnswer(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True)
    question = models.ForeignKey(ForumQuestion, related_name='answers', on_delete=models.CASCADE)
    body = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

def __str__(self):
        username = self.user.username if self.user else "Anonymous"
        return f"{username}'s answer to {self.question.title}"
