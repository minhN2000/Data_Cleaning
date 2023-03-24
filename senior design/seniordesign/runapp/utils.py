import pyclamd
import pandas as pd
def is_file_infected(file):
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

def validate_data(csv_file):
    return