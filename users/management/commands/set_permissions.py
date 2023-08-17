from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group, Permission
from django.core.management.base import BaseCommand

from users.constants import PERMISSIONS_DICT, PERMISSIONS_SET_SUCCESS, \
    GROUP_PERMISSION_INIT, USER_PERMISSION_INIT

User = get_user_model()


class Command(BaseCommand):
    """class for user create and update custom command.
    command:python manage.py set_permissions."""
    help = 'set users permissions'

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS('*' * 30))
        self.stdout.write(self.style.SUCCESS(GROUP_PERMISSION_INIT))
        # create groups for all the user type
        group_list = [Group.objects.get_or_create(name=u_type[0])[0] for u_type
                      in User.UserType.choices]
        users_qs = User.objects.all()
        self.stdout.write(self.style.SUCCESS(USER_PERMISSION_INIT))
        for grp in group_list:
            # clear group permissions
            grp.permissions.clear()
            # set group permissions by group
            [grp.permissions.add(Permission.objects.get(codename=per_id)) for
             per_id in PERMISSIONS_DICT.get(grp.name) or list()]

            # set permissions user-wise for existing users
            users = users_qs.filter(user_type=grp.name)
            for user in users:
                # set user  to the group
                grp.user_set.add(user)
                # set permissions as per user group
                user.user_permissions.add(*grp.permissions.all())
        self.stdout.write(self.style.SUCCESS(PERMISSIONS_SET_SUCCESS))
        self.stdout.write(self.style.SUCCESS('*' * 30))