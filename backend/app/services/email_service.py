# backend/app/services/email_service.py

async def send_lead_notifications(prospect_email: str, prospect_name: str):
    """Simulates background notification workflows"""
    print("\n" + "="*50)
    print("📧 MOCK EMAIL SYSTEM TRIGGERED")
    print(f"To Prospect ({prospect_email}): 'Hi {prospect_name}, we received your application!'")
    print("To Attorney (internal@almalaw.com): 'Alert: A new lead has been submitted!'")
    print("="*50 + "\n")
    return True