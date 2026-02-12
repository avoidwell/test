import { GoogleGenerativeAI } from "@google/generative-ai";
import { PsychTestResult, StoryQuestion, StoryResult } from "../types";

// Use a stable model supported by @google/generative-ai
const MODEL_NAME = 'gemini-1.5-flash';

// Helper to safely get the model instance only when needed
const getModel = (useJson = false) => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key chưa được cấu hình. Vui lòng kiểm tra file .env hoặc GitHub Secrets.");
  }
  
  const genAI = new GoogleGenerativeAI(apiKey);
  
  const config: any = {};
  if (useJson) {
    config.responseMimeType = "application/json";
    // We removed 'responseSchema' to prevent strict parsing errors. 
    // We rely on the prompt to enforce structure.
  }
  
  return genAI.getGenerativeModel({ 
    model: MODEL_NAME,
    generationConfig: config
  });
};

export const getDailyHoroscope = async (sign: string): Promise<string> => {
  try {
    const model = getModel();
    const result = await model.generateContent(
      `Viết một lá số tử vi hàng ngày ngắn gọn, hài hước và "xéo xắc" cho cung ${sign}. 
      Giữ dưới 3 câu. Dùng ngôn ngữ Gen Z Việt Nam tự nhiên, vui vẻ (ví dụ: "xu cà na", "keo lỳ", "hết nước chấm").`
    );
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Error fetching horoscope:", error);
    return "Vũ trụ đang bảo trì. Vui lòng thử lại sau nha!";
  }
};

export const getPsychTest = async (): Promise<PsychTestResult | null> => {
  try {
    const model = getModel(true);
    const result = await model.generateContent(
      `Tạo một bài trắc nghiệm tâm lý vui nhộn bằng tiếng Việt.
      Bao gồm 1 tình huống/câu hỏi thú vị và 4 lựa chọn khác nhau.
      Mỗi lựa chọn phải có phần giải thích tính cách ngắn gọn.
      
      Output JSON format:
      {
        "question": "Câu hỏi ở đây",
        "options": [
          {"id": "A", "text": "Lựa chọn A", "interpretation": "Giải thích cho A"},
          {"id": "B", "text": "Lựa chọn B", "interpretation": "Giải thích cho B"},
          ...
        ]
      }`
    );

    const text = result.response.text();
    if (!text) return null;
    return JSON.parse(text) as PsychTestResult;
  } catch (error) {
    console.error("Error fetching psych test:", error);
    return null;
  }
};

export const getLuckyColor = async (): Promise<{ color: string; reason: string }> => {
  try {
    const model = getModel(true);
    const result = await model.generateContent(
      `Chọn một màu may mắn ngẫu nhiên cho hôm nay và đưa ra lý do hài hước bằng tiếng Việt.
      Output JSON format:
      { "color": "Tên màu (tiếng Việt)", "reason": "Lý do hài hước" }`
    );
    
    const text = result.response.text();
    if (!text) throw new Error("No data");
    return JSON.parse(text);
  } catch (error) {
    console.error("Error fetching lucky color:", error);
    return { color: "Xám Xịt", reason: "API đang lỗi nên đời hơi xám. Thử lại sau nhé!" };
  }
};

export const getDecisionHelp = async (optionA: string, optionB: string): Promise<string> => {
  try {
    const model = getModel();
    const result = await model.generateContent(
      `Giúp tôi chọn giữa "${optionA}" và "${optionB}". 
      Chọn dứt khoát một cái và đưa ra lý do "bựa" hoặc hài hước bằng tiếng Việt.`
    );
    return result.response.text();
  } catch (error) {
    return "AI đang hoang mang quá. Thử lại xem sao?";
  }
};

export const getJoke = async (): Promise<string> => {
  try {
    const model = getModel();
    const result = await model.generateContent("Kể một câu chuyện cười nhạt (Dad joke) bằng tiếng Việt. Ngắn thôi.");
    return result.response.text();
  } catch (error) {
    return "Tại sao con cua lại có 8 cẳng? Tại vì nó thích thế. (Lỗi kết nối rồi)";
  }
};

// --- Story Adventure & Specific Tests ---

export const generateStoryTest = async (theme: string): Promise<StoryQuestion[]> => {
  try {
    const model = getModel(true);
    // Increased to 10 questions for higher quality
    const prompt = `Tạo một bài trắc nghiệm tâm lý 10 câu hỏi nối tiếp nhau như một câu chuyện hoàn chỉnh, chủ đề: "${theme}".
    Ngôn ngữ: Tiếng Việt tự nhiên, hấp dẫn, lôi cuốn.
    Các câu hỏi phải liên kết chặt chẽ, tạo thành một cốt truyện (ví dụ: bắt đầu cuộc hành trình, gặp thử thách, giải quyết, kết thúc).
    
    Cấu trúc JSON MẢNG (Array) chính xác như sau:
    [
      {
        "id": 1,
        "scenario": "Mô tả tình huống câu chuyện chi tiết...",
        "options": [
          { "text": "Hành động A", "value": "từ_khóa_tính_cách_1" },
          { "text": "Hành động B", "value": "từ_khóa_tính_cách_2" }
        ]
      }
    ]
    
    Trả về đúng 10 câu hỏi. 'value' là từ khóa tiếng Anh đại diện tính cách (e.g., 'naive', 'mature', 'simp', 'cold', 'leader').`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    // Clean potential markdown code blocks if present
    const cleanText = text.replace(/```json|```/g, "").trim();
    return JSON.parse(cleanText) as StoryQuestion[];
  } catch (error) {
    console.error("Story Gen Error:", error);
    return [];
  }
};

export const analyzeStoryResult = async (theme: string, answers: {scenario: string, choice: string, trait: string}[]): Promise<StoryResult> => {
  try {
    const model = getModel(true);
    const prompt = `Phân tích chi tiết kết quả trắc nghiệm cốt truyện (10 câu) chủ đề "${theme}" bằng tiếng Việt.
    
    Dựa trên các lựa chọn sau của người dùng:
    ${answers.map((a, i) => `${i+1}. ${a.scenario.substring(0, 30)}... -> Chọn: ${a.choice} (Trait: ${a.trait})`).join('\n')}
    
    Hãy đóng vai một chuyên gia tâm lý học hài hước và sâu sắc.
    Output JSON format:
    {
      "title": "Danh hiệu thật kêu (ví dụ: 'Chúa tể Simp', 'Giáo sư Tình Yêu')",
      "description": "Phân tích tính cách chi tiết khoảng 4-5 câu. Hãy nói về điểm mạnh, điểm yếu và xu hướng hành vi.",
      "traits": ["3 tính từ", "ngắn gọn", "về tính cách"],
      "compatibleWith": "Kiểu người/đối tượng phù hợp"
    }`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const cleanText = text.replace(/```json|```/g, "").trim();
    return JSON.parse(cleanText) as StoryResult;
  } catch (error) {
    console.error("Story Analyze Error:", error);
    return {
      title: "Người Bí Ẩn",
      description: "Có lỗi xảy ra khi phân tích kết quả dài ngoằng của bạn. Nhưng chắc chắn bạn là một người rất kiên nhẫn!",
      traits: ["Kiên nhẫn", "Bí ẩn", "Lỗi"],
      compatibleWith: "Kỹ sư AI"
    };
  }
};