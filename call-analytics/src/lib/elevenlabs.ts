import { ElevenLabsClient } from '@elevenlabs/elevenlabs-js';

// Initialize ElevenLabs client
export const elevenlabs = new ElevenLabsClient({
  apiKey: process.env.ELEVENLABS_API_KEY,
});

export interface TranscriptionResult {
  text: string;
  segments: TranscriptionSegment[];
  language: string;
  duration: number;
}

export interface TranscriptionSegment {
  speaker: string;
  text: string;
  startTime: number;
  endTime: number;
}

// Type for ElevenLabs word response
interface ElevenLabsWord {
  text?: string;
  start?: number;
  end?: number;
  speaker_id?: string;
}

// Type for ElevenLabs transcription response
interface ElevenLabsTranscription {
  text?: string;
  words?: ElevenLabsWord[];
  language_code?: string;
}

export async function transcribeAudio(
  audioBuffer: Buffer
): Promise<TranscriptionResult> {
  try {
    // Create a Blob from the buffer for the API
    const blob = new Blob([audioBuffer], { type: 'audio/mpeg' });
    
    const response = await elevenlabs.speechToText.convert({
      file: blob,
      modelId: 'scribe_v1',
      tagAudioEvents: true,
      numSpeakers: 2, // Enable speaker diarization
    });

    // Cast to our expected type
    const transcription = response as unknown as ElevenLabsTranscription;

    // Parse the transcription response
    const segments: TranscriptionSegment[] = [];
    let fullText = '';

    if (transcription.words && Array.isArray(transcription.words)) {
      let currentSpeaker = '';
      let currentText = '';
      let segmentStart = 0;
      let segmentEnd = 0;

      for (const word of transcription.words) {
        const speaker = word.speaker_id || 'unknown';
        
        if (speaker !== currentSpeaker && currentText) {
          // Save previous segment
          segments.push({
            speaker: currentSpeaker === 'speaker_0' ? 'agent' : 
                     currentSpeaker === 'speaker_1' ? 'customer' : 'unknown',
            text: currentText.trim(),
            startTime: segmentStart,
            endTime: segmentEnd,
          });
          currentText = '';
          segmentStart = word.start || 0;
        }

        if (!currentText) {
          segmentStart = word.start || 0;
        }
        
        currentSpeaker = speaker;
        currentText += (word.text || '') + ' ';
        segmentEnd = word.end || 0;
        fullText += (word.text || '') + ' ';
      }

      // Add last segment
      if (currentText) {
        segments.push({
          speaker: currentSpeaker === 'speaker_0' ? 'agent' : 
                   currentSpeaker === 'speaker_1' ? 'customer' : 'unknown',
          text: currentText.trim(),
          startTime: segmentStart,
          endTime: segmentEnd,
        });
      }
    } else if (transcription.text) {
      fullText = transcription.text;
      segments.push({
        speaker: 'unknown',
        text: transcription.text,
        startTime: 0,
        endTime: 0,
      });
    }

    // Calculate duration from last segment
    const duration = segments.length > 0 
      ? segments[segments.length - 1].endTime 
      : 0;

    return {
      text: fullText.trim() || transcription.text || '',
      segments,
      language: transcription.language_code || 'en',
      duration,
    };
  } catch (error) {
    console.error('ElevenLabs transcription error:', error);
    throw new Error('Failed to transcribe audio');
  }
}
