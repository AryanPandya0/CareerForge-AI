import streamlit as st
import sys
import os
import time
from langchain_core.messages import HumanMessage, AIMessage

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from LangChain_model import get_chat_response

st.set_page_config(page_title="Career Coach", page_icon="🤖")

st.title("🤖 AI Career Coach")
st.markdown("Ask me about **Interview Prep, Roadmaps, or Salary Negotiation**.")

if "chat_history" not in st.session_state:
    st.session_state.chat_history = []
    st.session_state.chat_history.append(AIMessage(content="Hello! I'm your AI Career Coach. How can I help you land your dream job today?"))

for message in st.session_state.chat_history:
    if isinstance(message, AIMessage):
        with st.chat_message("ai"):
            st.write(message.content)
    elif isinstance(message, HumanMessage):
        with st.chat_message("human"):
            st.write(message.content)

user_query = st.chat_input("Type your career question here...")

if user_query is not None and user_query != "":
    # A. Display User Message Immediately
    st.session_state.chat_history.append(HumanMessage(content=user_query))
    with st.chat_message("human"):
        st.markdown(user_query)
    
    with st.chat_message("ai"):
        with st.spinner("Thinking..."):
            try:
                # Call the Brain function
                response = get_chat_response(user_query, st.session_state.chat_history)
                
                # --- STREAMING LOGIC ---
                def stream_data():
                    for word in response.split(" "):
                        yield word + " "
                        time.sleep(0.02)

                st.write_stream(stream_data)
                
                st.session_state.chat_history.append(AIMessage(content=response))
                
            except Exception as e:
                st.warning("⚠️ Whoa! High Traffic Alert. 🚦\n\nToo many people are scanning resumes right now! Please wait 30 seconds and try again.")
                st.error(f"Error: {e}")