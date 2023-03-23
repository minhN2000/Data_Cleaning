import json
import openai
import pandas as pd
from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .utils import is_file_infected

openai.api_key = 'YOU API KEY HERE'
your_model = 'SORRY I CANNOT SHARE MY MODEL YET'

@csrf_exempt
def get_response(request):
    if request.method == "POST":
        user_message = request.POST.get("user_message")
        csv_file = request.FILES.get("file", None)

        # check malware in .csv file
        if csv_file:
            if is_file_infected(csv_file):
                return JsonResponse({"error": "Uploaded file contains a virus"})
            else:
                print('processsing csv')
                df = pd.read_csv(csv_file)
                columns_name = ', '.join(df.columns)
                first_observation = f'My data {csv_file} has these columns: {columns_name} \n'
                user_message = f"{first_observation}{user_message}"
                
        
        # Call OpenAI API to get the answer

        response = openai.Completion.create(
            model=your_model,
            messages=[
                {"role": "user", "content": f"{user_message}"},
             ]
        )
        
        answer = response['choices'][0]['message']['content']
        
        # Send the answer back to the frontend
        return JsonResponse({"answer": answer})
    else:
        return JsonResponse({"error": "Invalid request method"})
    