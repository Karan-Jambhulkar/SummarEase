import torch
from transformers import pipeline
print("text summary started")

# 1. Initialize Summarizer
# We load this globally to manage your i7's 16GB RAM efficiently
# Using 'sshleifer/distilbart-cnn-12-6' as it is faster for CPU-only setups
summarizer = pipeline(
    "summarization", 
    model="sshleifer/distilbart-cnn-12-6", 
    device=-1  # Force CPU usage for your i7 setup
)

def summarize_chunks(text_list, format_type="bullet", length_mode="medium"):
    """
    Handles Phase 3: Recursive Summarization.
    Prevents 'index out of range' errors by enforcing strict token windows.
    """
    unique_text_list = []
    for item in text_list:
        if item not in unique_text_list:
            unique_text_list.append(item)
    
    full_text = " ".join(unique_text_list)
    # Combine all audio transcripts and visual caption.
    
    # 2. Define Safety Constraints
    # BART has a 1024 token limit. ~3000 characters is a safe buffer for CPU.
    MAX_CHAR_PER_CHUNK = 3000
    
    # Split the 28-minute data into manageable chunks
    chunks = [full_text[i:i+MAX_CHAR_PER_CHUNK] 
              for i in range(0, len(full_text), MAX_CHAR_PER_CHUNK)]
    
    print(f"DEBUG: Processing {len(chunks)} recursive chunks for long-form video.")

    intermediate_summaries = []
    
    # 3. First Pass: Summarize individual segments
    for i, chunk in enumerate(chunks):
        if len(chunk.strip()) < 50:
            continue
        try:
            # Shorten each segment to fit into a final summary
            res = summarizer(chunk, max_length=150, min_length=40, do_sample=False)
            intermediate_summaries.append(res[0]['summary_text'])
        except Exception as e:
            print(f"Error in recursive chunk {i}: {e}")
            continue

    # 4. Final Pass: Merge all summaries into the final result
    final_input = " ".join(intermediate_summaries)
    
    # Adjust final length based on user selection
    max_len = 300 if length_mode == "detailed" else 150
    min_len = 100 if length_mode == "detailed" else 50

    try:
        final_summary = summarizer(final_input, max_length=max_len, min_length=min_len, do_sample=False)[0]['summary_text']
        
        # 5. Format conversion
        if format_type == "bullet":
            # Convert the paragraph into bullet points for the frontend
            bullets = final_summary.replace(". ", ".\n• ").strip()
            return f"• {bullets}"
        
        return final_summary

    except Exception as e:
        return f"Summarization failed at final stage: {str(e)}. Try 'Short' mode."