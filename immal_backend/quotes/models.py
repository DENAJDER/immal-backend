from django.db import models

class Quote(models.Model):
    text=models.TextField()
    holy_book=models.CharField(max_length=255)
    verse=models.CharField(max_length=255)

    def __str__(self):
        return self.holy_book+' '+ self.verse

