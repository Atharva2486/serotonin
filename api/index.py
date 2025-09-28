import os
import json
from flask import Flask, request, jsonify
from vercel_blob import put, download, head
from datetime import datetime

app = Flask(__name__)

DATASET_FILE = 'dataset.json'

@app.route('/api/suggestions', methods=['POST'])
def handle_suggestions():
    # Get data from the frontend
    data = request.get_json()
    movie_ids = data.get('movie_ids', [])
    
    # Get the user's IP address from Vercel's request headers
    ip_address = request.headers.get('X-Forwarded-For', request.remote_addr)
    
    timestamp = datetime.now().isoformat()

    new_entry = {
        "timestamp": timestamp,
        "ip_address": ip_address,
        "movie_ids": movie_ids
    }

    all_data = []
    try:
        # Check if the file exists in the blob store before trying to download
        if head(DATASET_FILE).get('size', 0) > 0:
            # Download the existing JSON file
            json_blob = download(pathname=DATASET_FILE)
            all_data = json.loads(json_blob.content)
    except Exception as e:
        # If the file doesn't exist or there's an error, we start with an empty list
        print(f"Could not download or parse existing dataset.json, starting new. Error: {e}")
        all_data = []

    # Add the new entry
    all_data.append(new_entry)

    # Convert the updated list back to a JSON string
    updated_json_content = json.dumps(all_data, indent=4)

    try:
        # Upload the new version, overwriting the old one
        blob = put(
            pathname=DATASET_FILE,
            body=updated_json_content,
            options={'Content-Type': 'application/json'}
        )
        print(f"Successfully uploaded data to: {blob.get('url')}")
    except Exception as e:
        print(f"Error uploading to Blob storage: {e}")
        return jsonify({"error": "Could not save selection."}), 500

    return jsonify({"message": "Selection saved!", "url": blob.get('url')})
