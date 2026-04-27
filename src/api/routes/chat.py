from fastapi import APIRouter
from pydantic import BaseModel
from src.agents.agent import runAgent

router = APIRouter()

class ChatRequest(BaseModel):
    message : str 

class ChatResponse(BaseModel):
    message : str

@router.post("/chat", response_model = ChatResponse)

def chat(request : ChatRequest):
    response = runAgent(request.message)
    return ChatResponse(message = response)

