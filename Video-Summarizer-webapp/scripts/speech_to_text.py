import whisper
import re
import os

print("speech_to_text started")
# Load model once globally to manage your i7's 16GB RAM efficiently
model = whisper.load_model("base")

def clean_transcript(text):
    text = text.strip()

    # Remove numbers
    text = re.sub(r'\b\d+(,\s*\d+)*\b', '', text)

    # Remove filler words[cite: 1]
    fillers = ["man", "i guess", "like", "you know", "uh", "um"]
    for filler in fillers:
        text = re.sub(r'\b' + filler + r'\b', '', text, flags=re.IGNORECASE)

    # Remove common youtube / subtitle junk phrases[cite: 1]
    junk_phrases = [
        "thank you for watching", "subscribe to the channel",
        "see you in the next video", "use this video to help students",
        "cnn newsquiz", "reading comprehension and vocabulary",
        "visit our website", "click the link below"
    ]

    for phrase in junk_phrases:
        text = re.sub(phrase, '', text, flags=re.IGNORECASE)

    # Remove repeated words[cite: 1]
    text = re.sub(r'\b(\w+)( \1\b)+', r'\1', text, flags=re.IGNORECASE)

    # Remove extra spaces[cite: 1]
    text = re.sub(r'\s+', ' ', text)

    return text.strip()

def speech_to_text(audio_path, save_path=None):
    try:
        # Use fp16=False for CPU-only processing on your i7
        result = model.transcribe(audio_path, language='en', fp16=False)

        # Ensure 'result' is a dictionary and not a string
        if not isinstance(result, dict):
            print(f"DEBUG: Whisper returned unexpected type: {type(result)}")
            transcript = str(result)
            return clean_transcript(transcript)

        valid_segments = []
        
        # Safely get segments list
        segments = result.get('segments', [])
        
        for segment in segments:
            # Safely get the probability and text[cite: 1]
            no_speech_val = segment.get('no_speech_prob', 0) if isinstance(segment, dict) else 0
            
            if no_speech_val > 0.6:
                print(f"DEBUG: Skipping music/hallucination (Prob: {no_speech_val:.2f})")
                continue
            
            segment_text = segment.get('text', "").strip() if isinstance(segment, dict) else ""
            if segment_text:
                valid_segments.append(segment_text)

        # Join the valid speech parts[cite: 1]
        full_text = " ".join(valid_segments)
        cleaned_text = clean_transcript(full_text)

        if save_path:
            os.makedirs(os.path.dirname(save_path), exist_ok=True)
            with open(save_path, "w", encoding="utf-8") as f:
                f.write(cleaned_text)

        return cleaned_text

    except Exception as e:
        print(f"Error in speech-to-text: {e}")
        return ""

def transcribe_audio_transcripts(chunk_paths):
    """Used for granular Phase 3 summary logic[cite: 1]"""
    transcripts = []
    for chunk in chunk_paths:
        text = speech_to_text(chunk)
        if text: # Only add if actual speech was detected[cite: 1]
            transcripts.append(text)
    return transcripts

def transcribe_audio_chunks(chunk_paths):
    """Used for a continuous string output[cite: 1]"""
    full_transcript = ""
    for chunk in chunk_paths:
        text = speech_to_text(chunk)
        if text:
            full_transcript += text + " "
    return full_transcript.strip()

