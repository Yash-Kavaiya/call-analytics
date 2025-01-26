// app/analytics/api/analyze/route.ts
import { NextResponse } from 'next/server';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';

// Types for our analysis response
interface Speaker {
  id: string;
  talkTime: number;
  talkTimePercentage: number;
  interruptions: number;
  averagePace: 'Slow' | 'Medium' | 'Fast';
  keywords: string[];
  sentiment: 'Very Negative' | 'Negative' | 'Neutral' | 'Positive' | 'Very Positive';
  questions: number;
  fillers: number;
  longPauses: number;
}

interface ConversationFlow {
  turnTakingScore: number;
  silences: {
    count: number;
    averageDuration: number;
    totalDuration: number;
  };
  overlaps: {
    count: number;
    totalDuration: number;
  };
  paceChanges: number;
}

interface ContentAnalysis {
  topics: {
    name: string;
    occurrences: number;
    relatedKeywords: string[];
  }[];
  actionItems: {
    description: string;
    assignee?: string;
    priority: 'Low' | 'Medium' | 'High';
  }[];
  decisions: {
    description: string;
    timestamp: number;
  }[];
  questions: {
    text: string;
    speaker: string;
    answered: boolean;
  }[];
}

interface EmotionalAnalysis {
  overall: {
    positive: number;
    neutral: number;
    negative: number;
  };
  timeline: {
    timestamp: number;
    sentiment: 'Positive' | 'Neutral' | 'Negative';
    intensity: number;
  }[];
  keyMoments: {
    timestamp: number;
    type: 'Excitement' | 'Frustration' | 'Agreement' | 'Disagreement';
    description: string;
  }[];
}

interface CallAnalysis {
  metadata: {
    duration: number;
    speakerCount: number;
    timestamp: string;
    quality: {
      audioQuality: number;
      backgroundNoise: number;
      clarity: number;
    };
  };
  speakers: Speaker[];
  conversationFlow: ConversationFlow;
  contentAnalysis: ContentAnalysis;
  emotionalAnalysis: EmotionalAnalysis;
}

export async function POST(request: Request): Promise<NextResponse> {
  try {
    // Get the form data from the request
    const formData = await request.formData();
    const audioFile = formData.get('audio') as File;

    if (!audioFile) {
      return NextResponse.json(
        { error: 'No audio file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!audioFile.type.startsWith('audio/')) {
      return NextResponse.json(
        { error: 'Invalid file type. Please upload an audio file.' },
        { status: 400 }
      );
    }

    // Initialize Gemini AI
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Convert audio to text (you'll need to implement this)
    const transcript = await processAudioToText(audioFile);

    // Create analysis prompt
    const prompt = generateAnalysisPrompt(transcript);

    // Get analysis from Gemini
    const result = await analyzeWithGemini(model, prompt);

    // Process and structure the analysis
    const structuredAnalysis = processAnalysis(result);

    return NextResponse.json(structuredAnalysis);

  } catch (error) {
    console.error('Error in analysis:', error);
    return NextResponse.json(
      { error: 'Failed to analyze audio' },
      { status: 500 }
    );
  }
}

async function processAudioToText(audioFile: File): Promise<string> {
  // Implement audio to text conversion
  // You might want to use a service like AssemblyAI, Google Speech-to-Text, etc.
  // For now, we'll return a mock transcript
  return `
    Speaker A: Hi, how are you today?
    Speaker B: I'm doing well, thanks for asking. I wanted to discuss the new project timeline.
    Speaker A: Of course, what's on your mind?
    Speaker B: I think we might need to adjust our delivery dates.
  `;
}

function generateAnalysisPrompt(transcript: string): string {
  return `
Analyze this conversation transcript and provide a detailed analysis covering:

1. Speaker Analysis
- Identify each unique speaker
- Calculate talk time and percentage for each
- Note interruptions and overlapping speech
- Assess speaking pace and patterns
- Identify key topics and keywords per speaker
- Evaluate sentiment and emotional state
- Count questions asked
- Note filler words and long pauses

2. Conversation Flow
- Score turn-taking effectiveness
- Analyze silences (count, duration)
- Track overlapping speech
- Note pace changes and dynamics

3. Content Analysis
- Identify main topics and themes
- Extract action items and assignments
- Document key decisions made
- List questions (answered and unanswered)
- Note follow-up items

4. Emotional Analysis
- Calculate overall emotional tone
- Track sentiment changes over time
- Identify key emotional moments
- Note agreements and disagreements

Transcript:
${transcript}

Provide the analysis in a structured format that can be parsed into a JSON object.
`;
}

async function analyzeWithGemini(model: any, prompt: string) {
  const chat = model.startChat({
    generationConfig: {
      temperature: 0.7,
      topP: 0.8,
      topK: 40,
      maxOutputTokens: 8192,
    },
    safetySettings: [
      {
        category: HarmCategory.HARASSMENT,
        threshold: HarmBlockThreshold.MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HATE_SPEECH,
        threshold: HarmBlockThreshold.MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.SEXUALLY_EXPLICIT,
        threshold: HarmBlockThreshold.MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.DANGEROUS_CONTENT,
        threshold: HarmBlockThreshold.MEDIUM_AND_ABOVE,
      },
    ],
  });

  const result = await chat.sendMessage(prompt);
  return result.response.text();
}

function processAnalysis(rawAnalysis: string): CallAnalysis {
  // Process the raw analysis text and convert it to structured data
  // This is a simplified example - you'll need to parse the actual Gemini response
  return {
    metadata: {
      duration: 300, // 5 minutes in seconds
      speakerCount: 2,
      timestamp: new Date().toISOString(),
      quality: {
        audioQuality: 0.95,
        backgroundNoise: 0.02,
        clarity: 0.98,
      },
    },
    speakers: [
      {
        id: "Speaker A",
        talkTime: 150,
        talkTimePercentage: 50,
        interruptions: 1,
        averagePace: "Medium",
        keywords: ["project", "timeline", "delivery"],
        sentiment: "Positive",
        questions: 2,
        fillers: 3,
        longPauses: 1,
      },
      {
        id: "Speaker B",
        talkTime: 150,
        talkTimePercentage: 50,
        interruptions: 0,
        averagePace: "Medium",
        keywords: ["dates", "adjustment", "delivery"],
        sentiment: "Neutral",
        questions: 1,
        fillers: 2,
        longPauses: 2,
      },
    ],
    conversationFlow: {
      turnTakingScore: 0.85,
      silences: {
        count: 4,
        averageDuration: 1.5,
        totalDuration: 6,
      },
      overlaps: {
        count: 1,
        totalDuration: 2,
      },
      paceChanges: 3,
    },
    contentAnalysis: {
      topics: [
        {
          name: "Project Timeline",
          occurrences: 3,
          relatedKeywords: ["delivery", "dates", "adjustment"],
        },
      ],
      actionItems: [
        {
          description: "Review delivery dates",
          assignee: "Speaker A",
          priority: "High",
        },
      ],
      decisions: [
        {
          description: "Timeline needs adjustment",
          timestamp: 120,
        },
      ],
      questions: [
        {
          text: "How are you today?",
          speaker: "Speaker A",
          answered: true,
        },
      ],
    },
    emotionalAnalysis: {
      overall: {
        positive: 60,
        neutral: 35,
        negative: 5,
      },
      timeline: [
        {
          timestamp: 0,
          sentiment: "Positive",
          intensity: 0.8,
        },
      ],
      keyMoments: [
        {
          timestamp: 120,
          type: "Agreement",
          description: "Agreement on timeline review",
        },
      ],
    },
  };
}