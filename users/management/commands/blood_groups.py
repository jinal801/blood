from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group, Permission
from django.core.management.base import BaseCommand

from blood_request.models import BloodGroup
from users.constants import PERMISSIONS_DICT, PERMISSIONS_SET_SUCCESS, \
    GROUP_PERMISSION_INIT, USER_PERMISSION_INIT

User = get_user_model()

BLOOD_GROUP = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-']


class Command(BaseCommand):
    """class for user create and update custom command.
    command:python manage.py blood_groups."""
    help = 'set users permissions'

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS('*' * 30))
        for blood_grp in BLOOD_GROUP:
            # clear group permissions
            blood_group, is_created = BloodGroup.objects.get_or_create(name=blood_grp)
        self.stdout.write(self.style.SUCCESS('Blood Groups created successfully'))
        self.stdout.write(self.style.SUCCESS('*' * 30))