# Create your models here.
from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils.translation import gettext_lazy as _

ADMIN_TEXT = "Admin"
ADMIN_KEY = "admin"
DONOR_TEXT = "Blood Donor"
DONOR_KEY = "blood_donor"
RECEIVER_TEXT = "Blood Receiver"
RECEIVER_KEY = "blood_receiver"
HOSPITAL_TEXT = "Hospital"
HOSPITAL_KEY = "hospital"
A_POSITIVE_TEXT = "A+"
A_POSITIVE_KEY = "a+"
B_POSITIVE_TEXT = "B+"
B_POSITIVE_KEY = "b+"
AB_POSITIVE_TEXT = "AB+"
AB_POSITIVE_KEY = "ab+"
O_POSITIVE_TEXT = "O+"
O_POSITIVE_KEY = "o+"
A_NEGATIVE_TEXT = "A-"
A_NEGATIVE_KEY = "a-"
B_NEGATIVE_TEXT = "B-"
B_NEGATIVE_KEY = "b-"
AB_NEGATIVE_TEXT = "AB-"
AB_NEGATIVE_KEY = "ab-"
O_NEGATIVE_TEXT = "O-"
O_NEGATIVE_KEY = "o-"


class User(AbstractUser):

    class UserType(models.TextChoices):
        """
        This class provides choice of user that which type of user it is
        example: Admin, Donor, Receiver
        """

        ADMIN = ADMIN_KEY, _(ADMIN_TEXT)
        DONOR = DONOR_KEY, _(DONOR_TEXT)
        RECEIVER = RECEIVER_KEY, _(RECEIVER_TEXT)
        HOSPITAL = HOSPITAL_KEY, _(HOSPITAL_TEXT)

        # this field used to define type of user like admin, donor, receiver, hospital
    class BloodGroupStatus(models.TextChoices):
        """
        This class provides choices for the blood group.
        example: A+, A-, B+, B-, AB+, AB-, O+, O-
        """
        A_POSITIVE = A_POSITIVE_KEY, _(A_POSITIVE_TEXT)
        A_NEGATIVE = A_NEGATIVE_KEY, _(A_NEGATIVE_TEXT)
        B_POSITIVE = B_POSITIVE_KEY, _(B_POSITIVE_TEXT)
        B_NEGATIVE = B_NEGATIVE_KEY, _(B_NEGATIVE_TEXT)
        AB_POSITIVE = AB_POSITIVE_KEY, _(AB_POSITIVE_TEXT)
        AB_NEGATIVE = AB_NEGATIVE_KEY, _(AB_NEGATIVE_TEXT)
        O_POSITIVE = O_POSITIVE_KEY, _(O_POSITIVE_TEXT)
        O_NEGATIVE = O_NEGATIVE_KEY, _(O_NEGATIVE_TEXT)

    user_type = models.CharField(
        max_length=16, choices=UserType.choices, default=UserType.RECEIVER, null=False
    )
    blood_group = models.CharField(max_length=10, choices=BloodGroupStatus.choices,
                                   null=True, blank=True)
    mobile_number = models.CharField(max_length=10, null=True, blank=True)

    def is_admin(self):
        """return true if user is admin."""
        return self.user_type == self.UserType.ADMIN

    def is_donor(self):
        """return true if user is donor."""
        return self.user_type == self.UserType.DONOR

    def is_receiver(self):
        """return true if user is receiver."""
        return self.user_type == self.UserType.RECEIVER

    def is_hospital(self):
        """return true if use is hospital."""
        return self.user_type == self.UserType.HOSPITAL

    @classmethod
    def donors_filters(cls):
        return [("", "Select")] + sorted([
            (donor.id, donor.get_full_name())
            for donor in
            list(cls.objects.filter(user_type=User.UserType.DONOR))],
            key=lambda tup: tup[1])

    @classmethod
    def hospitals_filters(cls):
        return [("", "Select")] + sorted([
            (hospital.id, hospital.username)
            for hospital in
            list(cls.objects.filter(user_type=User.UserType.HOSPITAL))],
            key=lambda tup: tup[1])

    @classmethod
    def blood_groups_filters(cls):
        return [("", "Select")] + [(blood_group, blood_group) for blood_group in sorted(list(
            set(cls.objects.values_list('blood_group', flat=True).exclude(
                blood_group=None))))]

    def get_filter_name(self):
        """get the user's full name with the email."""
        return f"{self.get_full_name()}({self.email})"