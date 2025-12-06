from django.db import models
from django.core.validators import EmailValidator
from django.core.exceptions import ValidationError
from django.contrib.auth.hashers import make_password, check_password
from django.core.files.storage import default_storage
class UserManager(models.Manager):

    def user_validation(self,post_data):
        errors = {}

        first_name = post_data.get('first_name', '').strip()
        last_name = post_data.get('last_name', '').strip()
        email = post_data.get('email', '').strip()
        password = post_data.get('password', '')
        confirm_password = post_data.get('confirm_password', '')

        # Required fields
        if not first_name:
            errors['first_name'] = "First name is required"
        if not last_name:
            errors['last_name'] = "Last name is required"
        if not email:
            errors['email'] = "Email is required"
        if not password:
            errors['password'] = "Password is required"

        # Email already exists
        if email and self.filter(email=email).exists():
            errors['email'] = "Email already registered"

        # Email format
        try:
            EmailValidator()(email)
        except:
            errors['email'] = "Invalid email format"

        # Password match
        if password != confirm_password:
            errors['confirm_password'] = "Passwords do not match"

        # Password length
        if password and len(password) < 6:
            errors['password'] = "Password must be at least 6 characters"

        return errors
    
    def validate_login(self, data):
        errors = {}
        email = data.get('email', '').strip()
        password = data.get('password', '')

        # Required fields
        if not email:
            errors['email'] = "Email is required"
        if not password:
            errors['password'] = "Password is required"

        if errors:
            return errors

        # Check if user exists
        try:
            user = self.get(email=email)
        except:
            errors['login'] = "Invalid credentials"
            return errors

        # Check password
        if not check_password(password, user.password):
            errors['login'] = "Invalid credentials"
            return errors

        return {"user": user}  

class User(models.Model):
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=255)
    number_of_games=models.IntegerField(default=0)
    number_of_wins=models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at=models.DateTimeField(auto_now=True)
    objects=UserManager()
    


class Word(models.Model):
    word =models.CharField(max_length=5)



class Room(models.Model):
    code = models.CharField(max_length=6, unique=True, db_index=True)
    player1 = models.ForeignKey(User, null=True, blank=True, on_delete=models.SET_NULL, related_name="rooms_created")
    player2 = models.ForeignKey(User, null=True, blank=True, on_delete=models.SET_NULL, related_name="rooms_joined")
    status = models.CharField(
        max_length=10,
        choices=[("waiting", "Waiting"), ("playing", "Playing"), ("finished", "Finished")],
        default="waiting"
    )
    game_state = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    
