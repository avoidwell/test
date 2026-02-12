export enum ActivityType {
  HOROSCOPE = 'HOROSCOPE',
  PSYCH_TEST = 'PSYCH_TEST',
  LUCKY_COLOR = 'LUCKY_COLOR',
  DECISION_HELPER = 'DECISION_HELPER',
  JOKE_GENERATOR = 'JOKE_GENERATOR',
  COMPLIMENT = 'COMPLIMENT'
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

export enum ZodiacSign {
  Aries = "Aries",
  Taurus = "Taurus",
  Gemini = "Gemini",
  Cancer = "Cancer",
  Leo = "Leo",
  Virgo = "Virgo",
  Libra = "Libra",
  Scorpio = "Scorpio",
  Sagittarius = "Sagittarius",
  Capricorn = "Capricorn",
  Aquarius = "Aquarius",
  Pisces = "Pisces"
}