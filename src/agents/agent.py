import os 
import anthropic
from dotenv import load_dotenv
from src.tools.forecaster import forecast
from src.tools.search import search 
from src.memory.store import (                                                                                                                                                                                 
      saveLifeEvent,                                                                                                                                                                                             
      getLifeEvent,                                                                                                                                                                                             
      saveConversationTurn,                                                                                                                                                                                      
      getRecentHistory,                                                                                                                                                                                          
      recallSimilar,
  )
from src.api.session import csvSession

load_dotenv() 

client = anthropic.Anthropic(api_key= os.getenv("ANTHROPIC_API_KEY")) # client object

tools =[
    {
        "name" : "search",
        "description" : (
            "USE WHEN : user asks about live financial data — current tax codes, IRS limits, "                                                                                   
              "interest rates, Fed funds rate, T-Bill yields, recent financial news. "
            "DO NOT USE WHEN :  question can be answered from the uploaded CSV or from general finacial knowledge from the chat memory"
        ),
        "input_schema" : {
            "type" : "object",
            "properties" : { "query" : {"type": "string"} },
            "required" : ["query"]
        }
    },

    {
        "name" : "forecast",
        "description" : (
            "USE WHEN : user provides a CSV or asks about their spending, income, budget, or cash flow predictions.  "
            "The CSV is pre-loaded from their upload. "
            "DO NOT USE WHEN :  no CSV has been uploaded this session"
        ),
        "input_schema" : {
            "type" : "object",
            "properties" : { "csv_text" : {"type": "string"} },
            "required" : []
        }
    },

    {           
        "name": "saveLifeEvent",
        "description": (                                                                                                                                                                                       
            "USE WHEN: user mentions a personal life change — having a baby, getting married, "
            "buying a house, changing jobs, retiring. "                                                                                                                                                        
            "DO NOT USE WHEN: user is asking a question or discussing finances without mentioning a life change."                                                                                              
          ),                                                                                                                                                                                                     
        "input_schema": {                                                                                                                                                                                      
            "type": "object",                                                                                                                                                                                  
            "properties": {                                                                                                                                                                                    
                "eventType": {"type": "string"},
                "detail":    {"type": "string"},                                                                                                                                                               
                "date":      {"type": "string"},
              },                                                                                                                                                                                                 
            "required": ["eventType", "detail", "date"]
          }                                                                                                                                                                                                     
      } 

    ]

def dispatchTool(toolName, toolInput):
    if toolName == "search":
        return search(toolInput["query"])
    if toolName == "forecast":
        csv_text = csvSession.get("csv_text") or toolInput.get("csv_text", "")
        if not csv_text:
            return "No CSV uploaded yet. Please upload a bank statement first."
        return forecast(csv_text)
    if toolName == "saveLifeEvent":
          return saveLifeEvent(
            toolInput["eventType"],                                                                                                                                                                            
            toolInput["detail"],
            toolInput["date"]                                                                                                                                                                                
          ) 

def runAgent(message:str) -> str:
    history = getRecentHistory(10)
    similar = recallSimilar(message, n=3)

    memoryContext = ""
    if history:
        lines = "\n".join(f"{t['role']}: {t['content']}" for t in history)
        memoryContext += f"\n\nRecent conversation:\n{lines}"                                                                                                                                                  
    if similar:
        memoryContext += f"\n\nRelevant past context:\n" + "\n".join(similar) 

    csv_status = ""
    if csvSession.get("csv_text"):
        row_count = csvSession.get("row_count", 0)
        csv_status = (
            f"\n\nA bank statement CSV with {row_count} rows has been uploaded this session. "
            "Use the forecast tool to answer questions about spending, income, budget, or cash flow."
        )

    system_prompt = (
        "You are VaultAI, a personal financial copilot. "
        "You help users understand their finances, plan for taxes, and make smart investment decisions."
        + csv_status
        + memoryContext
    )

    messages = [{"role": "user", "content": message}]

    while True:
        response = client.messages.create(
              model="claude-haiku-4-5-20251001",
              max_tokens=4096,
              system=system_prompt,
              tools=tools,                                                                                                                                                        
              messages=messages,                                                                                                                                                  
        )                                                                                                                                                                       
                                                                                                                                                                                  
        if response.stop_reason == "end_turn":            
            reply = response.content[0].text
            saveConversationTurn("user", message)                                                                                                                                                              
            saveConversationTurn("assistant", reply)
            return reply  

        if response.stop_reason == "tool_use":                                                                                                                                  
            toolBlock = next(b for b in response.content if b.type == "tool_use") # find the tool call, it has name, input, id
            toolResult = dispatchTool(toolBlock.name, toolBlock.input) # how does dispatch tool work?? and how does response.stop_reason, work?                                                                                                     
                                                                                                                                                                                  
            messages.append({"role": "assistant", "content": response.content}) #  The assistant's last response (so Claude remembers what it said)
            messages.append({                                                                                                                                                   
                "role": "user",                           
                "content": [{
                  "type": "tool_result",                                                                                                                                      
                  "tool_use_id": toolBlock.id,
                  "content": toolResult                                                                                                                                      
              }]                                        
            })  # The tool result (so Claude knows what the tool returned)  
    # total = response.usage.input_tokens + response.usage.output_tokens -> for future use on documentation metrics
    # return response.content[0].text

 # client.messages.count_tokens(...) 
 # Upload a file (PDFs, images, etc.)   -> client.files.upload(...) 

 # intituite ability to write...



 