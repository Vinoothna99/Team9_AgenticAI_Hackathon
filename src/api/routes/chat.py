from fastapi import APIRouter
from pydantic import BaseModel
from src.agents.agent import run_agent

router = APIRouter()

class ChatRequest(BaseModel):
    message : str 

class ChatResponse(BaseModel):
    message : str

@router.post("/chat", response_model = ChatResponse)

def chat(request : ChatRequest):
    response = run_agent(request.message)
    return ChatResponse(message = response)

