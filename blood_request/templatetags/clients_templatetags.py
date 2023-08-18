from django import template
from urllib.parse import urlencode
from collections import OrderedDict

register = template.Library()


@register.simple_tag
def url_add_query(request, **kwargs) -> str:
    """
    adds to the GET
    """
    updated = request.GET.copy()
    for key, value in kwargs.items():
        updated[key] = value

    return updated.urlencode()


@register.simple_tag
def url_replace(request, field, value, direction="") -> str:
    """
    to replace the url to alter the order of sorting
    """
    dict_ = request.GET.copy()

    if field == "order_by" and field in dict_.keys():
        if dict_[field].startswith("-") and dict_[field].lstrip("-") == value:
            dict_[field] = value
        elif dict_[field].lstrip("-") == value:
            dict_[field] = "-" + value
        else:
            dict_[field] = direction + value
    else:
        dict_[field] = direction + value

    return urlencode(OrderedDict(sorted(dict_.items())))


@register.filter
def check_field(values):
    """This custom tag check that if any filter applied than add show class in
    collapse."""
    values.pop('search', None)
    values.pop('page', None)
    values.pop('order_by', None)
    if any(values.values()):
        return True
    return False


@register.filter(name="check_permission")
def check_permission(user, permission):
    """This custom tag check that permission exists or not."""
    if user.user_permissions.filter(codename=permission).exists():
        return True
    return False