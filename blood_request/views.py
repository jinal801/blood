from django.contrib.auth.mixins import LoginRequiredMixin
from django.http.response import JsonResponse
from django.shortcuts import render
from django.views.generic.edit import CreateView

from blood_request.forms import BloodRequestCreateForm
from blood_request.models import BloodRequest
from users.models import User


# Create your views here.
class ADDRequestView(LoginRequiredMixin, CreateView):
    template_name = 'add_request.html'
    form_class = BloodRequestCreateForm
    model = BloodRequest


def getDonors(request):
    blood_group_value = request.GET.get("term")
    donors = User.objects.filter(blood_group=blood_group_value)
    donors = [donor.get_filter_name() for donor in donors]
    response_data = {
        "donors": donors
    }
    return JsonResponse(response_data)