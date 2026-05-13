import os
from pydub import AudioSegment
from pydub.silence import split_on_silence

print("audio_splitter started")

def split_audio(audio_path, output_folder, chunk_length_ms=180000):
    """
    Splits audio into chunks based on silence to avoid cutting mid-word.
    """
    if audio_path is None or not os.path.exists(audio_path):
        print(f"Error: Audio file not found at {audio_path}")
        return []
    try:
        os.makedirs(output_folder, exist_ok=True)

        # Load the audio file
        audio = AudioSegment.from_wav(audio_path)
        
        print(f"Analyzing audio for silence patterns...")
        
        # Split on silence: ensures we don't cut in the middle of a word
        chunks = split_on_silence(
            audio, 
            min_silence_len=700, 
            silence_thresh=audio.dBFS - 16, 
            keep_silence=300
        )

        output_chunks = []
        current_chunk = AudioSegment.empty()
        chunk_count = 0

        # Group small silent-split segments into target chunk sizes (e.g., 3 mins)
        for segment in chunks:
            if len(current_chunk) + len(segment) < chunk_length_ms:
                current_chunk += segment
            else:
                chunk_name = os.path.join(output_folder, f"chunk_{chunk_count}.wav")
                current_chunk.export(chunk_name, format="wav")
                output_chunks.append(chunk_name)
                
                current_chunk = segment
                chunk_count += 1

        # Export final remaining piece
        if len(current_chunk) > 0:
            chunk_name = os.path.join(output_folder, f"chunk_{chunk_count}.wav")
            current_chunk.export(chunk_name, format="wav")
            output_chunks.append(chunk_name)

        print(f"Audio split into {len(output_chunks)} smart chunks.")
        return output_chunks

    except Exception as e:
        print(f"Error splitting audio: {e}")
        raise e