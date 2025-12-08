import { GoogleGenAI } from '@google/genai';

const genAI = new GoogleGenAI({
  apiKey: process.env.GOOGLE_GEMINI_API_KEY!,
});

export interface CallAnalysis {
  sentiment: 'positive' | 'neutral' | 'negative';
  sentimentScore: number;
  topics: string[];
  summary: string;
  keywords: string[];
  qualityScore: number;
  actionItems: string[];
  customerSatisfaction: 'satisfied' | 'neutral' | 'dissatisfied';
  agentPerformance: {
    professionalism: number;
    helpfulness: number;
    clarity: number;
    resolution: number;
  };
}

export async function analyzeCallTranscript(
  transcript: string,
  segments?: Array<{ speaker: string; text: string }>
): Promise<CallAnalysis> {
  const model = 'gemini-2.0-flash';

  const formattedTranscript = segments && segments.length > 0
    ? segments.map(s => `${s.speaker.toUpperCase()}: ${s.text}`).join('\n')
    : transcript;

  const prompt = `You are an expert call analytics AI. Analyze the following customer service call transcript and provide a detailed analysis.

TRANSCRIPT:
${formattedTranscript}

Provide your analysis in the following JSON format (respond ONLY with valid JSON, no markdown):
{
  "sentiment": "positive" | "neutral" | "negative",
  "sentimentScore": <number between 0 and 1, where 1 is most positive>,
  "topics": [<array of main topics discussed>],
  "summary": "<2-3 sentence summary of the call>",
  "keywords": [<array of important keywords from the call>],
  "qualityScore": <number between 1 and 10>,
  "actionItems": [<array of any action items or follow-ups needed>],
  "customerSatisfaction": "satisfied" | "neutral" | "dissatisfied",
  "agentPerformance": {
    "professionalism": <1-10>,
    "helpfulness": <1-10>,
    "clarity": <1-10>,
    "resolution": <1-10>
  }
}

Analyze the conversation carefully considering:
- Overall tone and sentiment of both parties
- Key topics and issues discussed
- How well the agent handled the customer's needs
- Any unresolved issues or required follow-ups
- Quality of communication and professionalism`;

  try {
    const response = await genAI.models.generateContent({
      model,
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
    });

    const text = response.text || '';
    
    // Extract JSON from response (handle potential markdown code blocks)
    let jsonStr = text;
    if (text.includes('```json')) {
      jsonStr = text.split('```json')[1].split('```')[0].trim();
    } else if (text.includes('```')) {
      jsonStr = text.split('```')[1].split('```')[0].trim();
    }

    const analysis = JSON.parse(jsonStr) as CallAnalysis;
    
    // Validate and normalize the response
    return {
      sentiment: ['positive', 'neutral', 'negative'].includes(analysis.sentiment) 
        ? analysis.sentiment 
        : 'neutral',
      sentimentScore: Math.max(0, Math.min(1, analysis.sentimentScore || 0.5)),
      topics: Array.isArray(analysis.topics) ? analysis.topics : [],
      summary: analysis.summary || 'No summary available',
      keywords: Array.isArray(analysis.keywords) ? analysis.keywords : [],
      qualityScore: Math.max(1, Math.min(10, analysis.qualityScore || 5)),
      actionItems: Array.isArray(analysis.actionItems) ? analysis.actionItems : [],
      customerSatisfaction: ['satisfied', 'neutral', 'dissatisfied'].includes(analysis.customerSatisfaction)
        ? analysis.customerSatisfaction
        : 'neutral',
      agentPerformance: {
        professionalism: Math.max(1, Math.min(10, analysis.agentPerformance?.professionalism || 5)),
        helpfulness: Math.max(1, Math.min(10, analysis.agentPerformance?.helpfulness || 5)),
        clarity: Math.max(1, Math.min(10, analysis.agentPerformance?.clarity || 5)),
        resolution: Math.max(1, Math.min(10, analysis.agentPerformance?.resolution || 5)),
      },
    };
  } catch (error) {
    console.error('Gemini analysis error:', error);
    throw new Error('Failed to analyze call transcript');
  }
}

export async function generateCallReport(
  transcript: string,
  analysis: CallAnalysis
): Promise<string> {
  const model = 'gemini-2.0-flash';

  const prompt = `Generate a professional, detailed report for the following customer service call.

TRANSCRIPT:
${transcript}

ANALYSIS DATA:
${JSON.stringify(analysis, null, 2)}

Create a well-formatted report that includes:
1. Executive Summary
2. Call Overview (duration context, participants)
3. Key Discussion Points
4. Sentiment Analysis Summary
5. Agent Performance Review
6. Action Items & Recommendations
7. Quality Score Breakdown

Format the report in clean markdown with headers and bullet points.`;

  try {
    const response = await genAI.models.generateContent({
      model,
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
    });

    return response.text || 'Report generation failed';
  } catch (error) {
    console.error('Report generation error:', error);
    throw new Error('Failed to generate call report');
  }
}
