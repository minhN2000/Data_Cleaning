import time
import pyclamd
import requests

def validate_user_message(user_message):
    from textblob import TextBlob
    # the message should be not empty
    if len(user_message) == 0 or user_message.isspace():
        return (False, 'Please provide a valid message')
    
    # The message should not violate community standard
    blob = TextBlob(user_message)
    sentiment_polarity = blob.sentiment.polarity

    if sentiment_polarity < 0:
        return (False, 'The message is violate community standard!')

    return (True, user_message)


def validate_csv_file(file, type='pyclam'):
    if type == 'pylcam':
        return __is_file_infected(file)
    else:
        return __is_file_malicious(file)
    
def __is_file_infected(file):
    try:
        cd = pyclamd.ClamdUnixSocket()
        scan_result = cd.scan_stream(file.read())
        file.seek(0)  # Reset the file pointer to the beginning after reading
        
        if scan_result is None:
            return False
        
        status = list(scan_result.values())[0][0]
        return status == "FOUND"
    
    except Exception as e:
        print(f"Error scanning file with ClamAV: {e}")
        return False
    
def __is_file_malicious(file):
    API_KEY = 'Your virustotal apikey here'
    url = f'https://www.virustotal.com/api/v3/files'
    headers = {
        "x-apikey": API_KEY
    }

    # Reset the file pointer to the beginning of the file
    file.seek(0)

    response = requests.post(url, headers=headers, files={"file": file})

    if response.status_code != 200:
        raise Exception(f"Error uploading file to VirusTotal: {response.text}")

    data = response.json()
    scan_id = data["data"]["id"]

    # Wait for the scan to complete (may take several minutes)
    while True:
        response = requests.get(f'https://www.virustotal.com/api/v3/analyses/{scan_id}', headers=headers)
        if response.status_code != 200:
            raise Exception(f"Error getting analysis from VirusTotal: {response.text}")

        data = response.json()
        status = data["data"]["attributes"]["status"]

        if status == "completed":
            break
        elif status == "queued" or status == "running":
            time.sleep(10)
        else:
            raise Exception(f"Unexpected analysis status: {status}")

    malicious_detections = data["data"]["attributes"]["stats"]["malicious"]
    print(f'total malware: {malicious_detections}')
    return malicious_detections > 0