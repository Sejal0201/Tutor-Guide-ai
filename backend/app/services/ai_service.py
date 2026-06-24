# import os
# import google.generativeai as genai

# from dotenv import load_dotenv

# load_dotenv()

# genai.configure(
#     api_key=os.getenv("GROQ_API_KEY")
# )

# model = genai.GenerativeModel(
#     "gemini-2.5-flash"
# )


# def generate_hint(transcript: str):

#     prompt = f"""
#     You are an expert tutoring coach.

#     Transcript:
#     {transcript}

#     Generate one helpful hint
#     the tutor can give next.

#     Keep it under 50 words.
#     """

#     response = model.generate_content(prompt)

#     return response.text


# def detect_misconception(transcript: str):

#     prompt = f"""
#     Analyze the transcript.

#     Identify the student's misconception.

#     Transcript:
#     {transcript}

#     Return only the misconception.
#     """

#     response = model.generate_content(prompt)

#     return response.text


# def recommend_next_step(transcript: str):

#     prompt = f"""
#     Transcript:
#     {transcript}

#     What should the tutor do next?

#     Give one actionable recommendation.
#     """

#     response = model.generate_content(prompt)

#     return response.text


# def reflection_report(transcript: str):

#     prompt = f"""
#     Generate a tutoring reflection report.

#     Transcript:
#     {transcript}

#     Include:

#     1. Summary
#     2. Strengths
#     3. Areas for Improvement
#     4. Coaching Score /10
#     """

#     response = model.generate_content(prompt)

#     return response.text

import os

from groq import Groq
from dotenv import load_dotenv

load_dotenv()

client = Groq(
    api_key=os.getenv("GROQ_API_KEY")
)

MODEL = "llama-3.3-70b-versatile"


def ask_llm(prompt: str):

    response = client.chat.completions.create(
        model=MODEL,
        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ],
        temperature=0.4
    )

    return (
        response
        .choices[0]
        .message
        .content
    )


def generate_hint(transcript: str):

    prompt = f"""
You are an expert tutoring coach.

Transcript:
{transcript}

Generate ONE tutoring hint.

Maximum 50 words.
"""

    return ask_llm(prompt)


def detect_misconception(transcript: str):

    prompt = f"""
Transcript:
{transcript}

Identify the student's misconception.

Return only the misconception.
"""

    return ask_llm(prompt)


def recommend_next_step(transcript: str):

    prompt = f"""
Transcript:
{transcript}

What should the tutor do next?

Return one actionable recommendation.
"""

    return ask_llm(prompt)


def reflection_report(transcript: str):

    prompt = f"""
Analyze this tutoring session.

Transcript:
{transcript}

Provide:

1. Summary
2. Strengths
3. Areas for Improvement
4. Coaching Score out of 10
"""

    return ask_llm(prompt)

def generate_reflection(transcript: str):

    prompt = f"""
You are an expert tutor coach.

Analyze this tutoring session.

Transcript:
{transcript}

Return in this format:

Summary:
...

Strengths:
...

Areas for Improvement:
...

Coaching Score:
x/10
"""

    return ask_llm(prompt)