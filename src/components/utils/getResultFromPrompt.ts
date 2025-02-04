import type { Result } from "../context/results";

export async function getResultFromPrompt(
  prompt: string,
  endpoint: string,
  context?: string
): Promise<Result> {
  let result = null;
  try {
    const response = await makeApiRequest(prompt, endpoint, context);
    result = await handleApiResponse(response);
  } catch (e) {
    if (e instanceof Error) {
      result = handleError(e.message);
    } else {
      result = handleError("An error occurred while fetching the response");
    }
  }

  return result;
}

async function makeApiRequest(
  prompt: string,
  endpoint: string,
  context?: string
): Promise<Response> {
  return fetch(endpoint, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({ query: prompt, context }),
  });
}

async function parseResponse(response: Response) {
  return (await response.json()) as {
    success: boolean;
    answer: string;
    embed: {
      text: string;
      url: string;
      title: string;
      score: number;
    }[];
  };
}

async function handleApiResponse(response: Response): Promise<Result> {
  if (response.status !== 200) {
    throw new Error("Status not 200");
  }

  const data = await parseResponse(response);

  if (!data.success) {
    throw new Error(`Prompt unsuccessful`);
  }

  return {
    text: `Answer: ${data.answer}`,
    type: "assistant",
  };
}

function handleError(message: string): Result {
  return {
    text: `System: ${message}`,
    type: "assistant",
  };
}
