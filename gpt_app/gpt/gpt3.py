import json
import os
import pathlib
import uuid

import openai
import pandas as pd

#source: https://github.com/shreyashankar/gpt3-sandbox/blob/master/api/gpt.py

INIT_TEMP = 0.3
INIT_TOKEN = 1000


def setOpenai(key):
  openai.api_key = key


class Example:
  """Stores an input, output pair and formats it to prime the model."""

  def __init__(self, inp, out):
    self.input = inp
    self.output = out
    self.id = uuid.uuid4().hex

  def get_input(self):
    """Returns the input of the example."""
    return self.input

  def get_output(self):
    """Returns the intended output of the example."""
    return self.output

  def get_id(self):
    """Returns the unique ID of the example."""
    return self.id

  def as_dict(self):
    return {
        "input": self.get_input(),
        "output": self.get_output(),
        "id": self.get_id(),
    }


class GPT:
  """The main class for a user to interface with the OpenAI API.
    A user can add examples and set parameters of the API request.
    """

  def __init__(self,
               engine='code-davinci-002',
               temperature=INIT_TEMP,
               max_tokens=INIT_TOKEN,
               input_prefix="input: ",
               input_suffix="\n",
               output_prefix="output: ",
               output_suffix="\n",
               append_output_prefix_to_query=True):
    self.examples = {}
    self.engine = engine
    self.temperature = temperature
    self.max_tokens = max_tokens
    self.input_prefix = input_prefix
    self.input_suffix = input_suffix
    self.output_prefix = output_prefix
    self.output_suffix = output_suffix
    self.append_output_prefix_to_query = append_output_prefix_to_query
    self.stop = (output_suffix + input_prefix).strip()

  def add_example(self, ex):
    """Adds an example to the object.
        Example must be an instance of the Example class.
        """
    assert isinstance(ex, Example), "Please create an Example object."
    self.examples[ex.get_id()] = ex

  def delete_example(self, id):
    """Delete example with the specific id."""
    if id in self.examples:
      del self.examples[id]

  def get_example(self, id):
    """Get a single example."""
    return self.examples.get(id, None)

  def get_all_examples(self):
    """Returns all examples as a list of dicts."""
    return {k: v.as_dict() for k, v in self.examples.items()}

  def get_prime_text(self):
    """Formats all examples to prime the model."""
    return "".join([self.format_example(ex) for ex in self.examples.values()])

  def get_engine(self):
    """Returns the engine specified for the API."""
    return self.engine

  def get_temperature(self):
    """Returns the temperature specified for the API."""
    return self.temperature

  def get_max_tokens(self):
    """Returns the max tokens specified for the API."""
    return self.max_tokens

  def craft_query(self, prompt):
    """Creates the query for the API request."""
    q = self.get_prime_text() + self.input_prefix + prompt + self.input_suffix
    if self.append_output_prefix_to_query:
      q = q + self.output_prefix

    return q

  def submit_request(self, prompt):
    """Calls the OpenAI API with the specified parameters."""
    response = openai.Completion.create(model=self.get_engine(),
                                        prompt=self.craft_query(prompt),
                                        max_tokens=self.get_max_tokens(),
                                        temperature=self.get_temperature(),
                                        top_p=1,
                                        n=1,
                                        stream=False,
                                        stop=self.stop)
    return response

  def get_top_reply(self, prompt):
    """Obtains the best result as returned by the API."""
    response = self.submit_request(prompt)
    return response['choices'][0]['text']

  def format_example(self, ex):
    """Formats the input, output pair."""
    return self.input_prefix + ex.get_input(
    ) + self.input_suffix + self.output_prefix + ex.get_output(
    ) + self.output_suffix


class GPTRunning:

  def __init__(self, filePath):
    self.gpt = GPT()
    self.filePath = filePath
    self.count = 0
    #self.addExample()
    self.code = ""

  def getFile(self):
    return self.filePath

  def columns(self):
    df = pd.read_csv(self.filePath)
    return list(df.columns)

  def addExample(self):
    filePrompt = 'create DataFrame df for "' + str(self.filePath) + '" file \n'
    output = "pd.read_csv(" + str(self.filePath) + ")\n"
    self.gpt.add_example(Example(filePrompt, output))

  def getCode(self, prompt):
    finalPrompt = ""
    if self.count == 0:
      columnsPromt = 'Table "' + str(self.filePath) + '", columns = ' + str(
          self.columns())
      initPrompt = '''
            Using Python Pandas
            Using Python Matplotlib
            '''
      filePrompt = 'Create DataFrame df for "' + str(self.filePath) + '" file'
      cleanDataPromt = '''
            Drops null features
            Drop null records
            '''
      finalPrompt = columnsPromt + initPrompt + filePrompt + prompt

    else:
      finalPrompt = prompt
    self.code = self.gpt.submit_request(finalPrompt)
    idx = self.code['choices'][0]['text'].find("\'\'\'")
    if idx == -1:
      idx = self.code['choices'][0]['text'].find("\"\"\"")
    parsingCode = self.code['choices'][0]['text'][idx + 3:]
    parsingCode = {'code': str(parsingCode)}
    print(type(parsingCode))
    parsingCode = json.dumps(parsingCode)
    self.code = json.loads(parsingCode)
    return self.code

  def getOutput(self):
    if self.count == 0:
      path = pathlib.Path().resolve()
      for filename in os.listdir(path):
        if filename.endswith(".png") or filename.endswith(".html"):
          os.remove(os.path.join(path, filename))
      file = open(os.path.join(path, "runGPTCode.py"), 'w')
      file.write(self.code['code'])
      file.close()
      exec(open(os.path.join(path, "runGPTCode.py")).read())
      #import runGPTCode as GPTCode
      #GPTCode.main()
    else:
      file = open(os.path.join(path, "runGPTCode.py"), 'w')
      file.write(self.code['code'])
      file.close()
      exec(open(os.path.join(path, "runGPTCode.py")).read())
