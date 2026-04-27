import sqlite3
import uuid
import chromadb
from chromadb.utils.embedding_functions import SentenceTransformerEmbeddingFunction
from datetime import datetime

conn = sqlite3.connect("memory/vault.db", check_same_thread = False) # to disanble  FastAPI running multiple thread

conn.execute(
    """
    CREATE TABLE IF NOT EXISTS lifeEvents(
    id TEXT primary key,
    eventType TEXT,
    detail TEXT, 
    date TEXT)"""
)

conn.execute(
    """
    CREATE TABLE IF NOT EXISTS conversationHistory(
    id TEXT primary key,
    role TEXT,
    content TEXT, 
    timestamp TEXT)"""
)

conn.execute(
    """
    CREATE TABLE IF NOT EXISTS finacialSummaries(
    id TEXT primary key,
    period TEXT,
    income REAL, 
    net REAL)"""
)

conn.commit()

embed_fn = SentenceTransformerEmbeddingFunction(model_name = "all-MiniLM-L6-v2")
chroma = chromadb.PersistentClient(path = "./memory/chromadb") # writes to disk at ./memory/chroma_db. Survives Docker restarts.
conversations = chroma.get_or_create_collection("conversations",embedding_function=embed_fn)

def saveLifeEvent(eventType: str, detail: str, date : str) -> str:
    eventId = str(uuid.uuid4())
    conn.execute(
        "INSERT INTO lifeEvents(id,eventType,detail,date) VALUES (?,?,?,?)", (eventId,eventType,detail,date)
    )
    conn.commit()

    conversations.add(
        ids = [eventId],
        documents = [f"{eventType}: {detail} on {date}"],
        metadatas = [{"source": "lifeEvent", "date": date}],
    )
    
    return f"Life event saved: {eventType} - {detail}"


def getLifeEvent() -> list[dict]:
    cursor = conn.execute("SELECT eventType, detail, date FROM lifeEvents ORDER BY date")
    return [{"eventType" : row[0], "detail" : row[1], "date": row[2]} for row in cursor.fetchall()]
    

def saveConversationTurn(role: str, content: str) -> None:
    turnId = str(uuid.uuid4())
    timeStamp = datetime.utcnow().isoformat()
    conn.execute(
        "INSERT INTO conversationHistory (id, role, content, timestamp) VALUES (?, ?, ?, ?)", (turnId, role, content, timeStamp),
    )                                                                                                                                                                                                          
    conn.commit()

    conversations.add(                                                                                                                                                                                         
          ids=[turnId],
          documents=[f"{role}: {content}"],
          metadatas=[{"source": "conversation", "role": role, "timestamp": timeStamp}],
    )  


def getRecentHistory(n: int = 10) -> list[dict]:
    cursor = conn.execute(
        "SELECT role, content FROM conversationHistory ORDER BY timestamp DESC LIMIT ?", (n,)
    )
    rows = cursor.fetchall()
    rows.reverse()
    return [{"role": row[0], "content": row[1]} for row in rows]


def recallSimilar(query: str, n: int = 3) -> list[str]:
    if conversations.count() == 0:
        return []
    results = conversations.query(query_texts=[query], n_results=n)
    return results["documents"][0] if results["documents"] else [] 

def saveFinancialSummary(period: str, income: float, net: float) -> None:                                                                                                                                      
    summaryId = str(uuid.uuid4())                                                                                                                                                                              
    conn.execute(                                                                                                                                                                                              
        "INSERT INTO financialSummaries (id, period, income, net) VALUES (?, ?, ?, ?)",                                                                                                                       
        (summaryId, period, income, net),                                                                                                                                                                      
    )
    conn.commit() 