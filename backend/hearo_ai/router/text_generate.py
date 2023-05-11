from fastapi import APIRouter, Form
from typing_extensions import Annotated

import openai
import keys

from main import logger


router = APIRouter(prefix="/tg")


@router.get("/test")
async def root():
    logger.info("root: tg router api 호출")
    return {"message": "hearo!"}


openai.api_key = keys.openai_api_key


async def generate_sentence(text):
    prompt = f'''
    다음 텍스트에 적절한 대답을 5개 생성해서 형식에 맞게 돌려줘.
    텍스트: {text}
    형식: 1.답변/2.답변/3.답변/4.답변/5.답변
    '''

    # GPT engine : "text-davinci-002"
    response = openai.Completion.create(
        engine="text-davinci-002",
        prompt=prompt,
        max_tokens=1000,
        n=1,
        stop=None,
        temperature=0.7,
        top_p=1
    )
    result = response.choices[0].text.strip()

    # GPT engine : "gpt-3.5-turbo"
    # response = openai.ChatCompletion.create(
    #     model=engine,
    #     messages=[{"role": "user", "content": prompt},],
    #     max_tokens=1000,
    #     n=5,
    #     temperature=0.7,
    #     top_p=1,
    # )
    # result = response.choices[0].message['content'].strip()

    result = list(result.split('/'))
    logger.debug(result)
    result = [string[2:] for string in result]

    return result


@router.post("/generate")
async def generate(text: Annotated[str, Form()]):
    logger.info(f"generate: 답변 문장 추천 api 호출 - {text}")

    while True:
        result = await generate_sentence(text)
        if len(result) == 5:
            break
    
    return result
