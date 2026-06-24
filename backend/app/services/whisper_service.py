import whisper

print("Loading Whisper Model...")
model = whisper.load_model("tiny")
print("Whisper Model Loaded")

def transcribe_audio(file_path: str):

    print("=" * 50)
    print("Starting transcription...")
    print("File:", file_path)
    print("=" * 50)

    result = model.transcribe(file_path)

    print("=" * 50)
    print("Transcription completed")
    print("Transcript Preview:")
    print(result["text"][:500])
    print("=" * 50)

    return result["text"]