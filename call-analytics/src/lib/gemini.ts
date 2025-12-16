import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.NVIDIA_API_KEY!,
  baseURL: 'https://integrate.api.nvidia.com/v1',
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
  const formattedTranscript = segments && segments.length > 0
    ? segments.map(s => `${s.speaker.toUpperCase()}: ${s.text}`).join('\n')
    : transcript;

  // Truncate very long transcripts to avoid token limits
  const maxLength = 25000;
  const truncatedTranscript = formattedTranscript.length > maxLength
    ? formattedTranscript.substring(0, maxLength) + '\n[Transcript truncated...]'
    : formattedTranscript;

  const prompt = `You are an expert call analytics AI. Analyze the following customer service call transcript and provide a detailed analysis.

TRANSCRIPT:
${truncatedTranscript}

Provide your analysis in the following JSON format (respond ONLY with valid JSON, no markdown code blocks):
{
  "sentiment": "positive" or "neutral" or "negative",
  "sentimentScore": <number between 0 and 1, where 1 is most positive>,
  "topics": [<array of main topics discussed>],
  "summary": "<2-3 sentence summary of the call>",
  "keywords": [<array of important keywords from the call>],
  "qualityScore": <number between 1 and 10>,
  "actionItems": [<array of any action items or follow-ups needed>],
  "customerSatisfaction": "satisfied" or "neutral" or "dissatisfied",
  "agentPerformance": {
    "professionalism": <1-10>,
    "helpfulness": <1-10>,
    "clarity": <1-10>,
    "resolution": <1-10>
  }
}`;

  try {
    const completion = await openai.chat.completions.create({
      model: "nvidia/llama-3.1-nemotron-70b-instruct",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3,
      max_tokens: 2048,
    });

    const text = completion.choices[0]?.message?.content || '{}';
    
    // Extract JSON from response (handle potential markdown code blocks)
    let jsonStr = text;
    const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) {
      jsonStr = jsonMatch[1].trim();
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
    console.error('NVIDIA AI analysis error:', error);
    
    // Return default analysis if API fails
    return getDefaultAnalysis(transcript);
  }
}

// Fallback analysis when AI is unavailable
function getDefaultAnalysis(transcript: string): CallAnalysis {
  const wordCount = transcript.split(/\s+/).length;
  const hasPositiveWords = /thank|great|excellent|happy|pleased|wonderful/i.test(transcript);
  const hasNegativeWords = /angry|frustrated|terrible|awful|disappointed|problem/i.test(transcript);
  
  let sentiment: 'positive' | 'neutral' | 'negative' = 'neutral';
  let sentimentScore = 0.5;
  
  if (hasPositiveWords && !hasNegativeWords) {
    sentiment = 'positive';
    sentimentScore = 0.7;
  } else if (hasNegativeWords && !hasPositiveWords) {
    sentiment = 'negative';
    sentimentScore = 0.3;
  }

  return {
    sentiment,
    sentimentScore,
    topics: ['General Inquiry'],
    summary: `Call transcript with approximately ${wordCount} words. Analysis pending.`,
    keywords: [],
    qualityScore: 5,
    actionItems: ['Review call manually for detailed analysis'],
    customerSatisfaction: 'neutral',
    agentPerformance: {
      professionalism: 5,
      helpfulness: 5,
      clarity: 5,
      resolution: 5,
    },
  };
}

export async function generateCallReport(
  transcript: string,
  analysis: CallAnalysis
): Promise<string> {
  const prompt = `Generate a professional, detailed report for the following customer service call.

TRANSCRIPT:
${transcript.substring(0, 12000)}

ANALYSIS DATA:
${JSON.stringify(analysis, null, 2)}

Create a well-formatted report that includes:
1. Executive Summary
2. Call Overview
3. Key Discussion Points
4. Sentiment Analysis Summary
5. Agent Performance Review
6. Action Items & Recommendations

Format the report in clean markdown with headers and bullet points.`;

  try {
    const completion = await openai.chat.completions.create({
      model: "nvidia/llama-3.1-nemotron-70b-instruct",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.5,
      max_tokens: 4096,
    });

    return completion.choices[0]?.message?.content || 'Report generation failed';
  } catch (error) {
    console.error('Report generation error:', error);
    
    // Return a basic report if API fails
    return `# Call Analysis Report

## Executive Summary
${analysis.summary}

## Sentiment Analysis
- Overall Sentiment: ${analysis.sentiment}
- Sentiment Score: ${(analysis.sentimentScore * 100).toFixed(0)}%
- Customer Satisfaction: ${analysis.customerSatisfaction}

## Topics Discussed
${analysis.topics.map(t => `- ${t}`).join('\n') || '- General inquiry'}

## Agent Performance
- Professionalism: ${analysis.agentPerformance.professionalism}/10
- Helpfulness: ${analysis.agentPerformance.helpfulness}/10
- Clarity: ${analysis.agentPerformance.clarity}/10
- Resolution: ${analysis.agentPerformance.resolution}/10

## Action Items
${analysis.actionItems.map(a => `- ${a}`).join('\n') || '- No action items identified'}

## Quality Score
Overall Quality: ${analysis.qualityScore}/10
`;
  }
}
