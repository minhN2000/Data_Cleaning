from django.db import models

# Create your models here.
from django.contrib.auth.models import AbstractUser, Group, Permission

class User(AbstractUser):
    groups = models.ManyToManyField(Group, related_name="runapp_user_set", blank=True)
    user_permissions = models.ManyToManyField(Permission, related_name="runapp_user_set", blank=True)