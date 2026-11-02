# Prompt Post Market Research & Analytics Platform
### ระบบแบบสอบถามและแดชบอร์ดสรุปผลวิจัยตลาด (J-MAT Award ครั้งที่ 35)

โปรเจกต์เว็บแอปพลิเคชันสำหรับเก็บข้อมูลสำรวจพฤติกรรมการใช้งานเอกสารและการรับรู้แอปพลิเคชัน **Prompt Post (ไปรษณีย์ไทย)** โฟกัสกลุ่มเป้าหมาย Gen Z อายุ **18–24 ปี** (Persona A: The Fresh Starter และ Persona B: The Job Hunter) พร้อมระบบส่งข้อมูลเข้า **Google Sheets** อัตโนมัติ และหน้า **Admin Analytics Dashboard** สำหรับสรุปผลวิเคราะห์สถิติ

---

## 🌟 จุดเด่นของระบบ (Key Highlights)

1. **ตอบง่าย & รวดเร็ว (Fast & Seamless UX):**
   - รูปแบบ Interactive Stepper Card (คำถามทีละข้อ สไตล์ Typeform)
   - ใช้เวลาทำเพียง **1–2 นาที** เหมาะกับพฤติกรรมคนรุ่นใหม่
   - Responsive Mobile-First 100% ตอบผ่านสมาร์ตโฟนได้สะดวกสบาย

2. **ไม่เก็บ Gmail / ข้อมูลส่วนบุคคล (100% Anonymous & PDPA Compliant):**
   - ผู้ตอบไม่ต้อง Login ไม่ต้องกรอกชื่อ-นามสกุล หรืออีเมล 
   - ช่วยลดความกังวลเรื่องข้อมูลรั่วไหล และเพิ่ม Response Rate ได้อย่างมีนัยสำคัญ

3. **ตรงตามโจทย์ J-MAT 35 & CI แบรนด์ Prompt Post:**
   - คุมโทนสีตามคู่มืออัตลักษณ์: แดงสด (#FE3B1F), น้ำเงินเข้ม (#2E3E8A), ฟ้า (#3CB4E5)
   - ฟอนต์ทางการ: **IBM Plex Sans Thai**
   - ครอบคลุมทั้งฟีเจอร์ **VC Prompt Pass (Digital Transcript)** สำหรับ Persona B และ **Digital Postbox** สำหรับ Persona A
   - วัดผลเรื่อง **ThaID eKYC Conversion** และ **Willingness to Pay (ราคาที่ยอมจ่าย)**

4. **ระบบ Admin Analytics Dashboard:**
   - กราฟวงกลมและแท่งแบบ Interactive (Chart.js)
   - สรุปตัวเลข KPI สำคัญ (Total Responses, % Persona, % Transcript Interest, % ThaID Acceptance)
   - สรุป **Key Insights** อัตโนมัติพร้อมปุ่มคัดลอกข้อความไปใส่ในเล่มรายงาน 30 หน้าได้ทันที
   - ปุ่ม **Export to CSV (Excel)** พร้อมรองรับภาษาไทย (UTF-8 BOM ไม่เป็นภาษาต่างดาว)
   - ปุ่ม **เติมข้อมูลจำลอง 50 คน (Load Mock Data)** เพื่อทดลองซ้อมพรีเซนต์ได้ทันที

---

## 🚀 วิธีการเปิดใช้งาน (Quick Start)

ระบบถูกสร้างขึ้นด้วย Modern Web Standard (HTML5, CSS3, JavaScript ES6) โดยไม่ต้องติดตั้งโปรแกรมหรือ Node.js ใดๆ:

1. **เปิดหน้าแบบสอบถาม (สำหรับส่งให้คนตอบ):**
   - ดับเบิลคลิกเปิดไฟล์ `index.html` บนเว็บบราวเซอร์ (Chrome, Safari, Edge, Firefox) หรือส่งลิงก์เมื่อนำไปโฮสต์ออนไลน์
2. **เปิดหน้าสรุปสถิติ (Admin Dashboard):**
   - ดับเบิลคลิกเปิดไฟล์ `admin.html` บนเว็บบราวเซอร์

---

## 📊 วิธีเชื่อมต่อ Google Sheets (ใช้งานได้ใน 2 นาที)

เพื่อให้ข้อมูลคำตอบถูกส่งไปบันทึกใน Google Sheets ของทีมคุณโดยอัตโนมัติ:

1. เปิด [Google Sheets](https://sheets.new) เปล่าขึ้นมา 1 ไฟล์ (ตั้งชื่อ เช่น `PromptPost_Survey_Responses`)
2. ไปที่เมนู **ส่วนขยาย (Extensions)** > **Apps Script**
3. ลบโค้ดเดิมออกทั้งหมด แล้วคัดลอกโค้ดจากไฟล์ `google-apps-script.js` ในโฟลเดอร์นี้ไปวาง
4. กด **บันทึก (Save / Ctrl+S)**
5. คลิกปุ่มสีน้ำเงิน **"การทำให้ใช้งานได้" (Deploy)** มุมขวาบน > เลือก **"การทำให้ใช้งานได้รายการใหม่" (New deployment)**
6. คลิกไอคอนฟันเฟือง (Select type) > เลือก **"เว็บแอป" (Web app)**
7. กำหนดค่า:
   - คำอธิบาย: `Prompt Post Survey Webhook`
   - ดำเนินการในฐานะ (Execute as): `ฉัน (Me)`
   - **ผู้ที่มีสิทธิ์เข้าถึง (Who has access): `ทุกคน (Anyone)`** *(สำคัญมาก เพื่อให้คนตอบส่งข้อมูลได้โดยไม่ต้องล็อกอิน)*
8. คลิก **"ทำให้ใช้งานได้" (Deploy)** แล้ว **คัดลอก URL เว็บแอป (Web app URL)**
9. นำ URL ที่ได้ ไปวางในช่องตั้งค่า:
   - เปิดไฟล์ `admin.html` > คลิกปุ่ม **"⚙️ ตั้งค่า Google Sheets"** > วาง URL > กดบันทึก (หรือนำไปใส่ใน `js/config.js`)

*หมายเหตุ: แม้ไม่ได้เชื่อมต่อ Google Sheets ระบบก็ยังบันทึกข้อมูลลงในเบราว์เซอร์ (LocalStorage) ให้โดยอัตโนมัติ และยังสามารถ Export เป็นไฟล์ Excel/CSV ได้ตลอดเวลา*

---

## 📁 โครงสร้างไฟล์ในโปรเจกต์

```text
promptpost-survey/
├── index.html              # หน้าแบบสอบถามหลักสำหรับผู้ตอบ (Mobile-friendly, No Gmail)
├── admin.html              # หน้า Analytics Dashboard ดูสถิติและกราฟสรุปผล
├── google-apps-script.js   # โค้ด Webhook สำเร็จรูปสำหรับวางใน Google Sheets
├── README.md               # เอกสารแนะนำการติดตั้งและใช้งาน
├── css/
│   └── style.css           # สไตล์ชีตตาม CI ของ Prompt Post และ IBM Plex Sans Thai
└── js/
    ├── config.js           # การตั้งค่า Webhook URL และข้อมูล Mock Data เริ่มต้น
    ├── survey.js           # โลจิกคำถาม, ตรวจสอบความถูกต้อง, ส่งข้อมูล
    └── admin.js            # ประมวลผล Chart.js, KPI, สร้าง Insights, Export CSV
```

---

## 🎯 คำแนะนำสำหรับการนำข้อมูลไปใช้ในเล่มรายงาน J-MAT 35

- **หัวข้อ 4.4 สมมติฐานในการวางแผน (Assumption):** นำกราฟและตัวเลขจากหัวข้อ *Core Pain Points* มาเป็นหลักฐานสนับสนุนว่ากลุ่มเป้าหมาย Gen Z มีปัญหาเรื่องเอกสารกระดาษและต้องการโซลูชันออนไลน์จริง
- **หัวข้อ 4.5.1 การวิเคราะห์กลุ่มเป้าหมาย (Target Analysis):** ใช้สถิติเปรียบเทียบระหว่าง *Persona A (Fresh Starter)* และ *Persona B (Job Hunter)* เพื่ออธิบาย Persona ของทีมอย่างมีน้ำหนัก
- **หัวข้อ 4.5.4 & 4.5.5 Pricing & Marketing Strategy:** นำตัวเลขจากกราฟ *Willingness to Pay* ไปกำหนดโครงสร้างราคา B2C (เช่น ตั้งราคา 29-39 บาท หรือจัดโปรโมชันสำหรับนักศึกษา)
- **หัวข้อ 4.5.6 ตัวชี้วัด Journey Funnel:** ใช้ตัวเลข *ThaID Acceptance Rate* และ *Transcript High Interest* อธิบายขั้นตอนการผลักดัน Conversion จาก Acquisition สู่ Activation


## แก้ปัญหาข้อมูลจากคนอื่นไม่เข้า Google Sheets
เวอร์ชันนี้กำหนด Web App URL ไว้ใน `js/config.js` แล้ว เพื่อให้ผู้ตอบทุกเครื่องส่งข้อมูลไป Google Apps Script URL เดียวกัน ไม่พึ่ง `localStorage` ของแต่ละเครื่อง

สำคัญ: ใน Google Apps Script ให้ Deploy เป็น Web app โดย Execute as = Me และ Who has access = Anyone (ถ้าบัญชีอนุญาต) จากนั้นใช้ URL ที่ลงท้าย `/exec` ตามที่กำหนดใน `js/config.js`

ฝั่งเว็บส่ง JSON เป็น `text/plain;charset=utf-8` เพื่อหลีกเลี่ยง CORS preflight ของ browser เมื่อเรียก Apps Script Web App
