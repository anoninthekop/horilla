import requests
import uuid
from django.db import models
from django.core.exceptions import ValidationError
from django.utils.translation import gettext_lazy as _
from base.models import Company
from employee.models import Employee
from horilla.models import HorillaModel


def validate_schedule_time_format(value):
    """
    this method is used to validate the format of duration like fields.
    """
    if len(value) > 6:
        raise ValidationError(_("Invalid format, it should be HH:MM format"))
    try:
        hour, minute = value.split(":")
        hour = int(hour)
        minute = int(minute)
        if len(str(hour)) > 3 or minute not in range(60):
            raise ValidationError(_("Invalid time"))
        if hour == 0 and minute == 0:
            raise ValidationError(_("Both hour and minute cannot be zero"))
    except ValueError as error:
        raise ValidationError(_("Invalid format, it should be HH:MM format")) from error


class BiometricDevices(HorillaModel):
    BIO_DEVICE_TYPE = [
        ("zk", _("ZKTeco Biometric")),
        ("anviz", _("Anviz Biometric")),
    ]
    id = models.UUIDField(default=uuid.uuid4, primary_key=True, editable=False)
    name = models.CharField(max_length=100)
    machine_type = models.CharField(
        max_length=18,
        choices=BIO_DEVICE_TYPE,
        null=True,
    )
    machine_ip = models.CharField(max_length=15, null=True, blank=True, default="")
    port = models.IntegerField(null=True, blank=True)
    api_url = models.CharField(max_length=200, null=True, blank=True)
    api_key = models.CharField(max_length=100, null=True, blank=True)
    api_secret = models.CharField(max_length=100, null=True, blank=True)
    api_token = models.CharField(max_length=500, null=True, blank=True)
    api_expires = models.CharField(max_length=100, null=True, blank=True)
    is_live = models.BooleanField(default=False)
    is_scheduler = models.BooleanField(default=False)
    scheduler_duration = models.CharField(
        null=True,
        default="00:00",
        max_length=10,
        validators=[validate_schedule_time_format],
    )
    last_fetch_date = models.DateField(null=True, blank=True)
    last_fetch_time = models.TimeField(null=True, blank=True)
    company_id = models.ForeignKey(
        Company, null=True, editable=False, on_delete=models.PROTECT
    )

    objects = models.Manager()

    def __str__(self):
        return f"{self.name} - {self.get_machine_type_display()}"

    def clean(self, *args, **kwargs):
        super().clean(*args, **kwargs)
        if self.machine_type == "zk":
            if not self.machine_ip:
                raise ValidationError(
                    {"machine_ip": _("The Machine IP is required for ZKTeco Biometric")}
                )
            if not self.port:
                raise ValidationError(
                    {"port": _("The Port No is required for ZKTeco Biometric")}
                )
        if self.machine_type == "anviz":
            if not self.api_url:
                raise ValidationError(
                    {"api_url": _("The API Url required for Anviz Biometric Device")}
                )
            if not self.api_key:
                raise ValidationError(
                    {"api_key": _("The API Key required for Anviz Biometric Device")}
                )
            if not self.api_secret:
                raise ValidationError(
                    {
                        "api_secret": _(
                            "The API Secret is required for Anviz Biometric Device"
                        )
                    }
                )
            if self.api_key and self.api_secret:
                payload = {
                    "header": {
                        "nameSpace": "authorize.token",
                        "nameAction": "token",
                        "version": "1.0",
                        "requestId": "f1becc28-ad01-b5b2-7cef-392eb1526f39",
                        "timestamp": "2022-10-21T07:39:07+00:00",
                    },
                    "payload": {"api_key": self.api_key, "api_secret": self.api_secret},
                }
                error = {
                    "header": {"nameSpace": "System", "name": "Exception"},
                    "payload": {"type": "AUTH_ERROR", "message": "AUTH_ERROR"},
                }
                try:
                    response = requests.post(
                        self.api_url,
                        json=payload,
                    )
                    if response.status_code != 200:
                        raise ValidationError(
                            {f"API call failed with status code {response.status_code}"}
                        )

                    api_response = response.json()
                    if api_response == error:
                        raise ValidationError(
                            {
                                "api_url": _(
                                    "Authentication failed. Please check your API Url , API Key and API Secret."
                                )
                            }
                        )
                    else:
                        payload = api_response["payload"]
                        api_token = payload["token"]
                        api_expires = payload["expires"]
                        self.api_token = api_token
                        self.api_expires = api_expires
                except Exception as e:
                    raise ValidationError(
                        {
                            "api_url": _(
                                "Authentication failed. Please check your API Url , API Key and API Secret."
                            )
                        }
                    )

    class Meta:
        verbose_name = _("Biometric Device")
        verbose_name_plural = _("Biometric Devices")


class BiometricEmployees(models.Model):
    id = models.UUIDField(default=uuid.uuid4, primary_key=True, editable=False)
    uid = models.IntegerField()
    user_id = models.CharField(max_length=100)
    employee_id = models.ForeignKey(Employee, on_delete=models.DO_NOTHING)
    objects = models.Manager()

    def __str__(self):
        return f"{self.employee_id} - {self.user_id}"

    class Meta:
        verbose_name = _("Employee in Biometric Device")
        verbose_name_plural = _("Employees in Biometric Device")
