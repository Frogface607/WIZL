/**
 * Wizl wisdoms — short atmospheric copy used across the app
 * instead of generic "Loading…" / "Nothing found" placeholders.
 *
 * Voice: kind, slightly mystical, never corporate, never preachy.
 * Always under 80 chars (UI-safe).
 *
 * Localized: EN / TH. Falls back to EN if a locale or mood
 * is missing.
 */

export type WisdomMood =
  | "loading"
  | "thinking"
  | "scanning"
  | "success"
  | "empty"
  | "farewell"
  | "error"
  | "lost"
  | "welcome";

export type WisdomLocale = "en" | "th";

type WisdomMap = Record<WisdomMood, string[]>;

const EN: WisdomMap = {
  thinking: [
    "Consulting the ancient scrolls…",
    "Asking the cat for a second opinion…",
    "Checking the book…",
    "Sniffing the aura…",
    "Reading the terpene wind…",
    "Turning the page…",
    "Listening for myrcene…",
    "Following the green crystal…",
  ],
  scanning: [
    "The wizard consults his book…",
    "Reading the terpene aura…",
    "Sniffing for myrcene…",
    "Holding it up to the staff-light…",
    "Cross-checking the old scrolls…",
  ],
  loading: [
    "The Wizard is leafing through the book…",
    "Counting the lanterns…",
    "Drawing the map…",
    "Finding the scroll…",
    "Lighting the lanterns…",
  ],
  success: [
    "The Wizard has written this in the book.",
    "One more page in your journey.",
    "The cat approves.",
    "Marked in the great log.",
    "A new entry in your travels.",
    "The book remembers.",
  ],
  empty: [
    "Your book is empty, traveler. Time to begin the journey.",
    "Nothing on this page yet. Will you write the first line?",
    "The Wizard hasn't been here yet — be the first.",
    "An empty scroll, waiting for its story.",
  ],
  farewell: [
    "The Wizard grows weary, friend. The scrolls must rest.",
    "Even Wizl sleeps. Return when the stars shift.",
    "The book is closed for now. Return tomorrow.",
  ],
  error: [
    "Hmm, the crystal ball is foggy. Try again?",
    "The wind disturbed the candle. One more try?",
    "The cat knocked something over. Try once more?",
    "A page is stuck. Refresh and we'll continue.",
  ],
  lost: [
    "The Wizard searched every scroll… this page doesn't exist.",
    "Even the cat couldn't find this one.",
    "A lost path. The map shows no such place.",
  ],
  welcome: [
    "Welcome, traveler.",
    "The Wizard has been expecting you.",
    "Step inside the book.",
  ],
};

const TH: WisdomMap = {
  thinking: [
    "กำลังปรึกษาคัมภีร์โบราณ…",
    "ถามแมวก่อนนะ…",
    "เปิดสมุดดูก่อน…",
    "ดมกลิ่นออร่า…",
    "อ่านสายลมเทอร์พีน…",
    "พลิกหน้าถัดไป…",
    "ฟังเสียงของมีร์ซีน…",
    "ตามแสงคริสตัลเขียว…",
  ],
  scanning: [
    "พ่อมดกำลังปรึกษาคัมภีร์…",
    "อ่านออร่าของเทอร์พีน…",
    "ดมหามีร์ซีน…",
    "ส่องด้วยแสงไม้เท้า…",
    "สอบทานกับคัมภีร์เก่า…",
  ],
  loading: [
    "พ่อมดกำลังพลิกหน้าสมุด…",
    "นับโคมไฟ…",
    "วาดแผนที่…",
    "หาคัมภีร์…",
    "จุดโคมไฟ…",
  ],
  success: [
    "พ่อมดได้บันทึกไว้ในสมุดแล้ว",
    "อีกหนึ่งหน้าในการเดินทางของคุณ",
    "แมวอนุมัติ",
    "บันทึกในสมุดใหญ่แล้ว",
    "อีกหนึ่งบรรทัดในการเดินทาง",
    "สมุดยังจำ",
  ],
  empty: [
    "สมุดของคุณยังว่าง นักเดินทาง ถึงเวลาออกเดินทาง",
    "หน้านี้ยังว่าง คุณจะเขียนบรรทัดแรกไหม?",
    "พ่อมดยังไม่เคยมา — เป็นคนแรก",
    "คัมภีร์ว่างเปล่ารอเรื่องของมัน",
  ],
  farewell: [
    "พ่อมดเหนื่อยแล้ว เพื่อน คัมภีร์ต้องพัก",
    "แม้แต่วิซลก็ต้องหลับ กลับมาเมื่อดาวเคลื่อน",
    "สมุดปิดแล้วชั่วคราว กลับมาพรุ่งนี้",
  ],
  error: [
    "อืม ลูกแก้วเป็นหมอกหน่อย ลองอีกครั้ง?",
    "ลมพัดเทียนดับ ลองอีกครั้ง?",
    "แมวทำของหล่น ลองอีกครั้ง?",
    "หน้าค้าง รีเฟรชแล้วไปต่อ",
  ],
  lost: [
    "พ่อมดค้นทุกคัมภีร์แล้ว… หน้านี้ไม่มีอยู่",
    "แม้แต่แมวยังหาไม่เจอ",
    "เส้นทางที่หายไป แผนที่ไม่มีที่นี้",
  ],
  welcome: [
    "ยินดีต้อนรับ นักเดินทาง",
    "พ่อมดรอคุณอยู่",
    "ก้าวเข้าสู่หน้าสมุด",
  ],
};

const ALL: Record<WisdomLocale, WisdomMap> = { en: EN, th: TH };

function poolFor(mood: WisdomMood, locale: WisdomLocale): string[] {
  return ALL[locale]?.[mood] ?? EN[mood] ?? [];
}

/**
 * Pick a random wisdom for a given mood + locale.
 * Falls back to English if locale missing.
 */
export function getRandomWisdom(
  mood: WisdomMood,
  options?: { locale?: WisdomLocale; seed?: number }
): string {
  const pool = poolFor(mood, options?.locale ?? "en");
  if (pool.length === 0) return "";
  const idx =
    typeof options?.seed === "number"
      ? Math.abs(options.seed) % pool.length
      : Math.floor(Math.random() * pool.length);
  return pool[idx];
}

/**
 * Get all wisdoms for a mood (for rotation animations).
 */
export function getAllWisdoms(
  mood: WisdomMood,
  locale: WisdomLocale = "en"
): string[] {
  return [...poolFor(mood, locale)];
}

export default ALL;

