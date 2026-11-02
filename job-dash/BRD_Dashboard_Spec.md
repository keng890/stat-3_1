# Business Requirements Document (BRD)
## Project Name: AI & Data Science Talent Supply, Demand & Skill Mismatch Dashboard
**Target Developer:** Antigravity AI Agent  
**Format:** Markdown (.md)  

---

## 1. Executive Summary & Core Rules

เอกสารกำหนดข้อกำหนดการพัฒนา Interactive Dashboard วิเคราะห์ฝั่งอุปทาน (Supply) อุปสงค์ (Demand) และ Skill Mismatch

### Key Technical Constraints
1. **Backend Engine:** Python 3.10+ (Dash by Plotly หรือ Streamlit)
2. **Visualization Core:** Plotly Express / Plotly Graph Objects
3. **Cross-Filtering Interactivity:** ทุกกราฟในแท็บเดียวกันต้องเชื่อมโยงกัน (Linked Callback) เมื่อคลิก Element ในกราฟใด กราฟอื่นในแท็บต้องอัปเดตข้อมูลแบบ Dynamic

---

## 2. Dashboard Tabs Structure

### Tab 1: ปริมาณคนที่จบและสกิลที่เรียนมา (Academic Supply Side)
* **Chart 1.1:** จำนวนผู้สำเร็จการศึกษาแยกตามหลักสูตรและปี (`graduates_count` vs `academic_year`)
* **Chart 1.2:** รายวิชาบังคับและทักษะที่ตรงสายงาน (`compulsory_courses` & `courses_skills`)
* **Chart 1.3:** อัตราการได้งานทำของบัณฑิตหลังจบ 1–3 ปี (`emp_year_1`, `emp_year_2`, `emp_year_3`)
* **Chart 1.4:** ค่าธรรมเนียมการศึกษาตลอดหลักสูตร (`tuition_fee_total`)

### Tab 2: ปริมาณงานที่จ้างและสกิลที่ต้องการ (Market Demand Side)
* **Chart 2.1:** ปริมาณตำแหน่งงานว่างจำแนกตามตำแหน่งและอุตสาหกรรม (`vacancies_count`)
* **Chart 2.2:** ทักษะที่ถูกระบุมากที่สุดในใบสมัครงาน (`required_skills` Frequency)
* **Chart 2.3:** บริษัทที่เปิดรับสมัครงานสูงสุด (`company_name` vs `vacancies_count`)
* **Chart 2.4:** โครงสร้างเงินเดือนเริ่มต้นแบ่งตามระดับการทำงาน (`job_level` vs `avg_salary`)

### Tab 3: วิเคราะห์ Skill Mismatch (Academic vs. Market Gap Analysis)
* **Chart 3.1:** Academic Supply vs Market Demand Skill Matrix (Radar/Diverging Bar Chart)
* **Chart 3.2:** สรุปสถานะ Skill Gap (High Demand/Low Supply Shortage Heatmap)
