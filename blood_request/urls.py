from django.urls import path

from blood_request.views import ADDRequestView, getDonors, BloodRequestListView, AvailableDonorsMapViews, \
    DonorsListMapViews

app_name = 'blood_request'

urlpatterns = [
    path('add_request/', ADDRequestView.as_view(), name="add_request"),
    path('blood_requests_list/', BloodRequestListView.as_view(), name="blood_requests_list"),
    path('add_request/get_donors/', getDonors, name="get_donors"),
    path('available_donors/', AvailableDonorsMapViews.as_view(), name="available_donors"),
    path('donors/', DonorsListMapViews, name="donors")
]