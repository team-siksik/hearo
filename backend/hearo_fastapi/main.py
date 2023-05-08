from fastapi import FastAPI, APIRouter
from fastapi.middleware.cors import CORSMiddleware
from fastapi_socketio import SocketManager


router = APIRouter(prefix="/api/v1")

app = FastAPI()

socket_manager = SocketManager(app)

origins = ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@router.get("/")
async def root():
    return {"message": "hearo!"}


from router import sl_recognition, sound_classification, speaker_diarization


router.include_router(sl_recognition.router)
router.include_router(sound_classification.router)
router.include_router(speaker_diarization.router)

app.include_router(router)
