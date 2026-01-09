import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

# Configure CORS
origins = [
    "http://localhost:5173",
    "http://localhost:8001",
    "http://localhost:8005", # Added port 8005
    "https://royboker.github.io"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # For dev, allow all. Restrict in prod.
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ContactMessage(BaseModel):
    name: str
    email: str
    message: str

@app.get("/")
def read_root():
    return {"status": "online", "service": "Roy Boker Portfolio API"}

@app.post("/contact")
def send_message(msg: ContactMessage):
    print(f"Incoming contact request form: {msg.name} ({msg.email})") # Log incoming request
    
    sender_email = os.getenv("EMAIL_USER")

    sender_password = os.getenv("EMAIL_PASS")
    receiver_email = "royboker15@gmail.com" # Your personal email

    if not sender_email or not sender_password:
        print("Email credentials not configured properly.")
        # For demo purposes, we return success even if email isn't sent, 
        # so the frontend UX is smooth until you configure .env
        return {"status": "simulated_success", "message": "Email config missing, but received!"}

    try:
        # Create message
        message = MIMEMultipart()
        message["From"] = sender_email
        message["To"] = receiver_email
        message["Subject"] = f"Portfolio Contact: {msg.name}"
        
        body = f"""
        New message from Portfolio Website:
        
        Name: {msg.name}
        Email: {msg.email}
        
        Message:
        {msg.message}
        """
        message.attach(MIMEText(body, "plain"))

        # Connect to Gmail SMTP
        with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
            server.login(sender_email, sender_password)
            server.send_message(message)
            
        return {"status": "success", "message": "LIVE EMAIL SENT!"}

    except Exception as e:
        print(f"Error sending email: {e}")
        # In production, don't expose error details to client, but for dev it helps
        return {"status": "error", "message": f"Failed to send email: {str(e)}"}
