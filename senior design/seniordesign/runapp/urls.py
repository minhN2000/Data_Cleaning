from django.urls import path
from . import views

urlpatterns = [
    path('get_response/', views.get_response, name="get_response"),
    path('reset_prev_file_name/', views.reset_prev_file_name, name="reset_prev_file_name"),
    path('login/', views.user_login_view, name='user-login'),
    path('signup/', views.UserRegistrationView.as_view(), name='signup'),
]