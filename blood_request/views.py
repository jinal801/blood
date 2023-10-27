from django.contrib.auth.mixins import LoginRequiredMixin
from django.db.models.query import QuerySet
from django.http.response import JsonResponse, HttpResponseRedirect
from django.urls import reverse
from django.views.generic import TemplateView
from django.views.generic.edit import CreateView
from django.views.generic.list import ListView

from blood_request.filters import BloodRequestFilter
from blood_request.forms import BloodRequestCreateForm
from blood_request.models import BloodRequest
from users.models import User


# Create your views here.
class ADDRequestView(LoginRequiredMixin, CreateView):
    template_name = 'add_request.html'
    form_class = BloodRequestCreateForm
    model = BloodRequest

    def get_success_url(self):  # new
        return reverse('users:dashboard')

    def form_valid(self, form):
        self.object = form.save(commit=False)
        self.object.receiver_id = self.request.user.id
        self.object.request_status = BloodRequest.RequestStatus.PENDING
        self.object.save()
        return HttpResponseRedirect(self.get_success_url())


class AvailableDonorsMapViews(TemplateView):
    template_name = "available_donors_map.html"


def getDonors(request):
    blood_group_value = request.GET.get("blood_group_value")
    donors = User.objects.filter(blood_group=blood_group_value, user_type=User.UserType.DONOR)
    donors = [(donor.username, donor.id) for donor in donors]
    response_data = {
        "donors": donors
    }
    return JsonResponse(response_data)


def DonorsListMapViews(request):
    """
    get available donors
    """
    available_donors = User.objects.filter(user_type=User.UserType.DONOR)
    from geopy.geocoders import Nominatim
    geolocator = Nominatim(user_agent='users')
    county_city_list = [country for country in available_donors.values_list('city', 'country').exclude(city=None, country=None)]
    county_city_list_ids = [id for id in available_donors.values_list('id').exclude(city=None, country=None)]
    loc_list = [geolocator.geocode(i[0] + ',' + i[1]) for i in county_city_list]
    points = [(loc.latitude, loc.longitude) for loc in loc_list]
    geo_json = [{
                'type': 'Feature',
                'geometry': {
                    'type': 'Point',
                    'coordinates': [lon[1], lon[0]]
                },
                'properties': {
                    'title': 'Mapbox SF'
                },
                } for lon in points]
    response = {
        "available_donors_points": geo_json,
        "cities": county_city_list
    }
    return JsonResponse(response)


class BloodRequestListView(ListView):
    """class for blood requests list."""
    model = BloodRequest
    template_name = 'blood_requests_list.html'
    paginate_by = 2
    ordering = ["-created"]

    def get_queryset(self, **kwargs) -> QuerySet:
        queryset = self.model.objects.all()
        if self.request.user.user_type == User.UserType.DONOR:
            queryset = queryset.filter(donor=self.request.user)
        queryset_filter = BloodRequestFilter(data=self.request.GET,
                                             request=self.request,
                                             queryset=queryset)
        self.filter_form = queryset_filter.form
        order_by = self.request.GET.get("order_by", "-created")
        return queryset_filter.qs.order_by(order_by)

    def get_paginate_by(self, queryset):
        """
        Get the number of items to paginate by, or ``None`` for no pagination.
        """
        self.paginate_by = self.request.GET.get('paginate_by',
                                                self.paginate_by)
        return self.paginate_by

    # pass dictionary of form objects of all users into the template
    # with user.id as key and form object as its value
    def get_context_data(self, *args, object_list=None, **kwargs) -> dict:
        context = super().get_context_data(*args, **kwargs)
        context["blood_request_filter"] = self.filter_form
        return context
