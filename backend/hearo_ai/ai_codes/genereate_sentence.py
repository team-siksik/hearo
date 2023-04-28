import openai
import keys

openai.api_key = keys.openai_api_key

def run_generate_sentence(text, location = ''):
    print('입력된 텍스트', text)
    response = openai.Completion.create(
        engine="text-davinci-002",
        prompt=f'{text}에 대해 적절한 답변을 구어체로 작성해서 형식에 맞게 줘.\n형식: 1.답변, 2.답변, 3.답변, 4.답변, 5.답변',
        max_tokens=1000,
        n=1,
        stop=None,
        temperature=0.7,
        top_p=1
    )
    result = response.choices[0].text.strip()
    result = list(result.split('\n'))
    result = [string[3:] for string in result]
    return result

def run_generate_sentence_gpt3_5(text):
    print('입력된 텍스트 :', text)
    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "user", "content": f"다음 텍스트에 적절한 답변을 5개 생성해서 형식에 맞게 돌려줘.\n텍스트: {text}\n형식: 1.답변, 2.답변, 3.답변, 4.답변, 5.답변"},
        ],
        max_tokens=1000,
        n=5,
        temperature=0.7,
        top_p=1,
    )

    result = response.choices[0].message['content'].strip()
    result = list(result.split('\n'))
    result = [string[3:] for string in result]
    return result