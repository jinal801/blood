from django import forms
from django.forms.models import ModelForm

from blood_request.models import BloodRequest
from users.models import User


class BloodRequestCreateForm(ModelForm):
    units = forms.CharField(widget=forms.TextInput(attrs={'placeholder': 'Units'}))
    blood_group_value = forms.ChoiceField()

    class Meta:
        model = BloodRequest
        fields = ('donor', 'units', 'hospital', 'blood_group_value', )
        exclude = ('receiver', 'request_status')

    def __init__(self, *args, **kwargs):
        super(BloodRequestCreateForm, self).__init__(*args, **kwargs)
        self.fields["donor"].choices = User.donors_filters()
        self.fields["hospital"].choices = User.hospitals_filters()
        self.fields['blood_group_value'].choices = User.blood_groups_filters()


class BloodRequestFilterForm(forms.ModelForm):
    search = forms.CharField(required=False)

    class Meta:
        model = BloodRequest
        fields = [
            "request_status",
        ]

    def __init__(self, *args, **kwargs):
        super(BloodRequestFilterForm, self).__init__(*args, **kwargs)
        # self.fields["first_name"].choices = User.first_name_filters()
        # self.fields["last_name"].choices = User.last_name_filters()
        self.fields["request_status"].choices = [("",
                                                  "Select")] + BloodRequest.RequestStatus.choices
