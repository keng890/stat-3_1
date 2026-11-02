/**
 * =========================================================================
 * Google Apps Script สำหรับรับข้อมูลแบบสอบถาม Prompt Post (9 ส่วนคำถาม - J-MAT 35)
 * =========================================================================
 * 
 * วิธีการติดตั้ง (ใช้เวลา 2 นาที):
 * 1. เปิด Google Sheets เปล่าขึ้นมา 1 ไฟล์ (เช่น ตั้งชื่อว่า "PromptPost_Survey_Data")
 * 2. ไปที่เมนู "ส่วนขยาย" (Extensions) > "Apps Script"
 * 3. ลบโค้ดเดิมทั้งหมด แล้ววางโค้ดชุดนี้ลงไป
 * 4. กดบันทึก (Ctrl + S)
 * 5. กดปุ่ม "การทำให้ใช้งานได้" (Deploy) มุมขวาบน > เลือก "การทำให้ใช้งานได้รายการใหม่" (New deployment)
 * 6. เลือกประเภท "เว็บแอป" (Web app)
 * 7. ตั้งค่าการเข้าถึง:
 *    - คำอธิบาย: Prompt Post Survey Webhook 9-Parts
 *    - ดำเนินการในฐานะ (Execute as): "ฉัน" (Me)
 *    - ผู้ที่มีสิทธิ์เข้าถึง (Who has access): "ทุกคน" (Anyone) **(สำคัญมาก เพื่อให้ส่งข้อมูลได้โดยไม่ต้องล็อกอิน)**
 * 8. กดปุ่ม "ทำให้ใช้งานได้" (Deploy) แล้วคัดลอก "URL เว็บแอป" (Web app URL)
 * 9. นำ URL ที่ได้ ไปใส่ในหน้า Admin (ปุ่ม ⚙️ ตั้งค่า Google Sheets) หรือใส่ใน js/config.js
 */

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000);

  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // ตั้งค่าหัวตาราง 9 ส่วนคำถามอัตโนมัติหากยังไม่มี
    if (sheet.getLastRow() === 0) {
      var headers = [
        "Timestamp (วันเวลา)",
        "1.1 ช่วงอายุ (Age)",
        "1.2 สถานภาพปัจจุบัน (Status)",
        "1.3 รูปแบบการอยู่อาศัย (Living)",
        "2.1 เอกสารที่ยุ่งยากที่สุด (Pain Docs)",
        "2.2 ประสบการณ์เอกสารหาย (Lost Experience)",
        "2.3 เวลาที่เสียไป (Waste Time)",
        "2.3 ค่าใช้จ่ายที่เสียไป (Waste Money)",
        "3.1 ฟีเจอร์ที่จำเป็น (Hybrid Feature)",
        "3.2 เหตุผลเปิดใช้ครั้งแรก (Trigger Reason)",
        "3.3 ความถี่ในการใช้งาน (Usage Frequency)",
        "3.4 แนวโน้มการใช้งานประจำ (Regular Use Intent)",
        "4.1 มิติชีวิตที่ช่วยลดความกังวล (Life Dimension)",
        "5.1 ช่องทางรับข้อมูลสื่อ (Media Channels)",
        "6.1 ปัจจัยตัดสินใจดาวน์โหลด (Download Factor)",
        "6.2 โมเดลราคาที่ยินดีจ่าย (Pricing Intent)",
        "7.1 การรับรู้แบรนด์ Prompt Post (Brand Awareness)",
        "8.1 ระดับการช่วยแก้ปัญหา (Value Relief)",
        "9.1 ข้อเสนอแนะเพิ่มเติม (Actionable Feedback)",
        "Persona Classification"
      ];
      sheet.appendRow(headers);
      
      var headerRange = sheet.getRange(1, 1, 1, headers.length);
      headerRange.setBackground("#2E3E8A");
      headerRange.setFontColor("#FFFFFF");
      headerRange.setFontWeight("bold");
      sheet.setFrozenRows(1);
    }

    var raw = (e && e.postData && e.postData.contents) ? e.postData.contents : "";
    var data = JSON.parse(raw);

    var row = [
      data.timestamp || new Date().toLocaleString("th-TH", { timeZone: "Asia/Bangkok" }),
      data.ageGroup || "",
      data.status || "",
      data.livingType || "",
      Array.isArray(data.painDocs) ? data.painDocs.join(", ") : (data.painDocs || ""),
      data.lostDocExp || "",
      data.wasteTime || "",
      data.wasteMoney || "",
      Array.isArray(data.hybridFeatureInterest) ? data.hybridFeatureInterest.join(", ") : (data.hybridFeatureInterest || ""),
      data.triggerReason || "",
      data.usageFrequency || "",
      data.regularUseIntent || "",
      data.lifeDimension || "",
      Array.isArray(data.mediaChannels) ? data.mediaChannels.join(", ") : (data.mediaChannels || ""),
      data.downloadFactor || "",
      data.pricingModel || "",
      data.brandAwareness || "",
      data.valueRelief || "",
      data.actionableFeedback || "",
      data.persona || ""
    ];

    sheet.appendRow(row);

    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      message: "Data recorded successfully"
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);

  } finally {
    lock.releaseLock();
  }
}

function doGet(e) {
  return ContentService.createTextOutput("Prompt Post 9-Part Survey Webhook is active and running!");
}
