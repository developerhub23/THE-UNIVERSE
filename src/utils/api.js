const API_BASE = import.meta.env.VITE_API_BASE_URL || '';
const spaceflightBase = import.meta.env.VITE_SPACEFLIGHT_NEWS_API || 'https://api.spaceflightnewsapi.net/v4';

// Production fallback: if no backend, return mock data
export const fetchSpaceNews = async (limit = 12) => {
  try {
    const response = await fetch(`${spaceflightBase}/articles?_limit=${limit}&_sort=published_at:desc`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    return data.results || data;
  } catch (error) {
    console.error('Error fetching space news:', error);
    // Return mock data for production
    return [
      { id: 1, title: "NASA's Artemis II Mission", summary: "Crew revealed for lunar flyby", published_at: new Date().toISOString(), image_url: "https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=400", news_site: "NASA" },
      { id: 2, title: "James Webb Captures New Galaxy", summary: "Unprecedented images of distant galaxies", published_at: new Date(Date.now() - 86400000).toISOString(), image_url: "https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?w=400", news_site: "Space.com" },
      { id: 3, title: "Mars Rover Discovery", summary: "New evidence of ancient water on Mars", published_at: new Date(Date.now() - 172800000).toISOString(), image_url: "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=400", news_site: "NASA JPL" },
      { id: 4, title: "SpaceX Starship Launch", summary: "Successful orbital test flight completed", published_at: new Date(Date.now() - 259200000).toISOString(), image_url: "https://images.unsplash.com/photo-1574169208507-84376144848b?w=400", news_site: "SpaceX" }
    ];
  }
};

// Production fallback: if no backend, return mock response
export const sendChatMessage = async (message, model = 'mistral') => {
  try {
    if (!API_BASE) {
      throw new Error('AI backend not configured');
    }
    const response = await fetch(`${API_BASE}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, model })
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Failed to send message');
    }
    return await response.json();
  } catch (error) {
    console.error('Error sending chat message:', error);
    // Return mock response for production
    return {
      response: "I'm currently offline. THE UNIVERSE AI Guide requires a backend server to function. For full AI capabilities, please run the server locally.",
      model: 'mistral'
    };
  }
};

export const streamChatMessage = async (message, model = 'mistral', onChunk) => {
  try {
    if (!API_BASE) {
      throw new Error('AI backend not configured');
    }
    const response = await fetch(`${API_BASE}/api/chat/stream`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, model })
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Failed to stream message');
    }
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const chunk = decoder.decode(value, { stream: true });
      if (chunk) onChunk(chunk);
    }
  } catch (error) {
    console.error('Error streaming chat message:', error);
    // Send mock streaming response
    const mockResponse = "I'm currently offline. THE UNIVERSE AI Guide requires a backend server for streaming responses.";
    for (let i = 0; i < mockResponse.length; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 50));
      onChunk(mockResponse.slice(i, i + 10));
    }
    onChunk('');
  }
};