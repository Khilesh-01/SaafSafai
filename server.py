"""
Civic Chatbot Server - Updated with better error handling
"""

from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import google.generativeai as genai
import os
from dotenv import load_dotenv
import logging
from typing import Dict, List, Optional
import json

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Configure Gemini API
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    logger.error("GEMINI_API_KEY not found in environment variables")
    # For testing, you can set it here (remove in production)
    GEMINI_API_KEY = "your-test-key-here"  # Replace with actual key

genai.configure(api_key=GEMINI_API_KEY)

class CivicChatbot:
    """Civic Issue Chatbot using Gemini API"""
    
    def __init__(self):
        """Initialize the Gemini model with civic-specific instructions"""
        generation_config = {
            "temperature": 0.7,
            "top_p": 0.95,
            "top_k": 40,
            "max_output_tokens": 1024,
        }
        
        safety_settings = [
            {"category": "HARM_CATEGORY_HARASSMENT", "threshold": "BLOCK_MEDIUM_AND_ABOVE"},
            {"category": "HARM_CATEGORY_HATE_SPEECH", "threshold": "BLOCK_MEDIUM_AND_ABOVE"},
            {"category": "HARM_CATEGORY_SEXUALLY_EXPLICIT", "threshold": "BLOCK_MEDIUM_AND_ABOVE"},
            {"category": "HARM_CATEGORY_DANGEROUS_CONTENT", "threshold": "BLOCK_MEDIUM_AND_ABOVE"},
        ]
        
        self.system_instruction = """You are a Civic Assistance Chatbot that helps users report civic issues.

YOUR CONVERSATION FLOW:
1. First message: Greet and ask what civic issue they want to report
2. Second message: Once they mention an issue, ask for location details
3. Third message: Ask for a detailed description of the problem
4. Fourth message: Ask for contact information (optional but helpful)
5. Final message: Confirm the report and provide a reference number

ACCEPTABLE CIVIC ISSUES:
- Road issues: potholes, broken roads, road repairs, cracks
- Drainage problems: clogged drains, flooding, water logging
- Waste management: garbage collection, sanitation, overflowing bins
- Public utilities: street lights, water supply, street cleanliness
- Public transport: bus stops, traffic problems, transportation
- Public infrastructure: parks, public toilets, public facilities
- Construction and building issues
- Public safety and emergency services

IMPORTANT RULES:
- Keep responses SHORT and FOCUSED (2-3 sentences max)
- Ask ONE question at a time
- Remember what the user already told you - DON'T ask for it again
- If the query is not civic-related, politely redirect them
- When you have all info, provide a confirmation with a reference number like: "REF-" + timestamp
- Always be helpful, professional, and conversational"""
        
        self.model = genai.GenerativeModel(
            model_name="gemini-pro",
            generation_config=generation_config,
            safety_settings=safety_settings
        )
        
        self.chat_history = {}
        self.user_sessions = {}  # Track user session data
    
    def get_response(self, user_id: str, message: str) -> Dict:
        """Get response from Gemini for civic issues"""
        
        # Initialize chat history for new user
        if user_id not in self.chat_history:
            self.chat_history[user_id] = self.model.start_chat(history=[])
            self.user_sessions[user_id] = {"messages_count": 0}
        
        chat = self.chat_history[user_id]
        self.user_sessions[user_id]["messages_count"] += 1
        
        try:
            # Build context-aware message
            context_message = f"{self.system_instruction}\n\nUser message: {message}\n\nNote: This is message #{self.user_sessions[user_id]['messages_count']} in the conversation."
            
            # Send message to Gemini
            response = chat.send_message(context_message)
            response_text = response.text.strip()
            
            # If response is empty, generate a contextual fallback
            if not response_text:
                response_text = self._get_contextual_fallback(self.user_sessions[user_id]["messages_count"])
            
            return {
                "success": True,
                "response": response_text,
                "user_id": user_id,
                "message_count": self.user_sessions[user_id]["messages_count"]
            }
            
        except Exception as e:
            logger.error(f"Error getting response from Gemini: {str(e)}")
            # Contextual fallback based on conversation stage
            response_text = self._get_contextual_fallback(self.user_sessions[user_id]["messages_count"])
            return {
                "success": True,
                "response": response_text,
                "user_id": user_id,
                "message_count": self.user_sessions[user_id]["messages_count"],
                "note": "Using fallback response due to API error"
            }
    
    def _get_contextual_fallback(self, message_count: int) -> str:
        """Get contextual fallback response based on conversation stage"""
        fallback_responses = {
            1: "I'm here to help you report civic issues. What problem would you like to report? (e.g., pothole, garbage overflow, drainage issues)",
            2: "Thank you for telling me about that. Where is this issue located? Please provide the area or street name.",
            3: "I see. Can you describe the problem in more detail? How long has this issue been happening?",
            4: "That's helpful information. Can you provide your contact details (name and phone) so authorities can follow up?",
        }
        return fallback_responses.get(message_count, "Thank you for your input. Your civic issue report is being processed.")

# Initialize chatbot
chatbot = CivicChatbot()

@app.route('/')
def home():
    """Home page"""
    return """
    <!DOCTYPE html>
    <html>
    <head>
        <title>Civic Chatbot API</title>
        <style>
            body { font-family: Arial, sans-serif; margin: 40px; }
            .container { max-width: 800px; margin: 0 auto; }
            .endpoint { background: #f5f5f5; padding: 15px; margin: 10px 0; border-radius: 5px; }
            code { background: #eee; padding: 2px 5px; }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>Civic Chatbot API</h1>
            <p>Chatbot for civic issues like broken roads, drainage, etc.</p>
            
            <div class="endpoint">
                <h3>GET /health</h3>
                <p>Health check endpoint</p>
                <code>curl http://localhost:5000/health</code>
            </div>
            
            <div class="endpoint">
                <h3>POST /api/chat</h3>
                <p>Main chat endpoint (use POST method)</p>
                <code>curl -X POST http://localhost:5000/api/chat -H "Content-Type: application/json" -d '{"message": "pothole on main street"}'</code>
            </div>
            
            <div class="endpoint">
                <h3>POST /api/clear</h3>
                <p>Clear chat history</p>
                <code>curl -X POST http://localhost:5000/api/clear -H "Content-Type: application/json" -d '{"user_id": "test123"}'</code>
            </div>
        </div>
    </body>
    </html>
    """

@app.route('/health')
def health_check():
    """Health check endpoint"""
    return jsonify({
        "status": "healthy",
        "service": "civic-chatbot",
        "timestamp": os.times().user,
        "gemini_configured": bool(GEMINI_API_KEY and GEMINI_API_KEY != "your-test-key-here")
    })

@app.route('/api/chat', methods=['POST', 'GET'])  # Allow GET for testing
def chat():
    """Main chat endpoint - handles both POST and GET for testing"""
    
    # Handle GET request (for testing only)
    if request.method == 'GET':
        return jsonify({
            "success": False,
            "error": "Please use POST method for chat. Example:",
            "example": {
                "method": "POST",
                "url": "/api/chat",
                "headers": {"Content-Type": "application/json"},
                "body": {"message": "Your message here", "user_id": "optional_user_id"}
            }
        })
    
    # Handle POST request
    try:
        # Get data from request
        if request.is_json:
            data = request.get_json()
        else:
            # Try to parse as form data
            data = request.form.to_dict()
            if 'message' not in data and request.data:
                # Try to parse raw data
                try:
                    data = json.loads(request.data.decode('utf-8'))
                except:
                    pass
        
        logger.info(f"Received data: {data}")
        
        # Validate request
        if not data:
            return jsonify({
                "success": False,
                "error": "No data received. Send JSON with 'message' field."
            }), 400
        
        if 'message' not in data:
            return jsonify({
                "success": False,
                "error": "Missing 'message' in request",
                "received_data": data
            }), 400
        
        user_id = data.get('user_id', 'default_user')
        message = str(data['message']).strip()
        
        if not message:
            return jsonify({
                "success": False,
                "error": "Message cannot be empty"
            }), 400
        
        logger.info(f"Processing message from {user_id}: {message}")
        
        # Get response from chatbot
        result = chatbot.get_response(user_id, message)
        
        return jsonify(result)
        
    except Exception as e:
        logger.error(f"Error in chat endpoint: {str(e)}")
        return jsonify({
            "success": False,
            "error": f"Internal server error: {str(e)}",
            "tip": "Make sure you're sending valid JSON with 'message' field"
        }), 500

@app.route('/api/clear', methods=['POST'])
def clear_chat():
    """Clear chat history"""
    try:
        data = request.get_json() or {}
        user_id = data.get('user_id', 'default_user')
        
        if user_id in chatbot.chat_history:
            del chatbot.chat_history[user_id]
        
        return jsonify({
            "success": True,
            "message": f"Chat history cleared for user {user_id}"
        })
        
    except Exception as e:
        logger.error(f"Error clearing chat: {str(e)}")
        return jsonify({
            "success": False,
            "error": "Failed to clear chat history"
        }), 500

@app.route('/api/clear-chat', methods=['POST'])
def clear_chat_alias():
    """Alias for /api/clear - for frontend compatibility"""
    return clear_chat()

@app.route('/test', methods=['GET'])
def test_page():
    """Test page to try the chatbot"""
    return """
    <!DOCTYPE html>
    <html>
    <head>
        <title>Test Civic Chatbot</title>
        <script>
            async function sendMessage() {
                const message = document.getElementById('message').value;
                const responseDiv = document.getElementById('response');
                
                responseDiv.innerHTML = 'Sending...';
                
                try {
                    const response = await fetch('/api/chat', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            message: message,
                            user_id: 'test_user'
                        })
                    });
                    
                    const data = await response.json();
                    
                    if (data.success) {
                        responseDiv.innerHTML = `<strong>Bot:</strong> ${data.response}`;
                    } else {
                        responseDiv.innerHTML = `<strong>Error:</strong> ${data.error}`;
                    }
                } catch (error) {
                    responseDiv.innerHTML = `<strong>Network Error:</strong> ${error}`;
                }
            }
        </script>
    </head>
    <body>
        <h1>Test Civic Chatbot</h1>
        <input type="text" id="message" placeholder="Type your civic issue..." style="width: 300px; padding: 10px;">
        <button onclick="sendMessage()" style="padding: 10px 20px;">Send</button>
        <div id="response" style="margin-top: 20px; padding: 10px; border: 1px solid #ccc; min-height: 50px;"></div>
        
        <h3>Example messages:</h3>
        <ul>
            <li>There's a big pothole on Main Street</li>
            <li>Drainage is clogged in my area</li>
            <li>Garbage hasn't been collected for 3 days</li>
            <li>Street light is not working</li>
        </ul>
    </body>
    </html>
    """

if __name__ == '__main__':
    port = int(os.getenv("PORT", 8000))
    debug_mode = os.getenv("FLASK_DEBUG", "True").lower() == "true"
    
    logger.info(f"Starting Civic Chatbot server on port {port}")
    logger.info(f"Server URL: http://localhost:{port}")
    logger.info(f"Test page: http://localhost:{port}/test")
    
    app.run(host='0.0.0.0', port=port, debug=debug_mode)