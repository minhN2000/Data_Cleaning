import openai

from django.shortcuts import render
from django.http import JsonResponse
from django.contrib.auth.models import User
from django.views.generic import TemplateView
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.hashers import make_password
from django.contrib.auth import get_user_model, authenticate, login

from rest_framework.permissions import AllowAny
from rest_framework import views, response, permissions, status
from rest_framework.decorators import api_view, permission_classes

openai.api_key = 'YOU API KEY HERE'
your_model = 'SORRY I CANNOT SHARE MY MODEL YET'

@csrf_exempt
def get_response(request):
    if request.method == "POST":
        user_message = request.POST.get("user_message")
        csv_file = request.FILES.get("file", None)

        # # check malware in .csv file
        if csv_file:
            print('check malware')
            if validate_csv_file(csv_file, 'virustotal'):
                return JsonResponse({"error": "Uploaded file contains a virus"})
            # Reload pointer
            csv_file.seek(0)

        # Check if the file has been processed
        prev_file_name = request.session.get("prev_file_name", None)
        
        if csv_file is None and prev_file_name is not None:
            print('dang hoat dong')
            empty_message_buffer(request) 
            
        # If a new file with a different name is uploaded, reset the file_processed flag
        if csv_file and (prev_file_name is None or csv_file.name != prev_file_name):
            print('dang hoat dong')
            request.session["prev_file_name"] = csv_file.name
            empty_message_buffer(request) # empty message buffer

        # validate user message
        valid, user_message = validate_user_message(user_message)
        if not valid:
            return JsonResponse({"answer": user_message}) 
            
        # Call OpenAI API to get the answer
        answer = get_chatbot_response(request, csv_file, user_message)
        
        # add current conversation to message buffer
        update_message_buffer(request, user_message, answer) 

        return JsonResponse({"answer": answer})
    else:
        return JsonResponse({"error": "Invalid request method"})
    
# Sign up view
class UserRegistrationView(views.APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')

        if not email or not password:
            return response.Response({'error': 'Email and password are required'}, status=status.HTTP_400_BAD_REQUEST)

        if User.objects.filter(username=email).exists():
            return response.Response({'error': 'A user with this email already exists.'}, status=status.HTTP_400_BAD_REQUEST)

        hashed_password = make_password(password)
        user = User.objects.create(username=email, email=email, password=hashed_password)
        user.is_active = False
        user.save()

        return response.Response(status=status.HTTP_201_CREATED)
    
    def get(self, request, *args, **kwargs):
        return TemplateView.as_view(template_name='index.html')(request, *args, **kwargs)


# Sign in view
@api_view(['GET', 'POST'])
@permission_classes([AllowAny])
def user_login_view(request):
    if request.method == 'GET':
        # Serve the React app's main HTML file
        return render(request, 'index.html')
    else:
        email = request.data.get('email')
        password = request.data.get('password')
        user_instance = User.objects.get(username=email)
    
        if not email or not password:
            return response.Response({'error': 'Email and password are required'}, status=status.HTTP_400_BAD_REQUEST)

        user = authenticate(request, username=email, password=password)
        if user_instance is not None:
            login(request, user_instance)
            return response.Response({'status': 'success', 'message': 'User logged in successfully', 'token':email}, status=status.HTTP_200_OK)
        else:
            return response.Response({'status': 'error', 'message': 'Invalid email or password'}, status=status.HTTP_400_BAD_REQUEST)