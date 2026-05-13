import torch
from PIL import Image
from transformers import BlipProcessor, BlipForConditionalGeneration
import easyocr
import os
print("image_captions started")
# 1. Global Initialization for i7 Efficiency
# Loading these once prevents RAM fragmentation during long video runs
processor: BlipProcessor = None #type:ignore
model: BlipForConditionalGeneration = None #type:ignore
reader: easyocr.Reader = None #type:ignore

def _load_models():
    """Internal helper to load AI models into RAM only if they aren't ready."""
    global processor, model, reader
    
    if processor is None or model is None:
        print("Loading BLIP Image Captioning (CPU)...")
        processor = BlipProcessor.from_pretrained("Salesforce/blip-image-captioning-base")
        model = BlipForConditionalGeneration.from_pretrained("Salesforce/blip-image-captioning-base")
    
    if reader is None:
        print("Loading EasyOCR (CPU)...")
        # gpu=False is critical for your i7 setup to avoid CUDA errors
        reader = easyocr.Reader(['en'], gpu=False)

def generate_captions(image_paths):
    """
    Performs Phase 2: Combines Image Captioning and OCR.
    Outputs a detailed string for each keyframe.
    """
    _load_models()
    
    # Type hints to stop Pylance warnings
    local_processor: BlipProcessor = processor # type: ignore
    local_model: BlipForConditionalGeneration = model # type: ignore
    local_reader: easyocr.Reader = reader # type: ignore

    results = []

    for img_path in image_paths:
        if not os.path.exists(img_path):
            continue
            
        try:
            # --- PART A: Image Captioning (BLIP) ---
            raw_image = Image.open(img_path).convert('RGB')
            inputs = local_processor(images=raw_image, return_tensors="pt") # type: ignore
            
            out = local_model.generate(**inputs, max_new_tokens=40) # type: ignore
            caption = local_processor.decode(out[0], skip_special_tokens=True) # type: ignore

            # --- PART B: OCR (Text from Slides/UI) ---
            # detail=0 returns just the string, which is faster and easier to summarize
            ocr_results = local_reader.readtext(img_path, detail=0)
            ocr_text = " ".join(ocr_results) #type:ignore

            # --- PART C: Fusion ---
            # Combining both ensures the summarizer knows 'what' and 'who'
            combined_info = f"Visual: {caption}."
            if ocr_text.strip():
                combined_info += f" Text detected on screen: {ocr_text}"
            
            print(f"Processed frame {os.path.basename(img_path)}")
            results.append(combined_info)

        except Exception as e:
            print(f"Error processing {img_path}: {e}")
            results.append("Visual information unavailable for this scene.")

    return results