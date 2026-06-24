import whisper

model = None

def get_model():
    global model

    if model is None:
        print("Loading Whisper Tiny Model...")
        model = whisper.load_model("tiny")

    return model


def transcribe_audio(file_path: str):
    model = get_model()

    result = model.transcribe(file_path)

    return result["text"]