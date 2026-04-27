import os
from tavily import TavilyClient
from dotenv import load_dotenv

load_dotenv()

client = TavilyClient(api_key = os.getenv("TAVILY_API_KEY"))

def search(query:str)->str:
    result = client.search(query,max_results=3)
    output = []
    for r in result["results"]: #  Tavily returns a dict — the actual results are under the "results" key  
        output.append(f"source: {r['url']} \n{r['content']}")
    return "\n\n".join(output)