import requests
import keys
from typing import Dict

API_TOKEN = keys.huggingface_api_key
API_URL = "https://api-inference.huggingface.co/models/speechbrain/urbansound8k_ecapa"
headers = {"Authorization": f"Bearer {API_TOKEN}"}

ko_dict = {
    "dog_bark": "개",
    "children_playing": "어린이",
    "air_conditioner": "에어컨",
    "street_music": "음악",
    "gun_shot": "총",
    "siren": "사이렌",
    "engine_idling": "엔진",
    "jackhammer": "착암기",
    "drilling": "드릴",
    "car_horn": "자동차 경적"
}

def query(audio_data: bytes) -> Dict:
    response = requests.post(API_URL, headers=headers, data=audio_data)
    return response.json()

def query_with_memory(audio_data: bytes):
    logger.info("api 요청")
    output = query(audio_data)
    for result in output:
        if result['label'] in ko_dict:
            logger.info(f"결과 = {result}")
            return ko_dict[result['label']]
    return None
