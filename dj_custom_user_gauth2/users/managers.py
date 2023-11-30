from django.utils.translation import gettext_lazy as _
from django.contrib.auth.base_user import BaseUserManager


class CustomUserManager(BaseUserManager):
    def create_user(self , email , password , sso_enabled , **extra_fields):
        if(not email):
            raise ValueError(_("The Email Must Be Set"))
        email=self.normalize_email(email)
        user=self.model(email=email , **extra_fields)
        if(sso_enabled):
            print('Setting No-Password')
            user.set_unusable_password()
        else:
            print('Setting Password')
            user.set_password(password)
        user.save()
        return user
    
    def create_superuser(self, email, password, **extra_fields):
        """
        Create and save a SuperUser with the given email and password.
        """
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        extra_fields.setdefault("is_active", True)

        if extra_fields.get("is_staff") is not True:
            raise ValueError(_("Superuser must have condition as is_staff=True."))
        if extra_fields.get("is_superuser") is not True:
            raise ValueError(_("Superuser must have condition as is_superuser=True."))
        return self.create_user(email, password, **extra_fields)
    
    def set_unusable_password(self, email , **extra_fields):
        user=self.model(email=email , **extra_fields)
        user.set_unusable_password()
        return user.password
    
    def create_user_v2(self , email , password , sso_enabled ,sso_type , firstname , lastname ,  **extra_fields):
        if(not email):
            raise ValueError(_("The Email Must Be Set"))
        email=self.normalize_email(email)
        sso_enabled=bool(int(sso_enabled))
        user=self.model(email=email , sso_enabled= sso_enabled , sso_type=sso_type , firstname=firstname , lastname=lastname ,  **extra_fields)
        if(sso_enabled):
            print('Setting No-Password as sso enabled')
            user.set_unusable_password()
        else:
            print('Setting Password from create_userv2 as credentials based approach')
            user.set_password(password)
        user.save()
        return user