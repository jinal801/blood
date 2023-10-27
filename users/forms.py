from django import forms
from django.contrib.auth import get_user_model, password_validation
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm, PasswordChangeForm, SetPasswordForm
from django.core.exceptions import ValidationError
from django.forms import ModelForm, CharField, PasswordInput, ChoiceField
from django.utils.translation import gettext_lazy as _
from cities_light.models import City, Country

User = get_user_model()


# Sign Up Form
class SignUpForm(UserCreationForm):
    first_name = forms.CharField(max_length=30, required=False, help_text='Optional',
                                 widget=forms.TextInput(attrs={'placeholder': 'First Name'}))
    last_name = forms.CharField(max_length=30, required=False, help_text='Optional',
                                widget=forms.TextInput(attrs={'placeholder': 'Last Name'}))
    email = forms.EmailField(max_length=254, help_text='Enter a valid email address',
                             widget=forms.TextInput(attrs={'placeholder': 'Email'}))
    password1 = forms.CharField(label='Password', widget=forms.PasswordInput(attrs={'placeholder': 'Password'}))
    password2 = forms.CharField(label='Confirm Password', widget=forms.PasswordInput(attrs={'placeholder': 'Confirm Password'}))
    country = ChoiceField()
    city = ChoiceField()

    class Meta:
        model = User
        fields = [
            'username',
            'first_name',
            'last_name',
            'email',
            'password1',
            'password2',
            'user_type',
            'blood_group',
            'country',
            'city',
            ]
        widgets = {
            'username': forms.TextInput(attrs={'placeholder': 'UserName'}),
            'country': forms.TextInput(attrs={'placeholder': 'Country'}),
            'city': forms.TextInput(attrs={'placeholder': 'City'}),
        }

    def __init__(self, *args, **kwargs):
        super(SignUpForm, self).__init__(*args, **kwargs)
        self.fields["blood_group"].choices = [("", "Select")] + list(
            User.BloodGroupStatus.choices)
        self.fields["country"].choices = [("", "Select")] + list(
            Country.objects.values_list('name', 'name'))
        self.fields["city"].choices = [("", "Select")] + list(
            City.objects.values_list('name', 'name'))

    def save(self, commit=True):
        """
        this function used to save user's instance with making password in hash
         format,and it is also assign email to username
        """
        # Save the provided password in hashed format
        user = super().save(commit=False)
        user.set_password(self.cleaned_data["password1"])
        user.raw_password = self.cleaned_data["password1"]
        user.username = self.cleaned_data['email'].lower()
        user.email = self.cleaned_data['email'].lower()
        if commit:
            user.save()
        return user


class UserLoginForm(AuthenticationForm):
    """form for the user login."""

    username = forms.CharField()

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.error_messages.update({
            "invalid_login": 'Invalid Login'
        })

    def clean_username(self):
        """validate username."""
        return self.cleaned_data['username'].lower()


class PasswordChangeForm(PasswordChangeForm):
    def clean_new_password2(self):
        password1 = self.cleaned_data.get("new_password1")
        password2 = self.cleaned_data.get("new_password2")
        old_password = self.cleaned_data.get("old_password")
        if password1 and password2:
            if password1 != password2:
                raise ValidationError(
                    self.error_messages["password_mismatch"],
                    code="password_mismatch",
                )
            elif old_password and (password1 == old_password):
                self.add_error("new_password2", "same password please")
        password_validation.validate_password(password2, self.user)
        return password2


class ResetPasswordForm(ModelForm):
    """
    This form is used to validate old password
    validate new and confirm password
    if above both validations passed then it will set new password
    """
    password1 = CharField(label='Password', widget=PasswordInput(attrs={'placeholder': 'Password'}))
    confirm_password = CharField(label='Confirm Password',
                                 widget=PasswordInput(attrs={'placeholder': 'Confirm Password'}))
    old_password = CharField(label='Old Password', widget=PasswordInput(attrs={'placeholder': 'Old Password'}))

    class Meta:
        """
        this is META class for password reset form
        """
        model = User
        fields = ('confirm_password',
                  'old_password',
                  'password1',)
        widgets = {
            "confirm_password": forms.TextInput(
                attrs={
                    "placeholder": "Enter Confirm Password",
                }
            ),
            "old_password": forms.TextInput(
                attrs={
                    "placeholder": "Enter Old Password",
                }
            ),
            "password1": forms.TextInput(
                attrs={
                    "placeholder": "Enter New Password",
                }
            ),
        }

    def clean_password1(self):
        """
        this function used for validating user's password
        """
        password = self.cleaned_data.get("password1")
        confirm_password = self.data.get("confirm_password")
        if password and confirm_password:
            if password != confirm_password:
                # raise error
                self.add_error('confirm_password', "Confrim passworkd")
        # check validations for password
        # error = validate_password(password)
        # if error:
        #     self.add_error('confirm_password', error)
        return password

    def clean_old_password(self):
        """
        this function used for validating user's old password
        """
        old_password = self.data.get("old_password")
        new_password = self.data.get("password1")
        if old_password == new_password:
            self.add_error('password1', "same please")
        if old_password and not self.instance.check_password(old_password):
            self.add_error('old_password', "old not match with new")
        else:
            return old_password

    def save(self, commit=True):
        """
        this function used to save user's password
        """
        # Save the provided password in hashed format
        self.instance.set_password(self.cleaned_data["password1"])
        self.instance.raw_password = self.cleaned_data["password1"]
        self.instance.save()


class CustomResetConfirmViewForm(SetPasswordForm):
    new_password1 = forms.CharField(widget=forms.PasswordInput(attrs={'placeholder': 'New Password'}))
    error_messages = {
        "password_mismatch": _("Password does not match."),
    }
    new_password2 = forms.CharField(
        label=_("Confirm Password"),
        strip=False,
        widget=forms.PasswordInput(attrs={"autocomplete": "new-password", 'placeholder': 'Confirm New Password'}),
    )
