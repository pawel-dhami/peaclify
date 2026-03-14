// Hume AI Client Placeholder
// Full integration requires @humeai/voice-react SDK and a Hume API key.
// This placeholder provides the interface structure for future implementation.

export interface HumeEmotion {
  name: string;
  score: number;
}

export interface HumeAnalysis {
  emotions: HumeEmotion[];
  dominantEmotion: string;
  timestamp: number;
}

export function getHumeApiKey(): string {
  return process.env.HUME_API_KEY || '';
}

// Mock analysis for development
export function getMockEmotionAnalysis(): HumeAnalysis {
  const emotions: HumeEmotion[] = [
    { name: 'Calmness', score: 0.7 },
    { name: 'Joy', score: 0.5 },
    { name: 'Contemplation', score: 0.6 },
    { name: 'Interest', score: 0.8 },
    { name: 'Sadness', score: 0.1 },
  ];

  return {
    emotions,
    dominantEmotion: 'Interest',
    timestamp: Date.now(),
  };
}
