from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

import time
import os
from dotenv import load_dotenv

import google.generativeai as gemini

# load .env
load_dotenv()

origins = [
    # "http://192.168.0.13:3000", # url을 등록해도 되고
    "*"  # private 영역에서 사용한다면 *로 모든 접근을 허용할 수 있다.
]

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,  # cookie 포함 여부를 설정한다. 기본은 False
    allow_methods=["*"],     # 허용할 method를 설정할 수 있으며, 기본값은 'GET'이다.
    allow_headers=["*"],	 # 허용할 http header 목록을 설정할 수 있으며 Content-Type, Accept, Accept-Language, Content-Language은 항상 허용된다.
)

gemini.configure(api_key=os.environ.get('GEMINI_API_KEY'))
model = gemini.GenerativeModel('gemini-1.5-flash')


with open("./prompt.txt", "r", encoding='utf-8') as f:
    DEFAULT_PROMPT = f.read()


class Data(BaseModel):
    title: str
    content: str


@app.post("/summary")
async def create_item(article: Data):
    prompt = DEFAULT_PROMPT
    response = model.generate_content(
        prompt
        .replace("{{TITLE}}", article.title)
        .replace("{{ARTICLE}}", article.content))

    return response.text.replace("\n", "")


@app.post("/dummy")
async def create_item(article: Data):
    time.sleep(2)
    return "<!-- HTML START --><div id='ggt-summaries'><h3>기사 요약 더미</h3><p>LG유플러스는 140만명 구독자를 보유한 유튜버 '미미미누'와 함께 '터트립' 시즌2 '터트립플러스'를 제작하여 6일부터 공개한다.  </p><p>'터트립플러스'는 청년 고객들이 직접 참여하여 LG유플러스 네트워크 품질을 체험하는 콘텐츠로,  대학 축제, 야구장 등을 방문하여 미션 수행, 인터뷰 등을 진행한다. </p><p>LG유플러스는 '터트립플러스'를 통해 청년 고객의 목소리를 담아 차별화된 네트워크 서비스를 제공할 계획이다. </p></div><div id='ggt-topics'><h3>주요 주제</h3><li>유튜브 콘텐츠 '터트립' 시즌2</li><li>LG유플러스 네트워크 품질 체험</li><li>청년 고객과의 소통</li><li>차별화된 네트워크 서비스 제공</li></div><div id='ggt-keywords'><p>LG유플러스</p><p>터트립</p><p>미미미누</p><p>청년_고객</p><p>네트워크_품질</p></div><!-- HTML END -->"
