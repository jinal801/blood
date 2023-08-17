from django.urls import path

from users.views import DashboardView, SignUpView

app_name = 'users'

urlpatterns = [
    path('dashboard/', DashboardView.as_view(), name="dashboard"),
    path('signup/', SignUpView.as_view(), name='signup'),
]