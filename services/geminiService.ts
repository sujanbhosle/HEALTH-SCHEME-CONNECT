
export const getChatbotResponse = async (history: {role: string, parts: {text: string}[]}[], newMessage: string): Promise<string> => {
  try {
    const response = await fetch('/api/ai/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ history, message: newMessage }),
    });

    if (!response.ok) {
      throw new Error('AI request failed');
    }

    const data = await response.json();
    return data.response;
  } catch (error) {
    console.error("Error fetching response from backend AI service:", error);
    return "Sorry, I'm having trouble connecting to my brain right now. Please try again later.";
  }
};
