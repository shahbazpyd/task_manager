from django.db import models

# Create your models here.
class Task(models.Model):
    CHOICES = [
        ('pending', 'Pending'),
        ('deleted', 'Deleted'),
        ('completed', 'Completed'),
    ]

    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=CHOICES, default='pending')

    def __str__(self):
        return self.title