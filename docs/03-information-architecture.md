# Information Architecture & Sidebar Navigation

## Primary Language

- UI: Persian (RTL)
- Technical labels: Persian + optional English where clarity helps
- Feature maturity badges: `فعال` | `نمایشی (Mock)` | `برنامه‌ریزی‌شده`

## Sidebar Structure

### مرور کلی (Overview)
- داشبورد مدیریتی (Executive Dashboard) — **M1 primary**

### تحلیل‌ها (Analytics)
- تحلیل درخواست‌ها (Request Analytics)
- تحلیل شکایات (Complaint Analytics)
- تحلیل دسته‌بندی (Category Analysis)
- کاوش موضوع و خوشه (Topic & Cluster Exploration)
- تحلیل احساسات (Sentiment Analysis) — planned/demo
- تحلیل روند (Trend Analysis)
- تحلیل جغرافیایی / شعب (Geographic / Branch Analysis)

### عملکرد (Performance)
- پایش شاخص‌ها (KPI Monitoring)
- SLA و زمان پاسخ
- عملکرد واحد سازمانی
- توزیع بار کاری

### هوش دانش (Knowledge Intelligence)
- پوشش پاسخ تاریخی
- کاوش موارد مشابه
- پایگاه دانش — planned
- مدیریت بخشنامه‌ها و مقررات — planned

### هوش مصنوعی (AI Intelligence) — mostly planned / demo-labeled
- عملکرد مدل‌ها
- ارزیابی طبقه‌بندی
- توزیع اطمینان
- پایش مدل

### گزارش‌ها (Reports)
- گزارش‌های استاندارد
- گزارش‌های سفارشی — planned
- مرکز خروجی (Export Center)

### مدیریت سامانه (Administration)
- کاربران و نقش‌ها
- منابع داده
- پایش یکپارچه‌سازی
- لاگ ممیزی
- تنظیمات سامانه

## Role-Based Visibility (Initial Mapping)

| Nav Group | Executive | Analytics Mgr | Supervisor | Expert | Admin |
|-----------|-----------|---------------|------------|--------|-------|
| Overview | Full | Full | Full | Limited | Full |
| Analytics | Summary | Full | Full | Limited | Full |
| Performance | Full | Full | Full | Limited | Full |
| Knowledge | Summary | Full | Full | Full | Full |
| AI | Summary | Full | Limited | Limited | Full |
| Reports | Full | Full | Full | Limited | Full |
| Administration | None | None | None | None | Full |

## Page Priority for Implementation

1. Executive Dashboard (first)
2. Request & Complaint Analytics
3. Category Explorer
4. Topic & Cluster Explorer
5. Historical Answer Intelligence
6. KPI & Performance
7. Reports & Exports
8. AI Performance (shell + demo labels)
9. Administration shells
