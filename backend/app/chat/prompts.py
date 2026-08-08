from app.chat.retail_context import (
    STORE_NAME,
    STORE_DESCRIPTION,
    AVAILABLE_SERVICES,
    SUPPORTED_PRODUCT_CATEGORIES,
    SYSTEM_RULES,
)


def build_prompt(
    customer_name: str,
    user_message: str,
    visits: int,
    latest_sentiment: str | None,
    conversation_history: str,
):

    return f"""
{SYSTEM_RULES}

Store Name:
{STORE_NAME}

Store Description:
{STORE_DESCRIPTION}

Available Services:
{", ".join(AVAILABLE_SERVICES)}

Supported Categories:
{", ".join(SUPPORTED_PRODUCT_CATEGORIES)}

Customer Information

Name: {customer_name}
Visits: {visits}
Latest Sentiment: {latest_sentiment}

Previous Conversation

{conversation_history}

--------------------

Current Customer Question

{user_message}

Customer Question

{user_message}
"""