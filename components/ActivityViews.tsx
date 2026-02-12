import React, { useState, useEffect } from 'react';
import { ZodiacSign, PsychTestResult, StoryQuestion, StoryResult, ActivityType } from '../types';
import * as GeminiService from '../services/geminiService';

// --- Shared Components ---
const LoadingSpinner = ({message = "Đang tải (Loading)..."}: {message?: string}) => (
  <div className="flex flex-col justify-center items-center py-10 space-y-4">
    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
    <p className="text-gray-500 text-sm animate-pulse">{message}</p>
  </div>
);

const ResultBox = ({ children }: { children: React.ReactNode }) => (
  <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg text-gray-800 leading-relaxed shadow-inner font-medium">
    {children}
  </div>
);

// --- Horoscope View ---
export const HoroscopeView: React.FC = () => {
  const [selectedSign, setSelectedSign] = useState<ZodiacSign | ''>('');
  const [fortune, setFortune] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const handleGetFortune = async () => {
    if (!selectedSign) return;
    setLoading(true);
    const result = await GeminiService.getDailyHoroscope(selectedSign.split(' (')[0]); // Pass only VN name to API
    setFortune(result);
    setLoading(false);
  };

  return (
    <div className="space-y-4">
      <p className="text-gray-600 text-center">Chọn cung hoàng đạo để xem vũ trụ nhắn gửi gì nha.<br/><span className="text-xs text-gray-400">(별자리를 선택해서 오늘의 운세를 확인하세요)</span></p>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        {Object.entries(ZodiacSign).map(([key, label]) => (
          <button
            key={key}
            onClick={() => { setSelectedSign(label as ZodiacSign); setFortune(''); }}
            className={`p-2 text-sm rounded-lg border transition-colors ${
              selectedSign === label 
                ? 'bg-indigo-600 text-white border-indigo-600' 
                : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
            }`}
          >
            {label}
          </button>
        ))}
      </div>
      
      {selectedSign && !loading && !fortune && (
        <button 
          onClick={handleGetFortune}
          className="w-full py-3 bg-black text-white font-bold rounded-lg hover:bg-gray-800 transition-colors"
        >
          Xem Tử Vi (운세 보기)
        </button>
      )}

      {loading && <LoadingSpinner message="Đang kết nối với vũ trụ (우주와 연결 중)..." />}
      
      {fortune && (
        <div className="animate-fade-in">
          <h3 className="text-lg font-bold text-gray-900 mb-2">{selectedSign}</h3>
          <ResultBox>{fortune}</ResultBox>
        </div>
      )}
    </div>
  );
};

// --- Psych Test View (Simple) ---
export const PsychTestView: React.FC = () => {
  const [testData, setTestData] = useState<PsychTestResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);

  const initTest = async () => {
    setLoading(true);
    setTestData(null);
    setSelectedOptionId(null);
    const data = await GeminiService.getPsychTest();
    setTestData(data);
    setLoading(false);
  };

  useEffect(() => {
    // Initialize test on mount
    initTest();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading || !testData) return <LoadingSpinner message="Đang soạn câu hỏi hóc búa (질문 생성 중)..." />;

  const selectedResult = testData.options.find(o => o.id === selectedOptionId);

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 p-4 rounded-xl">
        <h3 className="text-xl font-bold text-blue-900 mb-2">Câu Hỏi (질문)</h3>
        <p className="text-blue-800 text-lg">{testData.question}</p>
      </div>

      <div className="space-y-3">
        {testData.options.map((option) => (
          <button
            key={option.id}
            onClick={() => setSelectedOptionId(option.id)}
            className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
              selectedOptionId === option.id
                ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
            }`}
          >
            <span className="font-medium text-gray-900">{option.text}</span>
          </button>
        ))}
      </div>

      {selectedResult && (
        <div className="animate-fade-in mt-6 pt-6 border-t border-gray-100">
          <h4 className="text-sm uppercase tracking-wide text-gray-500 font-bold mb-2">Kết Quả Phân Tích (분석 결과)</h4>
          <p className="text-gray-800 text-lg leading-relaxed">{selectedResult.interpretation}</p>
          <button 
            onClick={initTest}
            className="mt-6 text-sm text-blue-600 hover:underline font-medium"
          >
            Chơi câu khác (다른 테스트 하기) &rarr;
          </button>
        </div>
      )}
    </div>
  );
};

// --- Story Adventure View (Supports Custom Themes & Pre-defined Tests) ---
const THEMES = [
  { id: 'fantasy', label: 'Rừng Phép Thuật (마법의 숲)', emoji: '🧚‍♀️', prompt: 'Rừng Phép Thuật' },
  { id: 'scifi', label: 'Trạm Vũ Trụ (우주 정거장)', emoji: '🚀', prompt: 'Trạm Vũ Trụ' },
  { id: 'romance', label: 'Buổi Hẹn Đầu (첫 데이트)', emoji: '💖', prompt: 'Buổi Hẹn Đầu' },
  { id: 'zombie', label: 'Đại Dịch Zombie (좀비 사태)', emoji: '🧟', prompt: 'Đại Dịch Zombie' },
];

interface StoryViewProps {
  forcedTheme?: string; // If provided, skips theme selection
  activityType?: ActivityType;
}

export const StoryAdventureView: React.FC<StoryViewProps> = ({ forcedTheme, activityType }) => {
  const [step, setStep] = useState<'theme' | 'loading' | 'playing' | 'analyzing' | 'result'>(
    forcedTheme ? 'loading' : 'theme'
  );
  const [theme, setTheme] = useState(forcedTheme || '');
  const [questions, setQuestions] = useState<StoryQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<{scenario: string, choice: string, trait: string}[]>([]);
  const [result, setResult] = useState<StoryResult | null>(null);

  // Effect to auto-start if forcedTheme is provided (Specific Tests)
  useEffect(() => {
    if (forcedTheme && step === 'loading' && questions.length === 0) {
      startStory(forcedTheme);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [forcedTheme]);

  const startStory = async (selectedTheme: string) => {
    setTheme(selectedTheme);
    setStep('loading');
    
    // Modify prompt slighty based on type for better context
    let promptTheme = selectedTheme;
    if (activityType === ActivityType.LOVE_SIMP_TEST) {
      promptTheme = "Một câu chuyện thử thách độ lụy tình (Simp) của bạn trong tình yêu, hài hước";
    } else if (activityType === ActivityType.MENTAL_AGE_TEST) {
      promptTheme = "Một loạt tình huống đời thường để kiểm tra độ già dặn hay ngây thơ của tâm hồn";
    }

    const q = await GeminiService.generateStoryTest(promptTheme);
    if (q && q.length > 0) {
      setQuestions(q);
      setStep('playing');
    } else {
      setStep('theme'); 
      alert("AI đang bận viết truyện. Thử lại xíu nha! (AI가 바빠요. 다시 시도해주세요)");
    }
  };

  const handleAnswer = async (option: {text: string, value: string}) => {
    const newAnswers = [...answers, {
      scenario: questions[currentIndex].scenario,
      choice: option.text,
      trait: option.value
    }];
    setAnswers(newAnswers);

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      // Finish
      setStep('analyzing');
      const analysis = await GeminiService.analyzeStoryResult(theme, newAnswers);
      setResult(analysis);
      setStep('result');
    }
  };

  const reset = () => {
    if (forcedTheme) {
      setQuestions([]);
      setAnswers([]);
      setCurrentIndex(0);
      setResult(null);
      setStep('loading');
      startStory(forcedTheme);
    } else {
      setStep('theme');
      setQuestions([]);
      setAnswers([]);
      setCurrentIndex(0);
      setResult(null);
    }
  };

  // 1. Theme Selection (Only if not forced)
  if (step === 'theme') {
    return (
      <div className="text-center space-y-6">
        <h3 className="text-xl font-bold text-gray-800">Chọn Thế Giới Của Bạn (세계를 선택하세요)</h3>
        <p className="text-gray-500">Bạn muốn khám phá bản thân qua bối cảnh nào?<br/>(어떤 배경에서 자신을 발견하고 싶나요?)</p>
        <div className="grid grid-cols-2 gap-4">
          {THEMES.map(t => (
            <button
              key={t.id}
              onClick={() => startStory(t.prompt)}
              className="p-6 rounded-xl border-2 border-dashed border-gray-300 hover:border-indigo-500 hover:bg-indigo-50 transition-all group"
            >
              <span className="text-4xl mb-2 block group-hover:scale-110 transition-transform">{t.emoji}</span>
              <span className="font-bold text-gray-700 group-hover:text-indigo-600 text-sm md:text-base">{t.label}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // 2. Loading State
  if (step === 'loading') return <LoadingSpinner message="AI đang sáng tác kịch bản (AI가 이야기 만드는 중)..." />;
  if (step === 'analyzing') return <LoadingSpinner message="Đang soi xét tâm hồn bạn (당신의 영혼을 분석 중)..." />;

  // 3. Gameplay
  if (step === 'playing') {
    const currentQ = questions[currentIndex];
    const progress = ((currentIndex + 1) / questions.length) * 100;

    return (
      <div className="space-y-6">
        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div className="bg-indigo-600 h-2 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
        </div>
        
        <div className="text-sm text-gray-400 font-bold uppercase tracking-wider text-right">
          Chương (Chapter) {currentIndex + 1}/{questions.length}
        </div>

        {/* Story Card */}
        <div className="bg-indigo-50 p-6 rounded-xl border border-indigo-100 shadow-sm">
          <p className="text-lg md:text-xl leading-relaxed text-indigo-900 font-serif">
            {currentQ.scenario}
          </p>
        </div>

        {/* Options */}
        <div className="space-y-3">
          {currentQ.options.map((opt, idx) => (
            <button
              key={idx}
              onClick={() => handleAnswer(opt)}
              className="w-full text-left p-4 rounded-lg bg-white border border-gray-200 hover:border-indigo-400 hover:shadow-md transition-all active:scale-[0.99]"
            >
              <span className="font-medium text-gray-800">{opt.text}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // 4. Results
  if (step === 'result' && result) {
    return (
      <div className="text-center space-y-6 animate-fade-in">
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white p-8 rounded-2xl shadow-lg transform rotate-1">
          <div className="uppercase tracking-widest text-xs font-bold opacity-75 mb-2">Bạn chính là (당신은 바로)</div>
          <h2 className="text-3xl font-black mb-4">{result.title}</h2>
          <div className="flex flex-wrap justify-center gap-2 mb-4">
            {result.traits.map(t => (
              <span key={t} className="px-2 py-1 bg-white/20 rounded-full text-xs font-bold">{t}</span>
            ))}
          </div>
        </div>

        <div className="text-left space-y-4">
          <h4 className="font-bold text-gray-900">Lời Nhận Xét (코멘트)</h4>
          <p className="text-gray-700 leading-relaxed">{result.description}</p>
          
          <div className="bg-pink-50 p-4 rounded-lg border border-pink-100 mt-4">
             <span className="font-bold text-pink-600">❤️ Hợp cạ với (환상의 짝꿍): </span>
             <span className="text-pink-800">{result.compatibleWith}</span>
          </div>
        </div>

        <button 
          onClick={reset}
          className="mt-8 px-8 py-3 bg-gray-900 text-white rounded-full font-bold hover:bg-black transition-colors"
        >
          Chơi Lại (다시 하기)
        </button>
      </div>
    );
  }

  return null;
};

// --- Lucky Color View ---
export const LuckyColorView: React.FC = () => {
  const [result, setResult] = useState<{color: string, reason: string} | null>(null);
  const [loading, setLoading] = useState(false);

  const getLuck = async () => {
    setLoading(true);
    const data = await GeminiService.getLuckyColor();
    setResult(data);
    setLoading(false);
  };

  return (
    <div className="text-center space-y-8 py-4">
      {!result && !loading && (
        <button 
          onClick={getLuck}
          className="px-8 py-4 bg-gradient-to-r from-pink-500 to-orange-400 text-white font-bold rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all"
        >
          Xem Màu May Mắn (행운의 색 보기)
        </button>
      )}

      {loading && <LoadingSpinner message="Đang pha màu (색깔 섞는 중)..." />}

      {result && (
        <div className="animate-fade-in space-y-6">
          <div 
            className="w-32 h-32 rounded-full mx-auto shadow-2xl flex items-center justify-center border-4 border-white"
            style={{ backgroundColor: result.color.toLowerCase() === 'đen' ? 'black' : result.color.toLowerCase() }} 
          >
            {/* Fallback box if color name is complex, but usually works */}
          </div>
          <div>
            <h2 className="text-3xl font-black text-gray-900 mb-2">{result.color}</h2>
            <p className="text-gray-600 text-lg italic">"{result.reason}"</p>
          </div>
          <button 
            onClick={getLuck}
            className="text-gray-400 text-sm hover:text-gray-600"
          >
            Thử màu khác (다른 색 보기)
          </button>
        </div>
      )}
    </div>
  );
};

// --- Decision Helper View ---
export const DecisionHelperView: React.FC = () => {
  const [optionA, setOptionA] = useState('');
  const [optionB, setOptionB] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const handleDecide = async () => {
    if (!optionA || !optionB) return;
    setLoading(true);
    const answer = await GeminiService.getDecisionHelp(optionA, optionB);
    setResult(answer);
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Phương án A (옵션 A)</label>
          <input 
            type="text" 
            value={optionA}
            onChange={(e) => setOptionA(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="Ví dụ: Ăn phở"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Phương án B (옵션 B)</label>
          <input 
            type="text" 
            value={optionB}
            onChange={(e) => setOptionB(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="Ví dụ: Ăn bún đậu"
          />
        </div>
      </div>

      <button 
        onClick={handleDecide}
        disabled={!optionA || !optionB || loading}
        className="w-full py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? 'Đang hỏi tổ tiên (조상님께 물어보는 중)...' : 'Quyết Định Hộ Tôi! (대신 골라줘!)'}
      </button>

      {result && (
        <ResultBox>
          <p className="text-lg font-medium">{result}</p>
        </ResultBox>
      )}
    </div>
  );
};

// --- Joke View ---
export const JokeView: React.FC = () => {
    const [joke, setJoke] = useState('');
    const [loading, setLoading] = useState(false);

    const fetchJoke = async () => {
        setLoading(true);
        const j = await GeminiService.getJoke();
        setJoke(j);
        setLoading(false);
    }

    useEffect(() => { fetchJoke(); }, []);

    return (
        <div className="text-center py-8">
            {loading ? <LoadingSpinner message="Đang lục lọi ký ức vui vẻ (재밌는 기억 찾는 중)..." /> : (
                <div className="space-y-6">
                     <p className="text-2xl font-serif italic text-gray-800">
                        {joke}
                     </p>
                     <button 
                        onClick={fetchJoke}
                        className="px-6 py-2 border-2 border-gray-300 rounded-full hover:bg-gray-100 font-medium text-gray-600 transition-colors"
                     >
                        Câu khác đi (다른 거)
                     </button>
                </div>
            )}
        </div>
    )
}