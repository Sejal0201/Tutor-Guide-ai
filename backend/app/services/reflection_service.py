from openai import OpenAI

client = OpenAI()

def generate_reflection(transcript):

    prompt = f"""
    Generate a tutoring reflection report.

    Transcript:

    {transcript}

    Include:

    - Summary
    - Strengths
    - Areas For Improvement
    - Coaching Score
    """

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ]
    )

    return response.choices[0].message.content