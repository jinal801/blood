from django.urls import path

from users.views import DashboardView, SignUpView, get_cities_list_from_country

app_name = 'users'

urlpatterns = [
    path('dashboard/', DashboardView.as_view(), name="dashboard"),
    path('signup/', SignUpView.as_view(), name='signup'),
    path('cities/', get_cities_list_from_country,
         name='cities_from_country'),
]