from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from typing import List
from services.ai_service import get_chat_response, get_random_gemini_key
from langchain_core.messages import HumanMessage, AIMessage
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
import json
import asyncio

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

@router.post("/stream")
async def chat_stream(request: ChatRequest):
    """Streaming endpoint that sends response word by word for typing effect."""
    try:
        langchain_history = []
        for msg in request.history:
            if msg.role == 'human':
                langchain_history.append(HumanMessage(content=msg.content))
            elif msg.role == 'ai':
                langchain_history.append(AIMessage(content=msg.content))
        
        # Get the full response first
        full_response = get_chat_response(request.query, langchain_history)
        
        async def generate():
            # Stream word by word with small delays for typing effect
            words = full_response.split(' ')
            for i, word in enumerate(words):
                chunk = word if i == 0 else ' ' + word
                yield f"data: {json.dumps({'chunk': chunk})}\n\n"
                await asyncio.sleep(0.03)  # 30ms per word for natural typing
            yield f"data: {json.dumps({'done': True})}\n\n"
        
        return StreamingResponse(generate(), media_type="text/event-stream")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
