import os

from google import genai

from app.core.config import settings


client = genai.Client(
    api_key=settings.GEMINI_API_KEY
)


def ask_gemini(prompt: str) -> str:
    """
    Sends a fully prepared prompt to Gemini
    and returns the generated response.
    """

    try:

        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt,
        )

        if response.text:
            return response.text.strip()

        return (
            "I'm sorry, I couldn't generate a response."
        )

    except Exception as e:

        print(e)

        return (
            "I'm currently unable to access the AI assistant. "
            "Please try again later."
        )