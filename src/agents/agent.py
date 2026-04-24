import os 
import anthropic
from dotenv import load_dotenv

load_dotenv() # whats this?

client = anthropic.Anthropic(api_key= os.getenv("ANTHROPIC_API_KEY")) # client object

def run_agent(message:str) -> str:
    response = client.messages.create(
        model = "claude-sonnet-4-6",
        max_tokens = 1024,
        system = " You are VaultAI, a personal financial copilot. You help users understand their finances, plan for taxes, and make smart investment decisions.",
        messages = [{"role" : "user", "content" : message}],
    )
    return response.content[0].text

 # client.messages.count_tokens(...) 
 # # Upload a file (PDFs, images, etc.)   -> client.files.upload(...) 

 