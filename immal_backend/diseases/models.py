from django.db import models

class Disease(models.Model):
    name=models.CharField(max_length=100,unique=True)
    description=models.TextField()
    symptoms=models.TextField()
    treatments=models.TextField()
    image=models.ImageField(upload_to="disease_images/",null=True,blank=True)
    
    def __str__(self):
        return self.name