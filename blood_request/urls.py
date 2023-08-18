from django.urls import path

from blood_request.views import ADDRequestView, getDonors, BloodRequestListView

app_name = 'blood_request'

urlpatterns = [
    path('add_request/', ADDRequestView.as_view(), name="add_request"),
    path('blood_requests_list/', BloodRequestListView.as_view(), name="blood_requests_list"),
    path('add_request/get_donors/', getDonors, name="get_donors"),
]