from django.urls import path
from .views import test_api, send_emails

urlpatterns = [
    path('test/', test_api),
    path('send-emails/', send_emails),
]