from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List
from services.ai_service import get_chat_response
from langchain_core.messages import HumanMessage, AIMessage

router = APIRouter(prefix="/chat", tags=["chat"])

class ChatMessage(BaseModel):
    role: str  # 'human' or 'ai'
    content: str

class ChatRequest(BaseModel):
    query: str
    history: List[ChatMessage] = []

@router.post("/query")
async def chat_query(request: ChatRequest):
    try:
        # Convert history to LangChain messages
        langchain_history = []
        for msg in request.history:
            if msg.role == 'human':
                langchain_history.append(HumanMessage(content=msg.content))
            elif msg.role == 'ai':
                langchain_history.append(AIMessage(content=msg.content))
        
        response = get_chat_response(request.query, langchain_history)
        return {"response": response}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
