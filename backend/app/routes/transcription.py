# from fastapi import APIRouter, UploadFile, File
# from app.services.transcription_service import transcribe_audio
# import shutil
# import os

# router = APIRouter(
#     prefix="/transcript",
#     tags=["Transcription"]
# )

# UPLOAD_DIR = "uploads"

# os.makedirs(UPLOAD_DIR, exist_ok=True)

# @router.post("/upload")
# async def upload_audio(
#     file: UploadFile = File(...)
# ):
    
#     file_path = f"{UPLOAD_DIR}/{file.filename}"

#     with open(file_path, "wb") as buffer:
#         shutil.copyfileobj(
#             file.file,
#             buffer
#         )

#     transcript = transcribe_audio(
#         file_path
#     )

#     return {
#         "filename": file.filename,
#         "transcript": transcript
#     }

from fastapi import APIRouter, UploadFile, File
from app.services.transcription_service import transcribe_audio

import os
import shutil
import traceback

router = APIRouter(
    prefix="/transcript",
    tags=["Transcript"]
)

UPLOAD_DIR = "uploads"

os.makedirs(
    UPLOAD_DIR,
    exist_ok=True
)

@router.post("/upload")
async def upload_audio(
    file: UploadFile = File(...)
):

    try:

        file_path = os.path.join(
            UPLOAD_DIR,
            file.filename
        )

        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(
                file.file,
                buffer
            )

        if not os.path.exists(file_path):
            return {
                "error": "File was not saved"
            }

        transcript = transcribe_audio(
            file_path
        )

        return {
            "success": True,
            "filename": file.filename,
            "transcript": transcript
        }

    except Exception as e:

        print("\n========== ERROR ==========")
        print(traceback.format_exc())
        print("===========================\n")

        return {
            "success": False,
            "error": str(e)
        }