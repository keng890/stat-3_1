/**
 * Admin Dashboard Logic & Analytics - Real Data Only & Delete Row Support
 * Password: 0637941837
 */

const ADMIN_PASSWORD_HASH = "0637941837";
let charts = {};

const COLORS = {
  primaryRed: "#FE3B1F",
  deepNavy: "#002169",
  navyAccent: "#1E3A8A",
  skyBlue: "#3CB4E5",
  coralRed: "#FF8672",
  darkRed: "#B91E21",
  emerald: "#10B981",
  amber: "#F59E0B",
  purple: "#8B5CF6"
};

// ==========================================
// Authentication Gate
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
  checkAuth();
});

function checkAuth() {
  const isAuth = sessionStorage.getItem("admin_auth") === "true";
  const gate = document.getElementById("password-gate");
  const content = document.getElementById("admin-content");

  if (isAuth) {
    if (gate) gate.style.display = "none";
    if (content) content.style.display = "block";
    initDashboard();
  } else {
    if (gate) gate.style.display = "flex";
    if (content) content.style.display = "none";
  }
}

function handlePasswordSubmit(e) {
  e.preventDefault();
  const input = document.getElementById("admin-pass-input");
  const errorMsg = document.getElementById("pass-error");
  const val = input.value.trim();

  if (val === ADMIN_PASSWORD_HASH) {
    sessionStorage.setItem("admin_auth", "true");
    errorMsg.style.display = "none";
    checkAuth();
  } else {
    errorMsg.style.display = "block";
    input.value = "";
    input.focus();
  }
}

function logoutAdmin() {
  sessionStorage.removeItem("admin_auth");
  location.reload();
}

// ==========================================
// Data Retrieval (Real Data Only)
// ==========================================
function getStoredResponses() {
  const saved = localStorage.getItem(CONFIG.STORAGE_KEY_SURVEYS);
  if (!saved) return [];
  try {
    return JSON.parse(saved);
  } catch (e) {
    return [];
  }
}

function saveResponses(list) {
  localStorage.setItem(CONFIG.STORAGE_KEY_SURVEYS, JSON.stringify(list));
}

// Delete an individual response (useful for test runs)
function deleteResponse(index) {
  if (!confirm(`คุณต้องการลบข้อมูลแถวนี้ (รายการที่ ${index + 1}) ใช่หรือไม่?`)) return;

  const responses = getStoredResponses();
  if (index >= 0 && index < responses.length) {
    responses.splice(index, 1);
    saveResponses(responses);
    initDashboard();
  }
}

function clearAllData() {
  if (!confirm("คุณแน่ใจหรือไม่ว่าต้องการลบข้อมูลคำตอบทั้งหมดในระบบ? (ไม่สามารถกู้คืนได้)")) return;
  localStorage.removeItem(CONFIG.STORAGE_KEY_SURVEYS);
  initDashboard();
}

function initDashboard() {
  const responses = getStoredResponses();
  document.getElementById("last-update").innerText = new Date().toLocaleTimeString("th-TH");

  renderKPIs(responses);
  renderCharts(responses);
  renderInsights(responses);
  renderTable(responses);

  const input = document.getElementById("webhook-input");
  if (input) input.value = localStorage.getItem(CONFIG.STORAGE_KEY_WEBHOOK) || "";
}

// 1. KPI Calculations
function renderKPIs(data) {
  const total = data.length;
  document.getElementById("kpi-total").innerText = total;

  if (total === 0) {
    document.getElementById("kpi-regular-intent").innerText = "0%";
    document.getElementById("kpi-value-relief").innerText = "0%";
    document.getElementById("kpi-awareness").innerText = "0%";
    return;
  }

  // Regular Intent: ใช้อย่างแน่นอน or มีแนวโน้มจะใช้
  const regularCount = data.filter(d => (d.regularUseIntent || "").includes("ใช้อย่างแน่นอน") || (d.regularUseIntent || "").includes("มีแนวโน้มจะใช้")).length;
  document.getElementById("kpi-regular-intent").innerText = `${Math.round((regularCount / total) * 100)}%`;

  // Value Relief: ช่วยได้มากที่สุด
  const reliefCount = data.filter(d => (d.valueRelief || "").includes("มากที่สุด")).length;
  document.getElementById("kpi-value-relief").innerText = `${Math.round((reliefCount / total) * 100)}%`;

  // Awareness: เคยเห็น / เคยได้ยิน / เคยใช้
  const awareCount = data.filter(d => !(d.brandAwareness || "").includes("ไม่เคย")).length;
  document.getElementById("kpi-awareness").innerText = `${Math.round((awareCount / total) * 100)}%`;
}

// 2. Charts
function renderCharts(data) {
  const total = data.length;
  if (total === 0) {
    // Clear existing charts if any
    Object.keys(charts).forEach(id => {
      if (charts[id]) charts[id].destroy();
    });
    charts = {};
    return;
  }

  // Chart 1: Feature Needed (ส่วนที่ 3 ข้อ 1)
  const featMap = {
    "รับ-ส่งเอกสารปลอดภัย": 0,
    "เซ็นเอกสารดิจิทัล": 0,
    "กระเป๋าเอกสาร ThaID": 0,
    "เก็บเอกสารและจ่ายบิล": 0,
    "โหวตออนไลน์/โปสการ์ด": 0
  };
  data.forEach(d => {
    const f = d.hybridFeatureInterest || "";
    if (f.includes("รับ–ส่ง") || f.includes("รับ-ส่ง")) featMap["รับ-ส่งเอกสารปลอดภัย"]++;
    else if (f.includes("เซ็นเอกสาร")) featMap["เซ็นเอกสารดิจิทัล"]++;
    else if (f.includes("กระเป๋าเก็บเอกสาร") || f.includes("ThaID")) featMap["กระเป๋าเอกสาร ThaID"]++;
    else if (f.includes("เก็บเอกสารและจ่ายเงิน")) featMap["เก็บเอกสารและจ่ายบิล"]++;
    else if (f.includes("โหวต") || f.includes("โปสการ์ด")) featMap["โหวตออนไลน์/โปสการ์ด"]++;
  });

  createOrUpdateChart("chartFeatureNeeded", "doughnut", {
    labels: Object.keys(featMap),
    datasets: [{
      data: Object.values(featMap),
      backgroundColor: [COLORS.primaryRed, COLORS.deepNavy, COLORS.skyBlue, COLORS.coralRed, COLORS.amber],
      borderWidth: 2,
      borderColor: "#FFF"
    }]
  }, { plugins: { legend: { position: "bottom" } } });

  // Chart 2: Document Pain Points (ส่วนที่ 2 ข้อ 1)
  const painMap = {
    "เอกสารการศึกษา (Transcript)": 0,
    "เอกสารส่วนตัว/สัญญาเช่าหอ": 0,
    "เอกสารการเงิน/บิลค่าใช้จ่าย": 0,
    "เอกสารการสมัครงาน (Resume)": 0
  };
  data.forEach(d => {
    const arr = Array.isArray(d.painDocs) ? d.painDocs : [d.painDocs || ""];
    arr.forEach(p => {
      if (p.includes("การศึกษา") || p.includes("Transcript")) painMap["เอกสารการศึกษา (Transcript)"]++;
      if (p.includes("ส่วนตัว") || p.includes("สัญญาเช่า")) painMap["เอกสารส่วนตัว/สัญญาเช่าหอ"]++;
      if (p.includes("การเงิน") || p.includes("บิล")) painMap["เอกสารการเงิน/บิลค่าใช้จ่าย"]++;
      if (p.includes("สมัครงานอื่นๆ") || p.includes("Resume")) painMap["เอกสารการสมัครงาน (Resume)"]++;
    });
  });

  createOrUpdateChart("chartPainPoints", "bar", {
    labels: Object.keys(painMap),
    datasets: [{
      label: "จำนวนคนที่พบปัญหา",
      data: Object.values(painMap),
      backgroundColor: COLORS.deepNavy,
      borderRadius: 6
    }]
  }, {
    indexAxis: "y",
    plugins: { legend: { display: false } },
    scales: { x: { beginAtZero: true, ticks: { stepSize: 1 } } }
  });

  // Chart 3: Media Channels (ส่วนที่ 5)
  const mediaMap = {
    "Facebook": 0,
    "Instagram": 0,
    "TikTok": 0,
    "YouTube Shorts": 0,
    "X (Twitter)": 0,
    "Google/บล็อก": 0,
    "เพื่อนแนะนำ": 0
  };
  data.forEach(d => {
    const arr = Array.isArray(d.mediaChannels) ? d.mediaChannels : [d.mediaChannels || ""];
    arr.forEach(m => {
      if (m.includes("TikTok")) mediaMap["TikTok"]++;
      else if (m.includes("Instagram")) mediaMap["Instagram"]++;
      else if (m.includes("Facebook")) mediaMap["Facebook"]++;
      else if (m.includes("YouTube")) mediaMap["YouTube Shorts"]++;
      else if (m.includes("Twitter") || m.includes("X")) mediaMap["X (Twitter)"]++;
      else if (m.includes("Google")) mediaMap["Google/บล็อก"]++;
      else if (m.includes("เพื่อน")) mediaMap["เพื่อนแนะนำ"]++;
    });
  });

  createOrUpdateChart("chartMedia", "bar", {
    labels: Object.keys(mediaMap),
    datasets: [{
      label: "จำนวนคน",
      data: Object.values(mediaMap),
      backgroundColor: COLORS.primaryRed,
      borderRadius: 6
    }]
  }, {
    plugins: { legend: { display: false } },
    scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } }
  });

  // Chart 4: Pricing Model (ส่วนที่ 6 ข้อ 2)
  const priceMap = {
    "ฟรี (ดูโฆษณา)": 0,
    "จ่ายรายเดือน": 0,
    "จ่ายรายปี": 0,
    "ซื้อขาดครั้งเดียว": 0
  };
  data.forEach(d => {
    const p = d.pricingModel || "";
    if (p.includes("ฟรี")) priceMap["ฟรี (ดูโฆษณา)"]++;
    else if (p.includes("รายเดือน")) priceMap["จ่ายรายเดือน"]++;
    else if (p.includes("รายปี")) priceMap["จ่ายรายปี"]++;
    else if (p.includes("ซื้อขาด") || p.includes("Lifetime")) priceMap["ซื้อขาดครั้งเดียว"]++;
  });

  createOrUpdateChart("chartPricing", "doughnut", {
    labels: Object.keys(priceMap),
    datasets: [{
      data: Object.values(priceMap),
      backgroundColor: [COLORS.coralRed, COLORS.primaryRed, COLORS.deepNavy, COLORS.emerald],
      borderWidth: 2,
      borderColor: "#FFF"
    }]
  }, { plugins: { legend: { position: "bottom" } } });
}

function createOrUpdateChart(canvasId, type, dataConfig, extraOptions = {}) {
  const ctx = document.getElementById(canvasId);
  if (!ctx) return;

  if (charts[canvasId]) {
    charts[canvasId].destroy();
  }

  charts[canvasId] = new Chart(ctx, {
    type: type,
    data: dataConfig,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      font: { family: "'IBM Plex Sans Thai', sans-serif" },
      ...extraOptions
    }
  });
}

// 3. Render Insights
function renderInsights(data) {
  const container = document.getElementById("insights-list");
  if (!container) return;

  const total = data.length;
  if (total === 0) {
    container.innerHTML = "<li>ยังไม่มีข้อมูลสำหรับวิเคราะห์ (ระบบพร้อมรับข้อมูลจริงจากผู้ตอบแบบสำรวจ)</li>";
    return;
  }

  const regularCount = data.filter(d => (d.regularUseIntent || "").includes("ใช้อย่างแน่นอน") || (d.regularUseIntent || "").includes("มีแนวโน้มจะใช้")).length;
  const reliefCount = data.filter(d => (d.valueRelief || "").includes("มากที่สุด")).length;
  const eduPain = data.filter(d => (Array.isArray(d.painDocs) ? d.painDocs.join(",") : d.painDocs || "").includes("การศึกษา")).length;
  const freeModel = data.filter(d => (d.pricingModel || "").includes("ฟรี")).length;

  const insightsHtml = `
    <li><strong>แนวโน้มการใช้งานประจำ (High Retention Potential):</strong> ผู้ตอบแบบสำรวจถึง <strong>${Math.round((regularCount/total)*100)}%</strong> ระบุว่ามีแนวโน้มหรือใช้อย่างแน่นอนหากแอปพร้อมใช้งาน</li>
    <li><strong>คุณค่าในการแก้ปัญหา (Core Value Proposition):</strong> ผู้ตอบกว่า <strong>${Math.round((reliefCount/total)*100)}%</strong> รู้สึกว่าฟีเจอร์ของแอปช่วยแก้ปัญหาในชีวิตประจำวันได้มากที่สุด (ตรงกับปัญหาที่พบอยู่พอดี)</li>
    <li><strong>ปัญหาเอกสารอันดับ 1:</strong> เอกสารการศึกษาและวุฒิบัตร (Transcript) เป็นปัญหาที่พบมากที่สุด คิดเป็น <strong>${Math.round((eduPain/total)*100)}%</strong> ของกลุ่มตัวอย่าง</li>
    <li><strong>ความต้องการด้านราคา:</strong> ผู้ตอบ <strong>${Math.round((freeModel/total)*100)}%</strong> ต้องการเริ่มต้นด้วยการใช้งานฟรี (ยอมดูโฆษณา) จึงเหมาะกับกลยุทธ์ Freemium ในช่วงเปิดตัว</li>
  `;

  container.innerHTML = insightsHtml;
}

function copyInsights() {
  const text = Array.from(document.querySelectorAll("#insights-list li"))
    .map(li => "• " + li.innerText.replace(/\s+/g, " ").trim())
    .join("\n\n");

  navigator.clipboard.writeText(text).then(() => {
    alert("คัดลอกข้อความสรุป Insights สำเร็จ! สามารถนำไปวางในเล่มรายงานหรือสไลด์ได้ทันที");
  });
}

// 4. Data Table with Individual Row Delete
function renderTable(data) {
  const tbody = document.getElementById("responses-tbody");
  if (!tbody) return;

  if (data.length === 0) {
    tbody.innerHTML = '<tr><td colspan="12" style="text-align: center; color: var(--text-muted); padding: 24px;">ยังไม่มีข้อมูลคำตอบจริงในระบบ (สามารถทดลองทำแบบสอบถามเพื่อดูผลได้ทันที)</td></tr>';
    return;
  }

  tbody.innerHTML = data.map((row, index) => {
    const age = row.ageGroup ? row.ageGroup.split(" ")[0] : "-";
    const status = row.status || "-";
    const living = row.livingType || "-";
    const feature = row.hybridFeatureInterest ? row.hybridFeatureInterest.split(" ")[0] : "-";
    const trigger = row.triggerReason || "-";
    const regular = row.regularUseIntent ? (row.regularUseIntent.includes("แน่นอน") ? "🟢 ใช้แน่นอน" : row.regularUseIntent) : "-";
    const dimension = row.lifeDimension ? row.lifeDimension.split(":")[0] : "-";
    const pricing = row.pricingModel || "-";
    const awareness = row.brandAwareness || "-";
    const feedback = row.actionableFeedback || "-";

    return `
      <tr>
        <td>
          <button class="btn-delete-row" title="ลบข้อมูลแถวนี้" onclick="deleteResponse(${index})">
            🗑️ ลบ
          </button>
        </td>
        <td style="font-size: 11.5px; color: var(--text-muted);">${row.timestamp || "-"}</td>
        <td>${age}</td>
        <td>${status}</td>
        <td>${living}</td>
        <td style="max-width: 140px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${row.hybridFeatureInterest || ''}">${feature}</td>
        <td style="max-width: 140px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${trigger}">${trigger}</td>
        <td>${regular}</td>
        <td>${dimension}</td>
        <td>${pricing}</td>
        <td>${awareness}</td>
        <td style="max-width: 140px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${feedback}">${feedback}</td>
      </tr>
    `;
  }).join("");
}

// 5. Export to CSV (Thai UTF-8 BOM)
function exportToCSV() {
  const data = getStoredResponses();
  if (data.length === 0) {
    alert("ไม่มีข้อมูลสำหรับส่งออก");
    return;
  }

  const headers = [
    "Timestamp", "1.1_Age", "1.2_Status", "1.3_Living", "2.1_Pain_Docs",
    "2.2_Lost_Doc_Exp", "2.3_Waste_Time", "2.4_Waste_Money", "3.1_Feature_Interest",
    "3.2_Trigger_Reason", "3.3_Usage_Frequency", "3.4_Regular_Intent",
    "4.1_Life_Dimension", "5.1_Media_Channels", "6.1_Download_Factor",
    "6.2_Pricing_Model", "7.1_Brand_Awareness", "8.1_Value_Relief", "9.1_Actionable_Feedback"
  ];

  let csvRows = [];
  csvRows.push(headers.join(","));

  data.forEach(item => {
    const painDocs = Array.isArray(item.painDocs) ? item.painDocs.join(";") : (item.painDocs || "");
    const media = Array.isArray(item.mediaChannels) ? item.mediaChannels.join(";") : (item.mediaChannels || "");
    const values = [
      `"${item.timestamp || ""}"`,
      `"${item.ageGroup || ""}"`,
      `"${item.status || ""}"`,
      `"${item.livingType || ""}"`,
      `"${painDocs.replace(/"/g, '""')}"`,
      `"${(item.lostDocExp || "").replace(/"/g, '""')}"`,
      `"${item.wasteTime || ""}"`,
      `"${item.wasteMoney || ""}"`,
      `"${(item.hybridFeatureInterest || "").replace(/"/g, '""')}"`,
      `"${(item.triggerReason || "").replace(/"/g, '""')}"`,
      `"${item.usageFrequency || ""}"`,
      `"${(item.regularUseIntent || "").replace(/"/g, '""')}"`,
      `"${(item.lifeDimension || "").replace(/"/g, '""')}"`,
      `"${media.replace(/"/g, '""')}"`,
      `"${(item.downloadFactor || "").replace(/"/g, '""')}"`,
      `"${(item.pricingModel || "").replace(/"/g, '""')}"`,
      `"${(item.brandAwareness || "").replace(/"/g, '""')}"`,
      `"${(item.valueRelief || "").replace(/"/g, '""')}"`,
      `"${(item.actionableFeedback || "").replace(/"/g, '""')}"`
    ];
    csvRows.push(values.join(","));
  });

  const csvString = "\uFEFF" + csvRows.join("\n");
  const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `PromptPost_Survey_RealData_${new Date().toISOString().slice(0,10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// 6. Webhook Modal
function openWebhookModal() {
  document.getElementById("webhook-modal").style.display = "flex";
}
function closeWebhookModal() {
  document.getElementById("webhook-modal").style.display = "none";
}
function saveWebhookUrl() {
  const url = document.getElementById("webhook-input").value.trim();
  localStorage.setItem(CONFIG.STORAGE_KEY_WEBHOOK, url);
  CONFIG.GOOGLE_SHEET_WEBHOOK_URL = url;
  closeWebhookModal();
  alert("บันทึก Google Sheets Webhook สำเร็จ!");
}
