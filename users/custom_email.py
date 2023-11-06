"""
This file used to send mail after taking arguments as data
"""
import datetime
import logging

from django.conf import settings
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string

from users.constants import MAIL_SEND_MESSAGE

logger = logging.getLogger(__name__)


def send_email_html(subject: str, text_body: str, email_template: str,
                    from_email: str, to_list: list,
                    data_dict: dict = None):
    """function for custom email html, if you want to send mail to the
     multiple user's then send list of the user's mail id.
     example:custom_email.send_email_html('subject','emails/custom_email_template.html',
     'admin@gmail.com',['ABC@trootech.com','JKS@trootech.com'])"""
    data_dict.update({
        "site_url": settings.SITE_URL,
        'current_time': str(datetime.datetime.now()),
    })
    html_body = render_to_string(email_template, data_dict)
    text_body = render_to_string(text_body, data_dict)
    message = EmailMultiAlternatives(
        subject=subject,
        from_email=from_email,
        to=to_list,
        body=text_body,
    )
    message.attach_alternative(html_body, "text/html")
    if data_dict.get('filename'):
        message.attach(data_dict['filename'], data_dict['file_data'])
    message.send(fail_silently=False)
    logger.info(MAIL_SEND_MESSAGE.format(subject, to_list))
