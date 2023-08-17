from django.urls import path

from blood_request.views import ADDRequestView, getDonors

app_name = 'blood_request'

urlpatterns = [
    path('add_request/', ADDRequestView.as_view(), name="add_request"),
    path('add_request/get_donors/', getDonors, name="get_donors"),
]