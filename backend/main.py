import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
from resend import Resend

load_dotenv()

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

class ContactMessage(BaseModel):
    name: str
    email: str
    message: str

@app.get("/")
def read_root():
    return {"status": "online", "service": "Roy Boker Portfolio API"}

@app.get("/health")
def health_check():
    """Health check endpoint for Render"""
    return {"status": "healthy", "service": "Portfolio Backend"}

@app.post("/contact")
def send_message(msg: ContactMessage):
    print(f"=== Incoming contact request ===")
    print(f"From: {msg.name} ({msg.email})")
    print(f"Message: {msg.message[:100]}...")  # First 100 chars
    
    # Get Resend API key from environment
    resend_api_key = os.getenv("RESEND_API_KEY")
    receiver_email = "royboker15@gmail.com"  # Your personal email
    sender_email = "onboarding@resend.dev"  # Default Resend sender (you can change this later)

    print(f"RESEND_API_KEY configured: {bool(resend_api_key)}")

    if not resend_api_key:
        print("❌ ERROR: RESEND_API_KEY not configured.")
        return {"status": "error", "message": "Email service not configured. Please contact administrator."}

    try:
        # Initialize Resend client
        resend = Resend(api_key=resend_api_key)
        
        # Create email body
        email_body = f"""
New message from Portfolio Website:

Name: {msg.name}
Email: {msg.email}

Message:
{msg.message}
"""
        
        print("Sending email via Resend...")
        # Send email using Resend
        result = resend.emails.send({
            "from": sender_email,
            "to": receiver_email,
            "subject": f"Portfolio Contact: {msg.name}",
            "text": email_body,
        })
        
        print(f"✅ Email sent successfully via Resend! ID: {result.get('id', 'N/A')}")
        return {"status": "success", "message": "Email sent successfully!"}

    except Exception as e:
        print(f"❌ Error sending email via Resend: {type(e).__name__}: {e}")
        import traceback
        traceback.print_exc()
        # In production, don't expose error details to client
        return {"status": "error", "message": "Failed to send email. Please try again later."}
