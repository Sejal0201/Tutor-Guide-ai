from pydantic import BaseModel

class AnalysisRequest(BaseModel):
    transcript: str