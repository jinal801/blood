"""filter for client"""
from datetime import datetime, timedelta

import django_filters
from django.db.models import Q, QuerySet, Value
from django.db.models.functions import Concat
from django_filters import FilterSet

from blood_request.forms import BloodRequestFilterForm


class BloodRequestFilter(FilterSet):
    request_status = django_filters.ChoiceFilter(field_name="request_status", lookup_expr="icontains")
    search = django_filters.CharFilter(method='search_filter', label="Search")

    class Meta(BloodRequestFilterForm.Meta):
        pass

    def get_form_class(self):
        return BloodRequestFilterForm

    @staticmethod
    def search_filter(queryset: QuerySet, name: str, value: str) -> QuerySet:
        """
        method for search filter
        """

        return queryset.filter(
            Q(donor__username__icontains=value)
            | Q(request_status__icontains=value)
        )