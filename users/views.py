from http import HTTPStatus

from cities_light.models import City
from django.contrib import messages
from django.contrib.auth import get_user_model
from django.contrib.auth.forms import PasswordResetForm
from django.contrib.auth.mixins import LoginRequiredMixin
from django.contrib.auth.models import Group
from django.contrib.auth.views import LoginView, LogoutView, PasswordResetView, PasswordChangeView, \
    PasswordResetConfirmView, INTERNAL_RESET_SESSION_TOKEN
from django.contrib.messages.views import SuccessMessageMixin
from django.core.exceptions import ImproperlyConfigured
from django.http.response import HttpResponseRedirect, JsonResponse
from django.shortcuts import render, resolve_url, redirect
from django.urls import reverse_lazy, reverse
from django.utils.decorators import method_decorator
from django.views.decorators.cache import never_cache
from django.views.decorators.debug import sensitive_post_parameters
from django.views.generic import CreateView
from django.views.generic.base import TemplateView, View

from blood_donation import settings
from users.forms import SignUpForm, UserLoginForm, PasswordChangeForm, CustomResetConfirmViewForm
from users.utils import message_display_func


# Create your views here.
class DashboardView(LoginRequiredMixin, TemplateView):
    template_name = 'Dashboard.html'


class LoginView(SuccessMessageMixin, LoginView):
    template_name = 'login.html'
    authentication_form = UserLoginForm
    success_message = 'Login Successfully'
    redirect_authenticated_user = True

    def get_default_redirect_url(self):
        """Return the default redirect URL."""
        return resolve_url(self.next_page or settings.LOGIN_REDIRECT_URL)


class LogoutView(LoginRequiredMixin, LogoutView):
    """Logout View"""


# Sign Up View
class SignUpView(CreateView):
    form_class = SignUpForm
    success_url = reverse_lazy('login')
    template_name = 'signin.html'

    def form_valid(self, form):
        """
        This method will be used for validating forms.
        """
        context = self.get_context_data()
        form = context['form']
        # resource data validation as form at time of creating user object
        user = form.save()
        user_group = Group.objects.get(
            name__icontains=self.request.POST.get('user_type'))
        user.groups.add(user_group)
        user.user_permissions.set(user_group.permissions.all())
        user.save()
        user = {
            'id': user.id, 'email': user.email,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'password': user.password,
            'confirm_password': user.password,
            'user_type': user.user_type,
        }
        django_messages = message_display_func(self.request, "Register successfully")
        data = {
            "status": "success",
            "user": user,
            "messages": django_messages,
            'redirect_url': reverse_lazy('users:dashboard'),
        }
        return JsonResponse(data, status=201)

    def form_invalid(self, form):
        data = {
            "status": "error",
            "errors": dict(form.errors)
        }
        return JsonResponse(data, status=HTTPStatus.BAD_REQUEST)


class ForgotPasswordView(SuccessMessageMixin, PasswordResetView, TemplateView,
                         View):
    """class for password forgot."""
    extra_email_context = {
        "site_url": settings.SITE_URL
    }
    template_name = 'password/password_forgot.html'
    html_email_template_name = 'emails/password_reset_email.html',
    subject_template_name = 'emails/password_reset_subject'
    success_url = reverse_lazy('password_reset_done')
    form_class = PasswordResetForm
    site_url = settings.SITE_URL

    def form_valid(self, form):
        """form valid method, check that email address is exists or not."""
        if self.request.method == "POST":
            user_email = self.request.POST.get('email')
            registered_email = get_user_model().objects.filter(
                email=user_email)
            if not registered_email.exists():
                messages.error(self.request, "Email Invalid Messages")
                return redirect('password_forgot')
            messages.success(self.request, "Link send success fully,Please check your inbox.")
        return super().form_valid(form)


class ResetPasswordView(SuccessMessageMixin, PasswordChangeView):
    """class for password reset."""
    template_name = 'password/password_reset.html'
    success_url = reverse_lazy('logout')
    site_url = settings.SITE_URL
    form_class = PasswordChangeForm
    success_message = "Password changed successfully"


class ResetConfirmView(SuccessMessageMixin, PasswordResetConfirmView):
    form_class = CustomResetConfirmViewForm
    success_message = "Password changed successfully"

    @method_decorator(sensitive_post_parameters())
    @method_decorator(never_cache)
    def dispatch(self, *args, **kwargs):
        self.user = self.get_user(kwargs["uidb64"])
        if self.user != self.request.user and not self.request.user.is_anonymous:
            messages.error(self.request,
                           "other user's password can't change")
            return HttpResponseRedirect(
                reverse('users:dashboard'))
        if "uidb64" not in kwargs or "token" not in kwargs:
            raise ImproperlyConfigured(
                "The URL path must contain 'uidb64' and 'token' parameters."
            )

        self.validlink = False
        self.user = self.get_user(kwargs["uidb64"])

        if self.user == self.request.user:
            messages.error(self.request,
                           "user reset password error")
            return HttpResponseRedirect(
                reverse('users:dashboard'))

        if self.user is not None:
            token = kwargs["token"]
            if token == self.reset_url_token:
                session_token = self.request.session.get(
                    INTERNAL_RESET_SESSION_TOKEN)
                if self.token_generator.check_token(self.user, session_token):
                    # If the token is valid, display the password reset form.
                    self.validlink = True
                    return super().dispatch(*args, **kwargs)
            elif self.token_generator.check_token(self.user, token):
                # Store the token in the session and redirect to the
                # password reset form at a URL without the token. That
                # avoids the possibility of leaking the token in the
                # HTTP Referer header.
                self.request.session[INTERNAL_RESET_SESSION_TOKEN] = token
                redirect_url = self.request.path.replace(
                    token, self.reset_url_token
                )
                return HttpResponseRedirect(redirect_url)
        messages.error(self.request, "Link is not valid")
        return HttpResponseRedirect(
            reverse('users:dashboard'))


def get_cities_list_from_country(request):
    """
    This function used to get all cities name after user select country
    """
    if request.method == 'GET' and request.GET.get('country'):
        cities = City.objects.filter(country__name=request.GET.get('country'))
        data = [("", "Select")] + list(cities.values_list('name', 'name'))
        return JsonResponse({'cities': data})
    return JsonResponse({'cities': [("", "Select")]})