# Ant Design Enterprise Dashboard Style Guide

## 1. Brand & Color Palette (Ant Design Tokens)
* **Sidebar Navy:** `#001529` (Ant Design Menu Dark Background)
* **Sidebar Active/Hover:** `#1890ff` (Primary Brand Blue)
* **Primary Accent:** `#1890ff`
* **Success Green:** `#52c41a`
* **Warning Gold:** `#faad14`
* **Danger Red:** `#f5222d`
* **Canvas Background:** `#f0f2f5`
* **Card Surface:** `#ffffff`
* **Border Color:** `#f0f0f0` / `#e8e8e8`
* **Text Primary:** `rgba(0, 0, 0, 0.85)`
* **Text Secondary:** `rgba(0, 0, 0, 0.45)`

## 2. Layout Structure & Geometry
* **Sidebar Navigation:** Fixed width `220px`, collapsible to `80px`
* **Header Height:** `64px`, background `#ffffff`, border-bottom `1px solid #f0f0f0`
* **Content Padding:** `24px`
* **Card Border Radius:** `2px` (Ant Design standard)
* **Box Shadow:** `0 1px 2px -2px rgba(0, 0, 0, 0.16), 0 3px 6px 0 rgba(0, 0, 0, 0.12), 0 5px 12px 4px rgba(0, 0, 0, 0.09)`

## 3. Component Specifications
* **KPI Summary Cards (4 Cards across top):**
  - Card 1: Total Sales (¥) + WoW / DoD comparison + Daily Sales footer
  - Card 2: Visits + Mini Sparkline Area Chart + Daily Visits footer
  - Card 3: Payments + Mini Sparkline Bar Chart + Conversion Rate footer
  - Card 4: Operational Effect + Progress Bar + WoW / DoD footer
* **Main Sales/Visits Card:**
  - Tab Switcher: "Sales" | "Visits"
  - Quick Period Buttons: `All day`, `All week`, `All month`, `All year`
  - Date Range Picker: `[YYYY-MM-DD] ~ [YYYY-MM-DD]`
  - Grouped Bar Chart (Time Trend)
  - Sales Ranking List (Top 1-7 with circular badges: #1-3 black, #4-7 gray)
* **Live Status Pill:**
  - Badge with pulsing status dot (`#52c41a` for Connected, `#f5222d` for Error)
  - Text: `LIVE DATA CONNECTED` + Last Sync Timestamp
