import React, { useState, useEffect } from 'react';
import { ZodiacSign, PsychTestResult } from '../types';
import * as GeminiService from '../services/geminiService';

// --- Shared Components ---
const LoadingSpinner = () => (
  <div className="flex justify-center items-center py-10">
    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
  </div>
);

const ResultBox = ({ children }: { children: React.ReactNode }) => (
  <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg text-gray-800 leading-relaxed shadow-inner">
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
    const result = await GeminiService.getDailyHoroscope(selectedSign);
    setFortune(result);
    setLoading(false);
  };

  return (
    <div className="space-y-4">
      <p className="text-gray-600">Select your zodiac sign to reveal today's destiny.</p>
      <div className="grid grid-cols-3 gap-2">
        {Object.values(ZodiacSign).map((sign) => (
          <button
            key={sign}
            onClick={() => { setSelectedSign(sign); setFortune(''); }}
            className={`p-2 text-sm rounded-lg border transition-colors ${
              selectedSign === sign 
                ? 'bg-indigo-600 text-white border-indigo-600' 
                : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
            }`}
          >
            {sign}
          </button>
        ))}
      </div>
      
      {selectedSign && !loading && !fortune && (
        <button 
          onClick={handleGetFortune}
          className="w-full py-3 bg-black text-white font-bold rounded-lg hover:bg-gray-800 transition-colors"
        >
          Read My Stars
        </button>
      )}

      {loading && <LoadingSpinner />}
      
      {fortune && (
        <div className="animate-fade-in">
          <h3 className="text-lg font-bold text-gray-900 mb-2">{selectedSign}</h3>
          <ResultBox>{fortune}</ResultBox>
        </div>
      )}
    </div>
  );
};

// --- Psych Test View ---
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

  if (loading || !testData) return <LoadingSpinner />;

  const selectedResult = testData.options.find(o => o.id === selectedOptionId);

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 p-4 rounded-xl">
        <h3 className="text-xl font-bold text-blue-900 mb-2">Question</h3>
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
          <h4 className="text-sm uppercase tracking-wide text-gray-500 font-bold mb-2">Analysis</h4>
          <p className="text-gray-800 text-lg leading-relaxed">{selectedResult.interpretation}</p>
          <button 
            onClick={initTest}
            className="mt-6 text-sm text-blue-600 hover:underline font-medium"
          >
            Try another test &rarr;
          </button>
        </div>
      )}
    </div>
  );
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
          Find My Lucky Color
        </button>
      )}

      {loading && <LoadingSpinner />}

      {result && (
        <div className="animate-fade-in space-y-6">
          <div 
            className="w-32 h-32 rounded-full mx-auto shadow-2xl flex items-center justify-center border-4 border-white"
            style={{ backgroundColor: result.color.toLowerCase() }} // Fallback if not valid css color
          >
            {/* Visual fallback if simple name */}
          </div>
          <div>
            <h2 className="text-3xl font-black text-gray-900 mb-2">{result.color}</h2>
            <p className="text-gray-600 text-lg italic">"{result.reason}"</p>
          </div>
          <button 
            onClick={getLuck}
            className="text-gray-400 text-sm hover:text-gray-600"
          >
            Spin again
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
          <label className="block text-sm font-medium text-gray-700 mb-1">Option A</label>
          <input 
            type="text" 
            value={optionA}
            onChange={(e) => setOptionA(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="e.g. Pizza"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Option B</label>
          <input 
            type="text" 
            value={optionB}
            onChange={(e) => setOptionB(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="e.g. Sushi"
          />
        </div>
      </div>

      <button 
        onClick={handleDecide}
        disabled={!optionA || !optionB || loading}
        className="w-full py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? 'Consulting the Oracle...' : 'Decide For Me!'}
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
            {loading ? <LoadingSpinner /> : (
                <div className="space-y-6">
                     <p className="text-2xl font-serif italic text-gray-800">
                        {joke}
                     </p>
                     <button 
                        onClick={fetchJoke}
                        className="px-6 py-2 border-2 border-gray-300 rounded-full hover:bg-gray-100 font-medium text-gray-600 transition-colors"
                     >
                        Another one please
                     </button>
                </div>
            )}
        </div>
    )
}