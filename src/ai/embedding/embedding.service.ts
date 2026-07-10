import { GoogleGenerativeAIEmbeddings } from '@langchain/google-genai';
import { Injectable } from '@nestjs/common';

// const embeddings = new GoogleGenerativeAIEmbeddings({
// model: "text-embedding-004"
// });
@Injectable()
export class EmbeddingService {
  constructor() {}
  private readonly embeddings = new GoogleGenerativeAIEmbeddings({
    apiKey: process.env.GOOGLE_API_KEY,
    model: 'gemini-embedding-2',
  });

  async embedDocuments(texts: string[]) {
    return this.embeddings.embedDocuments(texts);
  }

  async embedQuery(text: string) {
    return this.embeddings.embedQuery(text);
  }
}
