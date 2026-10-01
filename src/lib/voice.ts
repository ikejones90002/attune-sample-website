// Browser voice helpers: dictation via the Web Speech API (SpeechRecognition)
// and read-aloud via speechSynthesis. Both are feature-detected; the UI
// hides the controls when the browser does not support them. No dependencies.
export interface VoiceRecognitionAlternative {
  readonly transcript: string;
  readonly confidence: number;
}

export interface VoiceRecognitionResult {
  readonly isFinal: boolean;
  readonly length: number;
  item(index: number): VoiceRecognitionAlternative;
}

export interface VoiceRecognitionResultList {
  readonly length: number;
  [index: number]: VoiceRecognitionResult;
}

export interface VoiceRecognitionResultEvent extends Event {
  readonly resultIndex: number;
  readonly results: VoiceRecognitionResultList;
}

export interface VoiceRecognitionErrorEvent extends Event {
  readonly error: string;
}

export interface VoiceRecognition {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((event: VoiceRecognitionResultEvent) => void) | null;
  onerror: ((event: VoiceRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
  start(): void;
  stop(): void;
}

interface VoiceRecognitionConstructor {
  new (): VoiceRecognition;
}

interface WindowWithSpeech {
  SpeechRecognition?: VoiceRecognitionConstructor;
  webkitSpeechRecognition?: VoiceRecognitionConstructor;
}

function windowWithSpeech(): WindowWithSpeech {
  return window as unknown as WindowWithSpeech;
}

export function isDictationSupported(): boolean {
  const w = windowWithSpeech();
  return (
    typeof w.SpeechRecognition === 'function' ||
    typeof w.webkitSpeechRecognition === 'function'
  );
}

export function createDictation(): VoiceRecognition | null {
  const w = windowWithSpeech();
  const Ctor = w.SpeechRecognition ?? w.webkitSpeechRecognition;
  if (typeof Ctor !== 'function') {
    return null;
  }
  return new Ctor();
}

export function isReadAloudSupported(): boolean {
  return 'speechSynthesis' in window && typeof window.speechSynthesis?.speak === 'function';
}

export function speakText(text: string): void {
  if (!isReadAloudSupported()) {
    return;
  }
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = navigator.language || 'en-US';
  window.speechSynthesis.speak(utterance);
}

export function stopSpeaking(): void {
  if (isReadAloudSupported()) {
    window.speechSynthesis.cancel();
  }
}

/** Human-friendly note for the most common dictation failures. */
export function dictationErrorNote(error: string): string {
  switch (error) {
    case 'not-allowed':
    case 'service-not-allowed':
      return 'Microphone access was blocked — you can type your message instead.';
    case 'no-speech':
      return 'Didn’t hear anything — try speaking again or type instead.';
    case 'audio-capture':
      return 'No microphone was found — typing works just the same.';
    case 'network':
      return 'Voice input needs a network connection right now — typing works instead.';
    default:
      return 'Voice input hit a snag — you can type your message instead.';
  }
}
