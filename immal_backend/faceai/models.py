from django.db import models
from django.conf import settings

class EmotionLog(models.Model):
    EMOTIONS = [
        ('happy', 'Happy'),
        ('sad', 'Sad'),
        ('angry', 'Angry'),
        ('neutral', 'Neutral'),
        ('surprised', 'Surprised'),
        ('disgusted', 'Disgusted'),
        ('fearful', 'Fearful'),
    ]

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    emotion = models.CharField(max_length=20, choices=EMOTIONS)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.emotion} - {self.timestamp.date()}"
