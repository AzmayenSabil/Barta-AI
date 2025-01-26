import re
from transformers import pipeline, AutoTokenizer, AutoModelForCausalLM
from transformers import BitsAndBytesConfig
import torch

# Step 5: Sentiment Analysis using specialized model
sentiment_analyzer = pipeline(
    "text-classification",
    model="lxyuan/distilbert-base-multilingual-cased-sentiments-student",
    device=0  # Use GPU
)

# Step 6: Action Item Generation using Mistral-7B
quantization_config = BitsAndBytesConfig(
    load_in_4bit=True,
    bnb_4bit_compute_dtype=torch.float16,
    bnb_4bit_quant_type="nf4"
)

from transformers import AutoTokenizer

tokenizer = AutoTokenizer.from_pretrained("mistralai/Mistral-7B-Instruct-v0.3", use_fast=False, trust_remote_code=True)
model = AutoModelForCausalLM.from_pretrained(
    "mistralai/Mistral-7B-Instruct-v0.3",
    device_map="auto",
    quantization_config=quantization_config,
    do_sample=True,
    top_p=0.95,
    temperature=0.3,
    repetition_penalty=1.15
)

def generate_action_items_array(transcript_text):
    prompt = f"""<s>[INST] 
নিচের মিটিং ট্রান্সক্রিপ্ট বিশ্লেষণ করে কর্মপরিকল্পনা তৈরি করুন বাংলা ভাষায়:
{transcript_text}

ফরম্যাট:
- কর্মপরিকল্পনা: [বিবরণ]
  দায়িত্বপ্রাপ্ত: [ব্যক্তি]
  সময়সীমা: [সময়]
  
কেবলমাত্র বাস্তব কর্মপরিকল্পনা অন্তর্ভুক্ত করুন। উত্তর বাংলাতেই দিন। [/INST]"""
    
    inputs = tokenizer(prompt, return_tensors="pt").to("cuda")
    outputs = model.generate(**inputs, max_new_tokens=700)
    action_items = tokenizer.decode(outputs[0], skip_special_tokens=True)

    # Split action items into an array by newlines
    action_items_array = re.split(r"\n- ", action_items)
    action_items_array = [item.strip() for item in action_items_array if item.strip()]
    
    return action_items_array

def generate_meeting_summary_array(transcript_text):
    prompt = f"""<s>[INST] 
মিটিং ট্রান্সক্রিপ্ট বিশ্লেষণ করে একটি বিস্তারিত সারাংশ তৈরি করুন বাংলা ভাষায়:
{transcript_text}

সারাংশে নিম্নলিখিত বিষয়গুলি অন্তর্ভুক্ত করুন:
১. প্রধান আলোচ্য বিষয়
২. গৃহীত সিদ্ধান্তসমূহ
৩. সামগ্রিক অনুভূতি (ইতিবাচক/নিরপেক্ষ/নেতিবাচক) সাথে আত্মবিশ্বাস স্কোর
৪. অংশগ্রহণকারীদের সম্পৃক্ততা বিশ্লেষণ

উত্তর অবশ্যই বাংলায় এবং ইউনিকোডে লিখতে হবে। [/INST]"""
    
    inputs = tokenizer(prompt, return_tensors="pt").to("cuda")
    outputs = model.generate(**inputs, max_new_tokens=1000)
    summary = tokenizer.decode(outputs[0], skip_special_tokens=True)

    # Split the summary into sections and return as an array
    summary_array = [
        extract_section(summary, "প্রধান আলোচ্য বিষয়"),
        extract_section(summary, "গৃহীত সিদ্ধান্তসমূহ"),
        extract_section(summary, "সামগ্রিক অনুভূতি"),
        extract_section(summary, "অংশগ্রহণকারীদের সম্পৃক্ততা বিশ্লেষণ")
    ]
    return summary_array

def extract_section(summary, section_title):
    # Helper function to extract specific sections from the summary
    pattern = rf"{section_title}:(.*?)(\n\d|\Z)"
    match = re.search(pattern, summary, re.DOTALL)
    return match.group(1).strip() if match else "[তথ্য পাওয়া যায়নি]"

def process_meeting_summary(transcript):
    """
    Process the meeting transcript to generate a summary and action items as arrays.

    Args:
        transcript (List[Dict]): List of transcript entries.

    Returns:
        Dict: Summary and action items as arrays.
    """
    # Combine all text for processing
    full_text = "\n".join([f"{seg['dialogue']}" for seg in transcript])

    # Generate summary and action items
    meeting_summary_array = generate_meeting_summary_array(full_text)
    action_items_array = generate_action_items_array(full_text)

    return {
        "summary": meeting_summary_array,
        "action_items": action_items_array
    }
