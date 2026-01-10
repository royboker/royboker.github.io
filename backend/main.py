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
    
    sender_email = os.getenv("EMAIL_USER")
    sender_password = os.getenv("EMAIL_PASS")
    receiver_email = "royboker15@gmail.com" # Your personal email

    print(f"EMAIL_USER configured: {bool(sender_email)}")
    print(f"EMAIL_PASS configured: {bool(sender_password)}")

    if not sender_email or not sender_password:
        print("❌ ERROR: Email credentials not configured properly.")
        print(f"EMAIL_USER: {'SET' if sender_email else 'MISSING'}")
        print(f"EMAIL_PASS: {'SET' if sender_password else 'MISSING'}")
        return {"status": "error", "message": "Email service not configured. Please contact administrator."}

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
        # Try STARTTLS (port 587) first, as it's more compatible with Render's network
        print("Connecting to Gmail SMTP (STARTTLS on port 587)...")
        try:
            with smtplib.SMTP("smtp.gmail.com", 587, timeout=10) as server:
                print("Starting TLS...")
                server.starttls()
                print("Logging in to SMTP server...")
                server.login(sender_email, sender_password)
                print("Sending email...")
                server.send_message(message)
                print("✅ Email sent successfully!")
        except Exception as tls_error:
            print(f"STARTTLS failed: {tls_error}")
            print("Trying SSL (port 465) as fallback...")
            # Fallback to SSL on port 465
            with smtplib.SMTP_SSL("smtp.gmail.com", 465, timeout=10) as server:
                print("Logged in to SMTP server (SSL)...")
                server.login(sender_email, sender_password)
                print("Sending email...")
                server.send_message(message)
                print("✅ Email sent successfully!")
            
        return {"status": "success", "message": "Email sent successfully!"}

    except smtplib.SMTPAuthenticationError as e:
        print(f"❌ SMTP Authentication Error: {e}")
        return {"status": "error", "message": "Authentication failed. Please check email credentials."}
    except smtplib.SMTPException as e:
        print(f"❌ SMTP Error: {e}")
        return {"status": "error", "message": "Failed to send email due to SMTP error."}
    except Exception as e:
        print(f"❌ Unexpected Error sending email: {type(e).__name__}: {e}")
        import traceback
        traceback.print_exc()
        # In production, don't expose error details to client
        return {"status": "error", "message": "Failed to send email. Please try again later."}
