from fastapi import FastAPI
from src.api.routes.chat import router as chat_router

app = FastAPI(title="VaultAI API")

app.include_router(chat_router)


@app.get("/health")
def health():
    return {"status": "ok"}
