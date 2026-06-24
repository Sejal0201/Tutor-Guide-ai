# from fastapi import APIRouter

# router = APIRouter(
#     prefix="/ai",
#     tags=["AI"]
# )


# from app.schemas.analysis import AnalysisRequest

# @router.post("/hint")
# def generate_hint(data: AnalysisRequest):

#     return {
#         "hint":
#         f"Hint generated from transcript: {data.transcript[:50]}"
#     }

#     # return {
#     #     "hint": "Ask the student what operation is happening on both sides of the equation."
#     # }


# @router.post("/misconception")
# def detect_misconception():

#     return {
#         "misconception":
#         "Student appears to confuse sign changes with moving terms."
#     }


# @router.post("/next-step")
# def next_step():

#     return {
#         "next_step":
#         "Encourage the student to explain the transformation verbally."
#     }


# @router.post("/practice")
# def practice_problem():

#     return {
#         "problem":
#         "Solve: 3x + 5 = 20"
#     }

from fastapi import APIRouter
from pydantic import BaseModel

from app.schemas.analysis import AnalysisRequest
from app.services.ai_service import ask_llm
from app.services.ai_service import (
    generate_hint,
    detect_misconception,
    recommend_next_step,
    reflection_report
)

router = APIRouter(
    prefix="/ai",
    tags=["AI"]
)

class CoachChatRequest(BaseModel):
    question: str
    transcript: str
class HintRequest(BaseModel):
    transcript: str
@router.post("/hint")
def hint(data: HintRequest):

    hint = generate_hint(
        data.transcript
    )

    return {
        "hint": hint
    }  

@router.post("/misconception")
def misconception(data: AnalysisRequest):

    return {
        "misconception":
        detect_misconception(
            data.transcript
        )
    }

@router.post("/next-step")
def next_step(data: AnalysisRequest):

    return {
        "next_step":
        recommend_next_step(
            data.transcript
        )
    }

@router.post("/reflection")
def reflection(data: AnalysisRequest):

    return {
        "report":
        reflection_report(
            data.transcript
        )
    }

@router.post("/coach-chat")
def coach_chat(data: CoachChatRequest):

    prompt = f"""
You are an expert tutor coach.

Session Transcript:
{data.transcript}

Tutor Question:
{data.question}

Provide practical teaching advice.
"""

    response = ask_llm(prompt)

    return {
        "response": response
    }