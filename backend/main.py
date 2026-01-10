import os
from fastapi import FastAPI, HTTPException, UploadFile, File, Form, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
import resend
import google.generativeai as genai
from io import BytesIO
import PyPDF2
from datetime import datetime, timedelta
import uuid

load_dotenv()

# Initialize Resend
resend.api_key = os.getenv("RESEND_API_KEY")

# Initialize Google Gemini
gemini_api_key = os.getenv("GEMINI_API_KEY")
GEMINI_MODEL = "gemini-2.5-flash"
if gemini_api_key:
    genai.configure(api_key=gemini_api_key)

app = FastAPI()

# Configure CORS
# Production origins - only allow your GitHub Pages site
origins = [
    "https://royboker.github.io",
    "http://localhost:5173",  # Keep for local dev
    "http://localhost:8001",  # Keep for local dev
    "http://localhost:8005",  # Keep for local dev
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # Restricted to specific origins for security
    allow_credentials=True,
    allow_methods=["GET", "POST"],  # Only necessary methods
    allow_headers=["Content-Type", "Accept"],
)

# In-memory storage for chat sessions (use database in production)
# Format: {session_id: {"document_text": str, "questions_asked": int, "created_at": datetime, "filename": str}}
chat_sessions = {}
MAX_QUESTIONS_PER_SESSION = 5  # Limit questions per session

class ContactMessage(BaseModel):
    name: str
    email: str
    message: str

class ChatMessage(BaseModel):
    session_id: str
    question: str

class AnalyticsEvent(BaseModel):
    event_type: str  # 'visit', 'app_used', 'chatbot_used'
    app_name: str = None  # Optional: which app was used
    details: str = None  # Optional: additional details

def extract_text_from_pdf(file_content: bytes) -> str:
    """Extract text from PDF file"""
    try:
        pdf_file = BytesIO(file_content)
        pdf_reader = PyPDF2.PdfReader(pdf_file)
        text = ""
        for page in pdf_reader.pages:
            text += page.extract_text() + "\n"
        return text.strip()
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error reading PDF: {str(e)}")

@app.get("/")
def read_root():
    return {"status": "online", "service": "Roy Boker Portfolio API"}

@app.get("/health")
def health_check():
    """Health check endpoint for Render"""
    return {"status": "healthy", "service": "Portfolio Backend"}

# Rate limiting for notifications (prevent email spam)
_notification_cache = {}
NOTIFICATION_COOLDOWN = 300  # 5 minutes between same type notifications

async def send_notification_email(event_type: str, app_name: str = None, details: str = None):
    """Send notification email about website activity (with rate limiting)"""
    try:
        # Rate limiting: don't send same notification type within cooldown period
        cache_key = f"{event_type}_{app_name}"
        now = datetime.now()
        
        if cache_key in _notification_cache:
            last_sent = _notification_cache[cache_key]
            if (now - last_sent).total_seconds() < NOTIFICATION_COOLDOWN:
                print(f"⏭️ Notification skipped (rate limit): {event_type}")
                return
        
        # Update cache
        _notification_cache[cache_key] = now
        
        receiver_email = "royboker15@gmail.com"
        sender_email = "onboarding@resend.dev"
        
        # Map event types to friendly messages
        event_messages = {
            "visit": "🌐 Someone visited your portfolio website!",
            "app_used": f"🎮 Someone used your {app_name} app!",
            "chatbot_used": "🤖 Someone is using your AI Document Chat!"
        }
        
        subject = event_messages.get(event_type, "Portfolio Activity Alert")
        
        # Build email body
        body = f"""{subject}

Event Type: {event_type}
"""
        
        if app_name:
            body += f"App/Feature: {app_name}\n"
        
        if details:
            body += f"Details: {details}\n"
        
        body += f"""
Timestamp: {now.strftime('%Y-%m-%d %H:%M:%S')}

This is an automatic notification from your portfolio website.
You'll receive notifications about user activity to help you track engagement.
"""
        
        # Only send if Resend is configured
        if resend.api_key:
            params = {
                "from": sender_email,
                "to": receiver_email,
                "subject": subject,
                "text": body,
            }
            resend.Emails.send(params)
            print(f"✅ Notification email sent: {event_type}")
        
    except Exception as e:
        print(f"⚠️ Could not send notification email: {e}")
        # Don't fail the request if email fails

@app.post("/analytics/event")
async def track_event(event: AnalyticsEvent, background_tasks: BackgroundTasks):
    """Track website events and send notifications"""
    try:
        print(f"📊 Analytics event: {event.event_type}")
        if event.app_name:
            print(f"   App: {event.app_name}")
        if event.details:
            print(f"   Details: {event.details}")
        
        # Send notification email in background (non-blocking)
        background_tasks.add_task(send_notification_email, event.event_type, event.app_name, event.details)
        
        return {"status": "success", "message": "Event tracked"}
    
    except Exception as e:
        print(f"❌ Error tracking event: {e}")
        return {"status": "error", "message": "Could not track event"}

@app.post("/contact")
def send_message(msg: ContactMessage):
    print(f"=== Incoming contact request ===")
    print(f"From: {msg.name} ({msg.email})")
    print(f"Message: {msg.message[:100]}...")  # First 100 chars
    
    # Check if Resend API key is configured
    resend_api_key = os.getenv("RESEND_API_KEY")
    receiver_email = "royboker15@gmail.com"  # Your personal email
    sender_email = "onboarding@resend.dev"  # Default Resend sender (you can change this later)

    print(f"RESEND_API_KEY configured: {bool(resend_api_key)}")

    if not resend_api_key:
        print("❌ ERROR: RESEND_API_KEY not configured.")
        return {"status": "error", "message": "Email service not configured. Please contact administrator."}

    try:
        # Create email body
        email_body = f"""
New message from Portfolio Website:

Name: {msg.name}
Email: {msg.email}

Message:
{msg.message}
"""
        
        print("Sending email via Resend...")
        # Send email using Resend API
        params = {
            "from": sender_email,
            "to": receiver_email,
            "subject": f"Portfolio Contact: {msg.name}",
            "text": email_body,
        }
        
        result = resend.Emails.send(params)
        
        print(f"✅ Email sent successfully via Resend! ID: {result.get('id', 'N/A')}")
        return {"status": "success", "message": "Email sent successfully!"}

    except Exception as e:
        print(f"❌ Error sending email via Resend: {type(e).__name__}: {e}")
        import traceback
        traceback.print_exc()
        # In production, don't expose error details to client
        return {"status": "error", "message": "Failed to send email. Please try again later."}

@app.post("/chat/upload")
async def upload_document(
    file: UploadFile = File(...),
    session_id: str = Form(None)
):
    """Upload a document and create a chat session"""
    try:
        print(f"=== Uploading document: {file.filename} ===")
        
        # Read file content
        content = await file.read()
        
        # Validate file size (max 10MB)
        if len(content) > 10 * 1024 * 1024:
            return {"status": "error", "message": "File too large. Maximum size is 10MB."}
        
        # Extract text based on file type
        if file.filename.endswith('.pdf'):
            document_text = extract_text_from_pdf(content)
        elif file.filename.endswith('.txt'):
            document_text = content.decode('utf-8')
        else:
            return {"status": "error", "message": "Unsupported file type. Please upload PDF or TXT."}
        
        if not document_text.strip():
            return {"status": "error", "message": "Document appears to be empty or could not be read."}
        
        # Generate session ID if not provided
        if not session_id:
            session_id = f"session_{uuid.uuid4().hex[:12]}_{int(datetime.now().timestamp())}"
        
        # Store session
        chat_sessions[session_id] = {
            "document_text": document_text,
            "questions_asked": 0,
            "created_at": datetime.now(),
            "filename": file.filename,
            "auto_summary": None  # Will store the automatic summary
        }
        
        print(f"✅ Document uploaded successfully. Session ID: {session_id}")
        
        # Automatically generate summary of the document
        summary = None
        if gemini_api_key:
            try:
                print("Generating automatic document summary...")
                model = genai.GenerativeModel(GEMINI_MODEL)
                
                # Limit document text for summary
                max_doc_length = 15000
                doc_text = document_text[:max_doc_length]
                if len(document_text) > max_doc_length:
                    doc_text += "\n\n[Document truncated...]"
                
                summary_prompt = f"""You are a helpful assistant providing a friendly, conversational summary of a document. Write as if you're chatting with a friend, not using technical formatting or bullet points.

Document content:
{doc_text}

Please provide a friendly, conversational overview that:
- Starts with "I've analyzed this document for you!"
- Explains what the document is about in a natural, easy-to-understand way
- Highlights the key points and important information in a conversational tone
- Mentions any interesting or notable details
- Writes in plain, friendly language without markdown formatting, bullet points, or numbered lists
- Keep it concise but informative (about 2-3 paragraphs)

Write as if you're explaining it to a friend in a casual conversation."""
                
                try:
                    summary_response = model.generate_content(summary_prompt)
                    summary = summary_response.text if summary_response.text else None
                    
                    if summary:
                        chat_sessions[session_id]["auto_summary"] = summary
                        chat_sessions[session_id]["questions_asked"] = 1  # Count the auto-summary as first question
                        print("✅ Automatic summary generated successfully")
                    else:
                        print("⚠️ Could not generate summary")
                except Exception as api_error:
                    error_str = str(api_error)
                    # Check if it's a quota/rate limit error (429)
                    if "429" in error_str or "quota" in error_str.lower() or "rate" in error_str.lower():
                        print(f"⚠️ Quota exceeded for automatic summary (not shown to user): {error_str[:200]}")
                        # Continue without summary if quota exceeded
                        summary = None
                    else:
                        # For other errors, log and continue
                        print(f"⚠️ Error generating automatic summary: {api_error}")
                        summary = None
            except Exception as e:
                error_str = str(e)
                if "429" in error_str or "quota" in error_str.lower() or "rate" in error_str.lower():
                    print(f"⚠️ Quota exceeded for automatic summary (hidden from user): {error_str[:300]}")
                else:
                    print(f"⚠️ Error generating automatic summary: {error_str[:200]}")
                # Continue even if summary generation fails
                summary = None
        
        return {
            "status": "success",
            "session_id": session_id,
            "message": f"Document uploaded successfully. You can ask up to {MAX_QUESTIONS_PER_SESSION} questions.",
            "questions_remaining": MAX_QUESTIONS_PER_SESSION - chat_sessions[session_id]["questions_asked"],
            "auto_summary": summary  # Include the summary in response
        }
    
    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Error uploading document: {e}")
        import traceback
        traceback.print_exc()
        return {"status": "error", "message": f"Error processing document: {str(e)}"}

@app.post("/chat/ask")
async def ask_question(msg: ChatMessage):
    """Ask a question about the uploaded document"""
    try:
        print(f"=== Question from session {msg.session_id} ===")
        print(f"Question: {msg.question[:100]}...")
        
        # Check if Gemini API key is configured
        if not gemini_api_key:
            return {"status": "error", "message": "AI service not configured. Please contact administrator."}
        
        # Check if session exists
        if msg.session_id not in chat_sessions:
            return {"status": "error", "message": "Session not found. Please upload a document first."}
        
        session = chat_sessions[msg.session_id]
        
        # Check question limit
        if session["questions_asked"] >= MAX_QUESTIONS_PER_SESSION:
            return {
                "status": "error",
                "message": f"Question limit reached ({MAX_QUESTIONS_PER_SESSION} questions per session). Please upload a new document."
            }
        
        # Check if session is too old (24 hours)
        if datetime.now() - session["created_at"] > timedelta(hours=24):
            del chat_sessions[msg.session_id]
            return {"status": "error", "message": "Session expired. Please upload a new document."}
        
        # Initialize Gemini model
        model = genai.GenerativeModel(GEMINI_MODEL)
        print(f"Using model: {GEMINI_MODEL}")
        
        # Create prompt with document context (limit document text to avoid token limits)
        max_doc_length = 15000  # Limit document text
        doc_text = session["document_text"][:max_doc_length]
        if len(session["document_text"]) > max_doc_length:
            doc_text += "\n\n[Document truncated...]"
        
        prompt = f"""You are a helpful assistant that answers questions about the following document.

Document content:
{doc_text}

Question: {msg.question}

Please provide a clear and concise answer based on the document content only. If the answer is not in the document, say "The answer to this question is not found in the document." Keep your answer concise and to the point."""

        # Get response from Gemini
        print(f"Sending request to Gemini using model: {GEMINI_MODEL}...")
        try:
            response = model.generate_content(prompt)
            answer = response.text if response.text else "I couldn't generate a response. Please try again."
        except Exception as api_error:
            error_str = str(api_error)
            # Check if it's a quota/rate limit error (429)
            if "429" in error_str or "quota" in error_str.lower() or "rate" in error_str.lower():
                print(f"❌ Quota exceeded error (hidden from user): {error_str[:300]}")
                return {
                    "status": "error",
                    "message": "AI service is currently unavailable. Please try again later."
                }
            # Re-raise other errors to be handled by outer exception handler
            raise
        
        # Update question count
        session["questions_asked"] += 1
        questions_remaining = MAX_QUESTIONS_PER_SESSION - session["questions_asked"]
        
        print(f"✅ Question answered. Questions remaining: {questions_remaining}")
        return {
            "status": "success",
            "answer": answer,
            "questions_remaining": questions_remaining,
            "questions_asked": session["questions_asked"]
        }
    
    except Exception as e:
        error_str = str(e)
        # Check if it's a quota error that wasn't caught before
        if "429" in error_str or "quota" in error_str.lower() or "rate" in error_str.lower():
            print(f"❌ Quota exceeded error (hidden from user): {error_str[:300]}")
            return {
                "status": "error",
                "message": "AI service is currently unavailable. Please try again later."
            }
        
        print(f"❌ Error asking question: {e}")
        import traceback
        traceback.print_exc()
        return {"status": "error", "message": "Error processing question. Please try again later."}

@app.get("/chat/session/{session_id}")
def get_session_info(session_id: str):
    """Get information about a chat session"""
    if session_id not in chat_sessions:
        return {"status": "error", "message": "Session not found"}
    
    session = chat_sessions[session_id]
    return {
        "status": "success",
        "filename": session["filename"],
        "questions_asked": session["questions_asked"],
        "questions_remaining": MAX_QUESTIONS_PER_SESSION - session["questions_asked"],
        "created_at": session["created_at"].isoformat()
    }
