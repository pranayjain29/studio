'use server';

const WEBHOOK_URL = 'https://scrappy.app.n8n.cloud/webhook-test/7b1cfaf5-0f01-4b7e-95dd-8c38fd4fac1c';

interface ActionResult {
  success: boolean;
  message: string;
  searchedKeyword: string;
}

export async function searchAmazonProduct(keyword: string): Promise<ActionResult> {
  if (!keyword || keyword.trim() === '') {
    return {
      success: false,
      message: 'Search keyword cannot be empty.',
      searchedKeyword: keyword,
    };
  }

  try {
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ keyword }),
    });

    if (response.ok) {
      // Assuming a 2xx response means the webhook accepted the request
      // The actual report generation is asynchronous and handled by the webhook service.
      return {
        success: true,
        message: `We've started generating the report for '${keyword}'. It will be sent to your email shortly.`,
        searchedKeyword: keyword,
      };
    } else {
      // Handle non-2xx responses from the webhook
      const errorBody = await response.text();
      console.error(`Webhook error for keyword "${keyword}": ${response.status} ${response.statusText}`, errorBody);
      return {
        success: false,
        message: `Could not process request for '${keyword}'. The server responded with status ${response.status}. Please try again.`,
        searchedKeyword: keyword,
      };
    }
  } catch (error) {
    console.error(`Network or unexpected error for keyword "${keyword}":`, error);
    return {
      success: false,
      message: `An unexpected error occurred while searching for '${keyword}'. Please check your connection and try again.`,
      searchedKeyword: keyword,
    };
  }
}
