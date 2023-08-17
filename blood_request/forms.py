from django import forms
from django.forms.models import ModelForm

from blood_request.models import BloodRequest
from users.models import User


class BloodRequestCreateForm(ModelForm):
    units = forms.CharField(widget=forms.TextInput(attrs={'placeholder': 'Units'}))
    mobile_number = forms.CharField(widget=forms.TextInput(attrs={'placeholder': 'Mobile No.'}), required=False)
    blood_group_value = forms.ChoiceField()

    class Meta:
        model = BloodRequest
        fields = ('donor', 'units', 'mobile_number', 'hospital', 'blood_group_value', )
        exclude = ('receiver', 'request_status')

    def __init__(self, *args, **kwargs):
        super(BloodRequestCreateForm, self).__init__(*args, **kwargs)
        self.fields["donor"].choices = User.donors_filters()
        self.fields["hospital"].choices = User.hospitals_filters()
        self.fields['blood_group_value'].choices = User.blood_groups_filters()


