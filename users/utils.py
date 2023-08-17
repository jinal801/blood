from django.contrib import messages


def message_display_func(user_request, message_perm, error=None):
    django_messages = []
    if not error:
        messages.success(user_request, message_perm)
    else:
        messages.error(user_request, message_perm)
    for message in messages.get_messages(user_request):
        django_messages.append({
            "level": message.level,
            "message": message.message,
            "extra_tags": message.tags,
        })
    return django_messages