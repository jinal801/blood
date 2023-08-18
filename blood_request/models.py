from auditlog.registry import auditlog
from django.db import models
from django.db.models.deletion import CASCADE
from django_extensions.db.models import ActivatorModel, TimeStampedModel
from django.contrib.auth import get_user_model
from django.utils.translation import gettext_lazy as _

User = get_user_model()

ACCEPTED_TEXT = "Accept"
ACCEPTED_KEY = "accept"
REJECTED_TEXT = "Reject"
REJECTED_KEY = "reject"
PENDING_TEXT = "Pending"
PENDING_KEY = "pending"


# Create your models here
class BloodRequest(TimeStampedModel, ActivatorModel):
    """blood request model"""

    class RequestStatus(models.TextChoices):
        """
        This class provides choice of user that which type of user it is
        example: Admin, Donor, Receiver
        """

        ACCEPTED = ACCEPTED_KEY, _(ACCEPTED_TEXT)
        REJECTED = REJECTED_KEY, _(REJECTED_TEXT)
        PENDING = PENDING_KEY, _(PENDING_TEXT)

    receiver = models.ForeignKey(User,  on_delete=CASCADE, related_name='blood_requester')
    donor = models.ForeignKey(User, on_delete=CASCADE, related_name='blood_donor')
    hospital = models.ForeignKey(User, on_delete=CASCADE, related_name='hospital')
    units = models.CharField(max_length=15)
    request_status = models.CharField(max_length=15, choices=RequestStatus.choices)
    mobile_number = models.CharField(max_length=10, null=True, blank=True)

    def __str__(self):
        return self.receiver.username


auditlog.register(BloodRequest)