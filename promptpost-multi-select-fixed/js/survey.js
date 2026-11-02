/**
 * Survey Logic & State Management - Updated with all custom inputs and 9 parts
 */

let currentStep = 1;
const totalSteps = 9;

const surveyData = {
  // ส่วนที่ 1: Screening & Demographics
  ageGroup: "",
  status: "",
  livingType: "",
  
  // ส่วนที่ 2: Behavior & Pain Points
  painDocs: [],
  lostDocExp: "",
  wasteTime: "",
  wasteMoney: "",

  // ส่วนที่ 3: Hybrid Use Case & Value Proposition
  hybridFeatureInterest: [],
  triggerReason: "",
  usageFrequency: "",
  regularUseIntent: "",

  // ส่วนที่ 4: Pain to Solution Connection
  lifeDimension: "",

  // ส่วนที่ 5: Marketing Channels
  mediaChannels: [],

  // ส่วนที่ 6: Conversion & Pricing Intent
  downloadFactor: [],
  pricingModel: "",

  // ส่วนที่ 7: Brand Awareness
  brandAwareness: "",

  // ส่วนที่ 8: Value & Pain Point Relief
  valueRelief: "",

  // ส่วนที่ 9: Actionable Feedback
  actionableFeedback: "",

  timestamp: ""
};

// Selection Handlers
function selectSingle(element, hasInput = false) {
  const parent = element.closest(".options-list");
  parent.querySelectorAll(".option-item").forEach(item => item.classList.remove("selected"));
  element.classList.add("selected");

  const fieldName = parent.getAttribute("data-name");
  let value = element.querySelector(".option-text").innerText.trim();
  surveyData[fieldName] = value;
}

function selectMultiple(element, maxLimit = 99) {
  const parent = element.closest(".options-list");
  const currentlySelected = parent.querySelectorAll(".option-item.selected");

  if (!element.classList.contains("selected") && currentlySelected.length >= maxLimit) {
    alert(`คุณสามารถเลือกได้สูงสุดไม่เกิน ${maxLimit} ข้อครับ`);
    return;
  }

  element.classList.toggle("selected");
  const fieldName = parent.getAttribute("data-name");

  const selectedItems = parent.querySelectorAll(".option-item.selected");
  const values = Array.from(selectedItems).map(item => item.querySelector(".option-text").innerText.trim());
  surveyData[fieldName] = values;
}

// Step 1: Screening & Termination Check
function handleStep1Next() {
  if (!validateStep(1)) return;

  // Retrieve 'other' inputs if selected
  const statusOther = document.getElementById("status-other").value.trim();
  if (surveyData.status.includes("อื่นๆ") && statusOther) {
    surveyData.status = `อื่นๆ: ${statusOther}`;
  }

  const livingOther = document.getElementById("living-other").value.trim();
  if (surveyData.livingType.includes("อื่นๆ") && livingOther) {
    surveyData.livingType = `อื่นๆ: ${livingOther}`;
  }

  // Terminate Check:
  // 1. Age: < 21 หรือ > 25
  // 2. Status: ทำงานมาแล้วมากกว่า 1 ปี
  if (
    surveyData.ageGroup.includes("น้อยกว่า 21") || 
    surveyData.ageGroup.includes("มากกว่า 25") || 
    surveyData.status.includes("มากกว่า 1 ปี")
  ) {
    terminateSurvey();
    return;
  }

  nextStep(1);
}

function terminateSurvey() {
  document.getElementById("survey-form").style.display = "none";
  document.getElementById("progress-wrapper").style.display = "none";
  document.getElementById("hero-banner").style.display = "none";
  document.getElementById("terminate-screen").style.display = "block";
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function updateProgress(step) {
  const percent = Math.round((step / totalSteps) * 100);
  const progressBar = document.getElementById("progress-bar");
  const stepLabel = document.getElementById("step-label");
  const stepPercent = document.getElementById("step-percent");

  const stepTitles = [
    "ส่วนที่ 1: Screening & Demographics",
    "ส่วนที่ 2: Behavior & Pain Points",
    "ส่วนที่ 3: Hybrid Use Case & Value Proposition",
    "ส่วนที่ 4: Pain to Solution Connection",
    "ส่วนที่ 5: Target & Marketing Channels",
    "ส่วนที่ 6: Conversion & Pricing Intent",
    "ส่วนที่ 7: Brand Awareness",
    "ส่วนที่ 8: Value & Pain Point Relief",
    "ส่วนที่ 9: Actionable Feedback"
  ];

  if (progressBar) progressBar.style.width = `${percent}%`;
  if (stepLabel) stepLabel.innerText = `${stepTitles[step - 1] || `ส่วนที่ ${step}`} (${step}/${totalSteps})`;
  if (stepPercent) stepPercent.innerText = `${percent}%`;
}

function validateStep(stepNumber) {
  const currentCard = document.querySelector(`.survey-step[data-step="${stepNumber}"]`);
  if (!currentCard) return true;

  const requiredLists = currentCard.querySelectorAll('.options-list[data-required="true"]');
  for (let list of requiredLists) {
    const fieldName = list.getAttribute("data-name");
    const isMulti = list.getAttribute("data-type") === "multi";

    if (isMulti) {
      if (!surveyData[fieldName] || surveyData[fieldName].length === 0) {
        alert("กรุณาเลือกคำตอบอย่างน้อย 1 ข้อเพื่อไปต่อครับ");
        return false;
      }
    } else {
      if (!surveyData[fieldName] || surveyData[fieldName] === "") {
        alert("กรุณาเลือกคำตอบให้ครบถ้วนเพื่อไปต่อครับ");
        return false;
      }
    }
  }
  return true;
}

function nextStep(step) {
  // Capture specific inputs for current step
  if (step === 2) {
    const painOther = document.getElementById("pain-other").value.trim();
    if (painOther && Array.isArray(surveyData.painDocs)) {
      surveyData.painDocs = surveyData.painDocs.map(p => p.includes("อื่นๆ") ? `อื่นๆ: ${painOther}` : p);
    }
    const lostDetail = document.getElementById("lost-doc-detail").value.trim();
    if (surveyData.lostDocExp.includes("เคยประสบปัญหา") && lostDetail) {
      surveyData.lostDocExp = `เคยประสบปัญหา: ${lostDetail}`;
    }
  }

  if (step === 3) {
    const triggerOther = document.getElementById("trigger-other").value.trim();
    if (surveyData.triggerReason.includes("อื่นๆ") && triggerOther) {
      surveyData.triggerReason = `อื่นๆ: ${triggerOther}`;
    }
    const usageOther = document.getElementById("usage-other").value.trim();
    if (surveyData.usageFrequency.includes("อื่นๆ") && usageOther) {
      surveyData.usageFrequency = `อื่นๆ: ${usageOther}`;
    }
  }

  if (step === 5) {
    const mediaOther = document.getElementById("media-other").value.trim();
    if (mediaOther && Array.isArray(surveyData.mediaChannels)) {
      surveyData.mediaChannels = surveyData.mediaChannels.map(m => m.includes("อื่นๆ") ? `อื่นๆ: ${mediaOther}` : m);
    }
  }

  if (step === 6) {
    const factorOther = document.getElementById("factor-other").value.trim();
    if (surveyData.downloadFactor.includes("อื่นๆ") && factorOther) {
      surveyData.downloadFactor = `อื่นๆ: ${factorOther}`;
    }
    const pricingOther = document.getElementById("pricing-other").value.trim();
    if (surveyData.pricingModel.includes("อื่นๆ") && pricingOther) {
      surveyData.pricingModel = `อื่นๆ: ${pricingOther}`;
    }
  }

  if (!validateStep(step)) return;

  const currentCard = document.querySelector(`.survey-step[data-step="${step}"]`);
  const nextCard = document.querySelector(`.survey-step[data-step="${step + 1}"]`);

  if (currentCard) currentCard.style.display = "none";
  if (nextCard) {
    nextCard.style.display = "block";
    window.scrollTo({ top: 60, behavior: "smooth" });
  }

  currentStep = step + 1;
  updateProgress(currentStep);
}

function prevStep(step) {
  const currentCard = document.querySelector(`.survey-step[data-step="${step}"]`);
  const prevCard = document.querySelector(`.survey-step[data-step="${step - 1}"]`);

  if (currentCard) currentCard.style.display = "none";
  if (prevCard) {
    prevCard.style.display = "block";
    window.scrollTo({ top: 60, behavior: "smooth" });
  }

  currentStep = step - 1;
  updateProgress(currentStep);
}

// Submit Survey
async function submitSurvey() {
  const submitBtn = document.getElementById("btn-submit");

  // Retrieve final feedback
  const feedbackInput = document.getElementById("actionable-feedback");
  surveyData.actionableFeedback = feedbackInput ? feedbackInput.value.trim() : "";
  surveyData.timestamp = new Date().toLocaleString("th-TH", { timeZone: "Asia/Bangkok" });

  submitBtn.disabled = true;
  submitBtn.innerHTML = "<span>กำลังส่งคำตอบ...</span>";

  // 1. Save locally for Admin dashboard
  try {
    let localData = JSON.parse(localStorage.getItem(CONFIG.STORAGE_KEY_SURVEYS) || "[]");
    localData.push(surveyData);
    localStorage.setItem(CONFIG.STORAGE_KEY_SURVEYS, JSON.stringify(localData));
  } catch (err) {
    console.warn("Could not save to localStorage", err);
  }

  // 2. Submit to Google Sheets Webhook if configured
  const webhookUrl = CONFIG.GOOGLE_SHEET_WEBHOOK_URL;
  if (webhookUrl && webhookUrl.trim() !== "") {
    try {
      await fetch(webhookUrl, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(surveyData)
      });
    } catch (netErr) {
      console.warn("Google Sheets network submission handled:", netErr);
    }
  }

  // Show Success Screen
  document.getElementById("survey-form").style.display = "none";
  document.getElementById("progress-wrapper").style.display = "none";
  document.getElementById("hero-banner").style.display = "none";
  document.getElementById("success-screen").style.display = "block";
  window.scrollTo({ top: 0, behavior: "smooth" });
}
