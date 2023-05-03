from fastapi import FastAPI, logger
import asyncio
import time

app = FastAPI()


@app.get("/")
async def root():
    return {"message": "Hearo~!"}


@app.get("/async-test")
async def root():
    await asyncio.sleep(3)
    now = time.strftime('%Y-%m-%d %H:%M:%S')
    print(now)
    logger.info()
    return {"message": now}

