import whisper
import shutil

print("FFMPEG PATH:", shutil.which("ffmpeg"))

model = whisper.load_model("tiny")

def transcribe_audio(file_path: str):

    print("FILE:", file_path)
    print("EXISTS:", file_path)

    result = model.transcribe(file_path)

    return result["text"]