from django.contrib.auth.mixins import LoginRequiredMixin
from django.db.models.query import QuerySet
from django.http.response import JsonResponse, HttpResponseRedirect
from django.shortcuts import render
from django.urls import reverse
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


def getDonors(request):
    blood_group_value = request.GET.get("blood_group_value")
    donors = User.objects.filter(blood_group=blood_group_value, user_type=User.UserType.DONOR)
    donors = [(donor.username, donor.id) for donor in donors]
    response_data = {
        "donors": donors
    }
    return JsonResponse(response_data)


class BloodRequestListView(ListView):
    """class for blood requests list."""
    model = BloodRequest
    template_name = 'blood_requests_list.html'
    paginate_by = 2
    ordering = ["-created"]

    def get_queryset(self, **kwargs) -> QuerySet:
        queryset_filter = BloodRequestFilter(data=self.request.GET,
                                             request=self.request)
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
