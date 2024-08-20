export default class Api {
  protected signal: AbortSignal | null = null;

  async makeRequest<T>(
    link: string,
    method: string = 'GET',
    headers?: HeadersInit,
    body?: object,
    signal?: AbortSignal,
  ): Promise<T> {
    try {
      const response = await fetch(link, {
        method,
        headers,
        body: JSON.stringify(body),
        signal,
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const jsonData = await response.json();

      return jsonData;
    } catch (error) {
      console.error('Error fetching data:', error);
      throw error;
    }
  }
}
