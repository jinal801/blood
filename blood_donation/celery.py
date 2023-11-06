import os
from celery import Celery

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "blood_donation.settings")
app = Celery("django_celery")
app.config_from_object("django.conf:settings", namespace="CELERY")
app.autodiscover_tasks()
app.conf.beat_scheduler = 'django_celery_beat.schedulers:DatabaseScheduler'