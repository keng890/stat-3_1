/**
 * Configuration & Storage Constants for Prompt Post Survey
 */
const CONFIG = {
  // นำ URL ที่ได้จากการ Deploy Google Apps Script (Web App) มาใส่ตรงนี้
  // หรือสามารถเข้าไปกรอก/แก้ไขได้ในหน้า Admin Settings
  GOOGLE_SHEET_WEBHOOK_URL: localStorage.getItem("promptpost_webhook_url") || "",

  STORAGE_KEY_SURVEYS: "promptpost_survey_responses",
  STORAGE_KEY_WEBHOOK: "promptpost_webhook_url",

  // Brand Info
  APP_TITLE: "Prompt Post Survey (J-MAT Award 35)",
  VERSION: "1.0.0"
};

// Initial Mock Data (สำหรับให้หน้า Admin มีกราฟแสดงทันทีเพื่อการพรีเซนต์)
const INITIAL_MOCK_DATA = [
  {
    timestamp: "16/09/2026, 14:10:20",
    ageGroup: "21-22 ปี (นักศึกษาปีสุดท้าย)",
    occupation: "นักศึกษามหาวิทยาลัย",
    persona: "Persona B: The Job Hunter",
    painPoints: ["ขอทรานสคริปต์/ใบรับรองเสียเงินและรอนาน", "ต้องคอยปรินต์ เซ็น สแกนเอกสารซ้ำๆ"],
    frequency: "เดือนละ 2-3 ครั้ง",
    awareness: "เคยได้ยินชื่อ แต่ไม่เคยใช้งาน",
    transcriptInterest: "สนใจมาก (สะดวก สมัครงานได้ทันที ไม่ต้องรอ)",
    postboxInterest: "สนใจปานกลาง",
    thaIdPerception: "ยินดีใช้งาน ถ้าเพิ่มความน่าเชื่อถือให้เอกสาร",
    willingnessToPay: "20 - 30 บาท/ฉบับ",
    motivation: "ความสะดวกรวดเร็ว ยื่นงานได้ทันที",
    suggestions: "อยากให้มีมหาวิทยาลัยเข้าร่วมเยอะๆ โดยเฉพาะมหาลัยรัฐ"
  },
  {
    timestamp: "16/09/2026, 14:25:40",
    ageGroup: "23-24 ปี (เพิ่งเริ่มทำงาน)",
    occupation: "เพิ่งเริ่มทำงาน (First Jobber)",
    persona: "Persona A: The Fresh Starter",
    painPoints: ["ย้ายหอ/เปลี่ยนที่พักแล้วบิลและเอกสารสำคัญสูญหาย", "เอกสารกระดาษเยอะรกห้อง หาไม่เจอเวลาจะใช้"],
    frequency: "สัปดาห์ละครั้งขึ้นไป",
    awareness: "ไม่เคยได้ยินมาก่อน",
    transcriptInterest: "สนใจมาก (สะดวก สมัครงานได้ทันที ไม่ต้องรอ)",
    postboxInterest: "สนใจมาก (อยากมีตู้ดิจิทัลถาวร ย้ายหอเอกสารไม่หาย)",
    thaIdPerception: "ยินดีใช้งาน เพราะใช้ ThaID อยู่แล้ว",
    willingnessToPay: "ฟรี (คิดว่าองค์กรควรออกให้)",
    motivation: "ย้ายที่อยู่บ่อย เอกสารไม่ตกหล่น",
    suggestions: "อยากให้เตือนบิลค่าไฟค่าน้ำผ่านไลน์ด้วย"
  },
  {
    timestamp: "16/09/2026, 15:02:11",
    ageGroup: "21-22 ปี (นักศึกษาปีสุดท้าย)",
    occupation: "กำลังมองหางาน/รอสมัครงาน",
    persona: "Persona B: The Job Hunter",
    painPoints: ["กังวลเรื่องการปลอมแปลงวุฒิ หรือความน่าเชื่อถือ", "ขอทรานสคริปต์/ใบรับรองเสียเงินและรอนาน"],
    frequency: "เดือนละ 2-3 ครั้ง",
    awareness: "เคยได้ยินชื่อ แต่ไม่เคยใช้งาน",
    transcriptInterest: "สนใจมาก (สะดวก สมัครงานได้ทันที ไม่ต้องรอ)",
    postboxInterest: "สนใจมาก (อยากมีตู้ดิจิทัลถาวร ย้ายหอเอกสารไม่หาย)",
    thaIdPerception: "ยินดีใช้งาน ถ้าเพิ่มความน่าเชื่อถือให้เอกสาร",
    willingnessToPay: "31 - 50 บาท/ฉบับ",
    motivation: "ความน่าเชื่อถือ ปลอมแปลงไม่ได้ 100%",
    suggestions: "ควรจับมือกับเว็บ JobThai, JobsDB ให้แนบผ่านแอปได้เลย"
  },
  {
    timestamp: "16/09/2026, 15:30:15",
    ageGroup: "18-20 ปี (นิสิต/นักศึกษาปีต้น)",
    occupation: "นักศึกษามหาวิทยาลัย",
    persona: "Persona A: The Fresh Starter",
    painPoints: ["เอกสารกระดาษเยอะรกห้อง หาไม่เจอเวลาจะใช้"],
    frequency: "นานๆ ครั้ง (1-2 ครั้งต่อปี)",
    awareness: "ไม่เคยได้ยินมาก่อน",
    transcriptInterest: "สนใจปานกลาง",
    postboxInterest: "สนใจมาก (อยากมีตู้ดิจิทัลถาวร ย้ายหอเอกสารไม่หาย)",
    thaIdPerception: "รู้สึกยุ่งยากเล็กน้อย แต่พอรับได้",
    willingnessToPay: "ฟรี (คิดว่าองค์กรควรออกให้)",
    motivation: "ช่วยลดโลกร้อนและลดขยะกระดาษ (Paperless)",
    suggestions: "หน้าตาแอปขอให้ทันสมัย ไม่เหมือนแอปรัฐบาลเก่าๆ"
  },
  {
    timestamp: "16/09/2026, 16:15:08",
    ageGroup: "23-24 ปี (เพิ่งเริ่มทำงาน)",
    occupation: "ฟรีแลนซ์ / รับงานอิสระ",
    persona: "Persona B: The Job Hunter",
    painPoints: ["ต้องคอยปรินต์ เซ็น สแกนเอกสารซ้ำๆ", "ย้ายหอ/เปลี่ยนที่พักแล้วบิลและเอกสารสำคัญสูญหาย"],
    frequency: "สัปดาห์ละครั้งขึ้นไป",
    awareness: "ใช้งานเป็นประจำอยู่แล้ว",
    transcriptInterest: "สนใจมาก (สะดวก สมัครงานได้ทันที ไม่ต้องรอ)",
    postboxInterest: "สนใจมาก (อยากมีตู้ดิจิทัลถาวร ย้ายหอเอกสารไม่หาย)",
    thaIdPerception: "ยินดีใช้งาน เพราะใช้ ThaID อยู่แล้ว",
    willingnessToPay: "51 - 100 บาท/ฉบับ",
    motivation: "ความสะดวกรวดเร็ว ยื่นงานได้ทันที",
    suggestions: "อยากให้มีฟังก์ชันเซ็นสัญญา e-Signature ฟรีด้วย"
  }
];
