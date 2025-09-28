import os
import json
from flask import Flask, request, jsonify
from vercel_blob import put
from datetime import datetime

app = Flask(__name__)

@app.route('/api/suggestions', methods=['POST'])
def handle_suggestions():
    data = request.get_json()
    movie_ids = data.get('movie_ids', [])
    
    # Get the user's IP address from Vercel's request headers
    ip_address = request.headers.get('X-Forwarded-For', request.remote_addr)
    
    # Create a unique timestamp
    timestamp = datetime.now().isoformat()
    
    # The data for this specific submission
    new_entry = {
        "timestamp": timestamp,
        "ip_address": ip_address,
        "movie_ids": movie_ids
    }
    
    # Convert the data to a JSON string
    json_content = json.dumps(new_entry, indent=4)
    
    # Create a unique filename, e.g., "selections/2023-10-27T10:30:00_192.168.1.1.json"
    filename = f"selections/{timestamp}_{ip_address}.json"
    
    try:
        # Correctly call the put function with positional arguments
        blob = put(
            filename,           # First argument: the path/filename
            json_content,       # Second argument: the file content
            { 'Content-Type': 'application/json' } # Third argument: options
        )
        print(f"Successfully uploaded selection to: {blob.get('url')}")
        
    except Exception as e:
        print(f"Error uploading to Blob storage: {e}")
        return jsonify({"error": "Could not save selection."}), 500

    return jsonify({"message": "Selection saved!", "url": blob.get('url')})
