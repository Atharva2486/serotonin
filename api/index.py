import os
import json
from flask import Flask, request, jsonify
from vercel_blob import put
from datetime import datetime

app = Flask(__name__)

@app.route('/api/suggestions', methods=['POST'])
def handle_suggestions():
    # Get data from the frontend
    data = request.get_json()
    movie_ids = data.get('movie_ids', [])
    
    # Get the user's IP address from Vercel's request headers
    ip_address = request.headers.get('X-Forwarded-For', request.remote_addr)
    
    # Create a unique timestamp for the filename
    timestamp = datetime.now().isoformat()
    
    # Create the data to be saved
    new_entry = {
        "timestamp": timestamp,
        "ip_address": ip_address,
        "movie_ids": movie_ids
    }
    
    # Convert the data to a JSON string
    json_content = json.dumps(new_entry, indent=4)
    
    # Create a unique filename for this submission
    # e.g., "selections/2023-10-27T10:30:00_192.168.1.1.json"
    filename = f"selections/{timestamp}_{ip_address}.json"
    
    try:
        # Upload the JSON string as a new file to Vercel Blob
        blob = put(
            pathname=filename,
            body=json_content,
            options={'Content-Type': 'application/json'}
        )
        print(f"Successfully uploaded selection to: {blob.get('url')}")
    except Exception as e:
        print(f"Error uploading to Blob storage: {e}")
        return jsonify({"error": "Could not save selection."}), 500

    return jsonify({"message": "Selection saved!", "url": blob.get('url')})
