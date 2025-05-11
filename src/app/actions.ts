'use server';

const WEBHOOK_URL = 'https://scrappy.app.n8n.cloud/webhook-test/adde5ac8-17d4-4970-951c-ba16c1356529';

interface ActionResult {
  success: boolean;
  message: string;
  searchedKeyword: string;
  emailSentTo?: string;
}

export async function searchAmazonProduct(keyword: string, email: string): Promise<ActionResult> {
  if (!keyword || keyword.trim() === '') {
    return {
      success: false,
      message: 'Search keyword cannot be empty.',
      searchedKeyword: keyword,
    };
  }
  if (!email || email.trim() === '') {
    return {
      success: false,
      message: 'Email address cannot be empty.',
      searchedKeyword: keyword,
    };
  }
  // Basic email validation (more robust validation is handled by client-side Zod schema)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return {
        success: false,
        message: 'Invalid email address format.',
        searchedKeyword: keyword,
        emailSentTo: email,
    };
  }


  try {
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ keyword, email }),
    });

    if (response.ok) {
      return {
        success: true,
        message: `We've started generating the report for '${keyword}'. It will be sent to ${email} shortly.`,
        searchedKeyword: keyword,
        emailSentTo: email,
      };
    } else {
      const errorBody = await response.text();
      console.error(`Webhook error for keyword "${keyword}" and email "${email}": ${response.status} ${response.statusText}`, errorBody);
      return {
        success: false,
        message: `Could not process request for '${keyword}'. The server responded with status ${response.status}. Please try again.`,
        searchedKeyword: keyword,
        emailSentTo: email,
      };
    }
  } catch (error) {
    console.error(`Network or unexpected error for keyword "${keyword}" and email "${email}":`, error);
    return {
      success: false,
      message: `An unexpected error occurred while searching for '${keyword}'. Please check your connection and try again.`,
      searchedKeyword: keyword,
      emailSentTo: email,
    };
  }
}
