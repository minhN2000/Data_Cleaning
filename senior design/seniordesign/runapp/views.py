import json
import openai
import pandas as pd
from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from validation import validate_csv_file, validate_user_message

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