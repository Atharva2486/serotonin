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
    
    ip_address = request.headers.get('X-Forward-For', request.remote_addr)
    timestamp = datetime.now().isoformat()
    
    new_entry = {
        "timestamp": timestamp,
        "ip_address": ip_address,
        "movie_ids": movie_ids
    }
    
    # Convert the dictionary to a JSON string
    json_content = json.dumps(new_entry, indent=4)
    
    # --- THIS IS THE FIX ---
    # Encode the string into bytes, which is what the `put` function expects
    body_as_bytes = json_content.encode('utf-8')
    # --------------------
    
    filename = f"selections/{timestamp}_{ip_address}.json"
    
    try:
        # Pass the encoded bytes to the `put` function
        blob = put(
            filename,
            body_as_bytes, # Use the bytes object here
            { 'Content-Type': 'application/json' }
        )
        print(f"Successfully uploaded selection to: {blob.get('url')}")
        
    except Exception as e:
        print(f"Error uploading to Blob storage: {e}")
        return jsonify({"error": "Could not save selection."}), 500

    return jsonify({"message": "Selection saved!", "url": blob.get('url')})
