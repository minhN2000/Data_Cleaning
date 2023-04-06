
# Senior Design - **None** Team

## Contact Information

**Name:** Minh T C Nguyen

**UC mail:** Nguye3mt@mail.uc.edu

## Instruction
Clone the repository to your local machine:

git clone [https://github.com/minhN2000/Senior-Design.git](https://github.com/minhN2000/Senior-Design.git)
Create and activate a virtual environment: 
```bash
python -m venv env
source env/bin/activate
```

### Frontend
1. Navigate to the `seniordesign/frontend` directory in your terminal.
2.  Install all the necessary packages using `npm install`
3.  You can try to run the frontend by `npm run start`
### Backend
1. Navigate to the `seniordesign/seniordesign` directory in your terminal.
2. Install all the required packages using pip:
	```bash
	pip install requirements.txt
	```
3. Open `seniordesign/runapp/bot_response.py` and fill out the **OpenAPI** key  and  select your own models for summary, code, and chat. You can follow the data examples in `seniordesign/fine_tuning.py` to fine-tune your own model.
4. Run the server using the following command (if you want to run it on your local machine):
	```bash
	pip install requirements.txt
	```
	**NOTE:** You need to `npm run build` every time you update the frontend since the backend listens to the `build/static`
5. else, if you want to build an Azure app, you can use my `.github/workflows` directory as a template to deploy your app.

That's it! You should now be able to use the Senior Design Github repository. If you have any question, please contact me by the above contact information. Thanks!
