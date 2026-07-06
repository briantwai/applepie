This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

cd backend

# Create a local virtual environment mapping
python3 -m venv venv

# Activate the virtual target system environment
# On macOS / Linux:
source venv/bin/activate
# On Windows (Command Prompt / Powershell):
venv\\Scripts\\activate

# Install libraries

pip install fastapi uvicorn sqlalchemy pydantic python-multipart PyJWT

# Launch API

uvicorn app.main:app --reload

# Check success

Success Verification: Your API interface is now tracking at http://127.0.0.1:8000.

Interactive Workbench: View your auto-generated interactive OpenAPI documentation playground directly at http://127.0.0.1:8000/docs.

Note: Upon initializing execution, a native relational engine tracker named leads.db will automatically compile into your root directory layout.

# 3. Frontend Installation & Orchestration (Next.js)
Open a separate, parallel terminal session window (leaving the backend execution terminal running continuously) and interface with the frontend layer:

Step A: Enter Development Context & Dependencies
Change directory context directly into the frontend infrastructure node and deploy package configurations:

cd frontend
npm install

Then run npm run dev

# 4. End-to-End Workflow Validation Guide
# Phase 1: Simulated Lead Capture
Navigate your workspace browser window to the root frontend interface link: http://localhost:3000.

Input target parameters across the provided fields (First Name, Last Name, Email Contact).

Select an isolated mock asset file matching standard types (.pdf, .doc, .docx) and click Submit Application.

Observe your primary backend terminal instance window to view an automated trace indicating successful asynchronous processing.

# Phase 2: Administrative Gateway Override
Direct your browser tab into the secure administrative panel space: http://localhost:3000/dashboard.

The authentication shield will render automatically. Provide the following system bypass vectors:

Attorney Email Address: attorney@almalaw.com

System Password: password123

Click Verify & Authenticate to step through the JWT payload layer block.

Phase 3: Transaction State Modification
The administrative grid workspace will parse the backend payload matrix to display your candidate asset dynamically.

View records alongside real-time parameters, status chips (PENDING), and interactive file links.

Select Mark Reached Out on the client matrix to dispatch a localized pipeline path patch down to the underlying relational storage model. The record will smoothly update to an emerald REACHED_OUT chip state.
"""

with open("README.md", "w", encoding="utf-8") as f:
f.write(readme_content)

print("File generated successfully.")