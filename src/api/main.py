from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.api.routes.chat import router as chat_router
from src.api.routes.upload import router as upload_router
from src.memory.store import getLifeEvent

app = FastAPI(title="VaultAI API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(chat_router)
app.include_router(upload_router)

@app.get("/health")
def health():
    return {"status": "ok"}

@app.get("/life-events")
def lifeEvents():
    return {"events": getLifeEvent()}