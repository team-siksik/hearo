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


app.include_router(router)
