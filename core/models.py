from django.db import models
from django.core.validators import EmailValidator
from django.contrib.auth.hashers import make_password, check_password
import requests


class UserManager(models.Manager):
    def user_validation(self, post_data):
        errors = {}

        first_name = post_data.get("first_name", "").strip()
        last_name = post_data.get("last_name", "").strip()
        email = post_data.get("email", "").strip()
        password = post_data.get("password", "")
        confirm_password = post_data.get("confirm_password", "")

        if not first_name:
            errors["first_name"] = "First name is required"
        if not last_name:
            errors["last_name"] = "Last name is required"
        if not email:
            errors["email"] = "Email is required"
        if not password:
            errors["password"] = "Password is required"

        if email and self.filter(email=email).exists():
            errors["email"] = "Email already registered"

        try:
            EmailValidator()(email)
        except:
            errors["email"] = "Invalid email format"

        if password != confirm_password:
            errors["confirm_password"] = "Passwords do not match"

        if password and len(password) < 6:
            errors["password"] = "Password must be at least 6 characters"

        return errors

    def validate_login(self, data):
        errors = {}
        email = data.get("email", "").strip()
        password = data.get("password", "")

        if not email:
            errors["email"] = "Email is required"
        if not password:
            errors["password"] = "Password is required"

        if errors:
            return errors

        try:
            user = self.get(email=email)
        except User.DoesNotExist:
            errors["login"] = "Invalid credentials"
            return errors

        if not check_password(password, user.password):
            errors["login"] = "Invalid credentials"
            return errors

        return {"user": user}

    def create_user(self, data):
        return self.create(
            first_name=data.get("first_name", "").strip(),
            last_name=data.get("last_name", "").strip(),
            email=data.get("email", "").strip(),
            password=make_password(data.get("password", "")),
        )


class User(models.Model):
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=255)
    number_of_games = models.IntegerField(default=0)
    number_of_wins = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    objects = UserManager()


class Room(models.Model):
    code = models.CharField(max_length=6, unique=True, db_index=True)
    player1 = models.ForeignKey(
        User,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="rooms_created",
    )
    player2 = models.ForeignKey(
        User,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="rooms_joined",
    )
    word = models.CharField(
        max_length=5, null=True, blank=True
    )  
    status = models.CharField(
        max_length=10,
        choices=[
            ("waiting", "Waiting"),
            ("playing", "Playing"),
            ("finished", "Finished"),
        ],
        default="waiting",
    )
    game_state = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if not self.word:
            try:
                response = requests.get(
                    "https://random-word-api.herokuapp.com/word?length=5", timeout=5
                )
                if response.status_code == 200:
                    word_list = response.json()
                    if word_list and len(word_list) > 0:
                        self.word = word_list[0].upper()
            except:
                self.word = "WORLD"

        super().save(*args, **kwargs)
