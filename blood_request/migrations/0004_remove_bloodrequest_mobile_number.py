# Generated by Django 4.2.4 on 2023-11-03 05:18

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ("blood_request", "0003_remove_bloodrequest_blood_group"),
    ]

    operations = [
        migrations.RemoveField(
            model_name="bloodrequest",
            name="mobile_number",
        ),
    ]