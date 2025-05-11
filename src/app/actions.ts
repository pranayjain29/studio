// @ts-nocheck
'use server';

const AMAZON_WEBHOOK_URL = 'https://scrappy.app.n8n.cloud/webhook-test/7b1cfaf5-0f01-4b7e-95dd-8c38fd4fac1c';
const FLIPKART_WEBHOOK_URL = 'https://scrappy.app.n8n.cloud/webhook-test/264ad665-67c1-4a57-ac0e-9a8d0396b396';

interface AmazonActionResult {
  success: boolean;
  message: string;
  searchedKeyword: string;
  emailSentTo?: string;
}

export async function searchAmazonProduct(keyword: string, email: string): Promise<AmazonActionResult> {
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
    const response = await fetch(AMAZON_WEBHOOK_URL, {
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

interface FlipkartActionResult {
  success: boolean;
  message: string;
  searchedFsns: string;
  emailSentTo?: string;
}

export async function searchFlipkartProduct(fsns: string, email: string): Promise<FlipkartActionResult> {
  if (!fsns || fsns.trim() === '') {
    return {
      success: false,
      message: 'FSNs cannot be empty.',
      searchedFsns: fsns,
    };
  }
   if (!email || email.trim() === '') {
    return {
      success: false,
      message: 'Email address cannot be empty.',
      searchedFsns: fsns,
    };
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return {
        success: false,
        message: 'Invalid email address format.',
        searchedFsns: fsns,
        emailSentTo: email,
    };
  }

  try {
    const response = await fetch(FLIPKART_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ fsns, email }),
    });

    if (response.ok) {
      return {
        success: true,
        message: `We've started scraping Flipkart for the provided FSNs. The results will be sent to ${email} shortly.`,
        searchedFsns: fsns,
        emailSentTo: email,
      };
    } else {
      const errorBody = await response.text();
      console.error(`Webhook error for FSNs "${fsns}" and email "${email}": ${response.status} ${response.statusText}`, errorBody);
      return {
        success: false,
        message: `Could not process request for FSNs '${fsns}'. The server responded with status ${response.status}. Please try again.`,
        searchedFsns: fsns,
        emailSentTo: email,
      };
    }
  } catch (error) {
    console.error(`Network or unexpected error for FSNs "${fsns}" and email "${email}":`, error);
    return {
      success: false,
      message: `An unexpected error occurred while searching for FSNs '${fsns}'. Please check your connection and try again.`,
      searchedFsns: fsns,
      emailSentTo: email,
    };
  }
}

