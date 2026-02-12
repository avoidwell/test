export enum ActivityType {
  HOROSCOPE = 'HOROSCOPE',
  PSYCH_TEST = 'PSYCH_TEST', // Random Quick Test
  LUCKY_COLOR = 'LUCKY_COLOR',
  DECISION_HELPER = 'DECISION_HELPER',
  JOKE_GENERATOR = 'JOKE_GENERATOR',
  STORY_ADVENTURE = 'STORY_ADVENTURE', // Custom Theme
  LOVE_SIMP_TEST = 'LOVE_SIMP_TEST',   // New specific test 1
  MENTAL_AGE_TEST = 'MENTAL_AGE_TEST'  // New specific test 2
}

export interface ShelfItemData {
  id: string;
  title: string;
  subtitle: string;
  type: ActivityType;
  color: string; // Tailwind class for background
  coverImage?: string; // Optional image URL
}

export interface PsychTestResult {
  question: string;
  options: { id: string; text: string; interpretation: string }[];
}

export interface StoryQuestion {
  id: number;
  scenario: string;
  options: { text: string; value: string }[]; // value is a hidden trait key
}

export interface StoryResult {
  title: string;
  description: string;
  traits: string[];
  compatibleWith: string;
}

export enum ZodiacSign {
  Aries = "Bạch Dương (양자리)",
  Taurus = "Kim Ngưu (황소자리)",
  Gemini = "Song Tử (쌍둥이자리)",
  Cancer = "Cự Giải (게자리)",
  Leo = "Sư Tử (사자자리)",
  Virgo = "Xử Nữ (처녀자리)",
  Libra = "Thiên Bình (천칭자리)",
  Scorpio = "Bọ Cạp (전갈자리)",
  Sagittarius = "Nhân Mã (궁수자리)",
  Capricorn = "Ma Kết (염소자리)",
  Aquarius = "Bảo Bình (물병자리)",
  Pisces = "Song Ngư (물고기자리)"
}