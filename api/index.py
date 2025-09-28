import os
import json
import requests
from flask import Flask, request, jsonify
from vercel_blob import put, head
from datetime import datetime

app = Flask(__name__)

DATASET_FILENAME = 'dataset.json'

@app.route('/api/suggestions', methods=['POST'])
def handle_suggestions():
    data = request.get_json()
    movie_ids = data.get('movie_ids', [])
    ip_address = request.headers.get('X-Forwarded-For', request.remote_addr)
    timestamp = datetime.now().isoformat()

    new_entry = {
        "timestamp": timestamp,
        "ip_address": ip_address,
        "movie_ids": movie_ids
    }

    all_data = []
    try:
        # Check if the file exists in the blob store
        blob_metadata = head(pathname=DATASET_FILENAME)
        if blob_metadata:
            # If it exists, download its content using its URL
            response = requests.get(blob_metadata['url'])
            response.raise_for_status() # Raises an exception for bad status codes
            all_data = response.json()
    except Exception as e:
        # If the file doesn't exist or there's an error, start with an empty list
        print(f"Dataset file not found or empty, creating a new one. Error: {e}")
        all_data = []

    # Add the new entry
    all_data.append(new_entry)

    # Convert the updated list back to a JSON string
    updated_json_content = json.dumps(all_data, indent=4)

    try:
        # Upload the new version, overwriting the old one
        # Note: The first argument is the pathname, the second is the body.
        blob = put(
            DATASET_FILENAME,
            body=updated_json_content,
            options={'Content-Type': 'application/json'}
        )
        print(f"Successfully uploaded data to: {blob.get('url')}")
    except Exception as e:
        print(f"Error uploading to Blob storage: {e}")
        return jsonify({"error": "Could not save selection."}), 500

    return jsonify({"message": "Selection saved!", "url": blob.get('url')})
