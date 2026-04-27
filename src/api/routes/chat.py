from fastapi import APIRouter
from pydantic import BaseModel
from src.agents.agent import runAgent
from src.tools.pii_masker import demask
from src.api.session import csvSession

router = APIRouter()

class ChatRequest(BaseModel):
    message: str

class ChatResponse(BaseModel):
    message: str

@router.post("/chat", response_model=ChatResponse)
def chat(request: ChatRequest):
    response = runAgent(request.message)
    response = demask(response, csvSession.get("lookup", {}))
    return ChatResponse(message=response)

