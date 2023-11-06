"""
This file contains common functions that is/can be used in all over app
"""
import datetime

from celery import shared_task
from django.conf import settings
from django.contrib.auth import get_user_model

from blood_request.models import BloodRequest
from users.custom_email import send_email_html

User = get_user_model()


@shared_task
def send_mail_to_donor(request_id: int, subject: str,
                                  text_body: str, email_template: str):
    """
    This function used to send mail to resource manager that contains the
    new created request details
    """
    request_obj = BloodRequest.objects.get(id=request_id)
    data_dict = {
        'receiver_name': request_obj.receiver,
        'site_url': settings.SITE_URL,
        'current_time': str(datetime.datetime.now()),
    }

    users_list = []

    try:
        blood_donor_email = request_obj.donor.email
        users_list.append(blood_donor_email)
    except AttributeError:
        pass

    send_email_html(subject=subject,
                    text_body=text_body,
                    email_template=email_template,
                    from_email=settings.EMAIL_HOST,
                    to_list=users_list,
                    data_dict=data_dict)