"""
URL configuration for blood_donation project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.contrib.auth import views as auth_views

from users.views import LoginView, LogoutView, ResetPasswordView, ForgotPasswordView, ResetConfirmView

urlpatterns = [
    path("admin/", admin.site.urls),
    path("", include('users.urls')),
    path("blood_request_value/", include('blood_request.urls')),

    # Reset password
    path('password-reset/<int:pk>/', ResetPasswordView.as_view(), name='password_reset'),
    #  Forget Password
    path('password-forgot/', ForgotPasswordView.as_view(), name='password_forgot'),
    path('password-reset/done/',
         auth_views.PasswordResetDoneView.as_view(
             template_name='password/password_reset_done.html'
         ),
         name='password_reset_done'),
    path('password-reset-confirm/<uidb64>/<token>/',
         ResetConfirmView.as_view(
             template_name='password/password_reset_confirm.html'
         ),
         name='password_reset_confirm'),
    path('password-reset-complete/',
         auth_views.PasswordResetCompleteView.as_view(
             template_name='password/password_reset_complete.html'
         ),
         name='password_reset_complete'),
    path('', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
]
