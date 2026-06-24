from pydantic import BaseModel

class UrlUploadRequest(BaseModel):
    url: str