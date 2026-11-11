import type { CategoryExplorerData } from "@/data/providers/types";

/**
 * Hierarchical taxonomy snapshot shaped by Didban lookups:
 * Zone / SubjectNature → SubjectGroup → Subject
 * Counts are Mock — names mirror inspected Behzisti dimensions.
 */
export const mockCategoryExplorer: CategoryExplorerData = {
  meta: {
    source: "mock",
    label: "کاوش دسته‌بندی — تاکسونومی نمایشی الهام‌گرفته از Subject*/Zone دیده‌بان",
    periodLabel: "۱۴۰۴/۰۷/۰۱ تا ۱۴۰۴/۰۸/۲۰",
    note: "این درخت تاکسونومی نهایی سازمانی نیست؛ پس از تأیید کسب‌وکار قابل پیکربندی است.",
  },
  summary: [
    {
      id: "nodes",
      label: "گره‌های فعال در درخت",
      value: 42,
      unit: "count",
      feasibility: "illustrative",
    },
    {
      id: "leaf-subjects",
      label: "موضوعات برگ (Subject)",
      value: 28,
      unit: "count",
      feasibility: "illustrative",
      hint: "در دیده‌بان حدود ۴۲۰ Subject وجود دارد؛ اینجا نمونه نمایشی است",
    },
    {
      id: "top-share",
      label: "سهم بزرگ‌ترین حوزه",
      value: 31.2,
      unit: "percent",
      deltaPercent: 1.4,
      feasibility: "illustrative",
    },
    {
      id: "growth-hot",
      label: "بیشترین رشد نسبی",
      value: 14.2,
      unit: "percent",
      tone: "warning",
      feasibility: "illustrative",
      hint: "حق پرستاری / مددکاری",
    },
  ],
  tree: [
    {
      id: "zone-rehab",
      level: "zone",
      name: "حیطه امور توانبخشی",
      count: 6120,
      growthPercent: 6.8,
      children: [
        {
          id: "nat-rehab-care",
          level: "nature",
          name: "توانبخشی آموزشی، حرفه‌ای و توانپزشکی",
          count: 2480,
          growthPercent: 5.2,
          children: [
            {
              id: "grp-nursing",
              level: "group",
              name: "حق پرستاری",
              count: 1320,
              growthPercent: 14.2,
              children: [
                {
                  id: "sub-nursing-severe",
                  level: "subject",
                  name: "حق پرستاری و مددکاری معلولیت شدید و خیلی شدید",
                  count: 980,
                  growthPercent: 14.2,
                  complaintSharePercent: 18,
                  samples: [
                    {
                      id: "c-10021",
                      caption: "پیگیری قطع حق پرستاری فرزند معلول",
                      className: "شکایت",
                      status: "رسیدگی توسط پردازش",
                    },
                    {
                      id: "c-10088",
                      caption: "درخواست برقراری مجدد حق پرستاری",
                      className: "راهنمایی و ارشاد",
                      status: "تایید نهایی",
                    },
                  ],
                },
                {
                  id: "sub-nursing-home",
                  level: "subject",
                  name: "خدمات توانبخشی و مراقبتی در منزل",
                  count: 340,
                  growthPercent: 7.1,
                  complaintSharePercent: 22,
                  samples: [
                    {
                      id: "c-10112",
                      caption: "تأخیر در اعزام مراقب منزل",
                      className: "شکایت",
                      status: "ارجاع شد",
                    },
                  ],
                },
              ],
            },
            {
              id: "grp-pension",
              level: "group",
              name: "مستمری توانبخشی",
              count: 1160,
              growthPercent: 9.4,
              children: [
                {
                  id: "sub-pension-increase",
                  level: "subject",
                  name: "افزایش مبلغ، میزان و زمان واریز مستمری توانبخشی",
                  count: 720,
                  growthPercent: 11.4,
                  complaintSharePercent: 28,
                  samples: [
                    {
                      id: "c-10201",
                      caption: "واریز نشدن افزایش مستمری ماه جاری",
                      className: "شکایت",
                      status: "رسیدگی توسط پردازش",
                    },
                  ],
                },
                {
                  id: "sub-pension-start",
                  level: "subject",
                  name: "برقراری مستمری توانبخشی",
                  count: 440,
                  growthPercent: 4.6,
                  complaintSharePercent: 15,
                },
              ],
            },
          ],
        },
        {
          id: "nat-finance-rehab",
          level: "nature",
          name: "امور مالی مرتبط با توانبخشی",
          count: 1760,
          growthPercent: 3.8,
          children: [
            {
              id: "grp-aid",
              level: "group",
              name: "کمک موردی / معیشتی توانبخشی",
              count: 1120,
              growthPercent: 6.8,
              children: [
                {
                  id: "sub-aid-case",
                  level: "subject",
                  name: "کمک موردی توانبخشی",
                  count: 640,
                  growthPercent: 6.8,
                  complaintSharePercent: 21,
                },
                {
                  id: "sub-aid-living",
                  level: "subject",
                  name: "کمک معیشتی",
                  count: 480,
                  growthPercent: 2.1,
                  complaintSharePercent: 12,
                },
              ],
            },
            {
              id: "grp-device",
              level: "group",
              name: "وسایل کمک توانبخشی",
              count: 640,
              growthPercent: 1.4,
              children: [
                {
                  id: "sub-device",
                  level: "subject",
                  name: "کمک هزینه وسایل کمک توانبخشی و لوازم بهداشتی",
                  count: 640,
                  growthPercent: 1.4,
                  complaintSharePercent: 19,
                },
              ],
            },
          ],
        },
        {
          id: "nat-medical-board",
          level: "nature",
          name: "کمیسیون پزشکی — تعیین نوع و شدت معلولیت",
          count: 640,
          growthPercent: 8.0,
          children: [
            {
              id: "grp-board",
              level: "group",
              name: "کمیسیون پزشکی",
              count: 640,
              growthPercent: 8.0,
              children: [
                {
                  id: "sub-board",
                  level: "subject",
                  name: "کمیسیون پزشکی - توانبخشی تعیین نوع و شدت معلولیت",
                  count: 640,
                  growthPercent: 8.0,
                  complaintSharePercent: 25,
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: "zone-social",
      level: "zone",
      name: "حیطه سلامت اجتماعی",
      count: 3280,
      growthPercent: 4.1,
      children: [
        {
          id: "nat-women",
          level: "nature",
          name: "خانواده، بانوان",
          count: 980,
          growthPercent: 5.5,
          children: [
            {
              id: "grp-women",
              level: "group",
              name: "امور زنان",
              count: 980,
              growthPercent: 5.5,
              children: [
                {
                  id: "sub-women-support",
                  level: "subject",
                  name: "خدمات مرتبط با مادران باردار و چندقلوها",
                  count: 420,
                  growthPercent: 7.2,
                  complaintSharePercent: 10,
                },
                {
                  id: "sub-family-aid",
                  level: "subject",
                  name: "کمک هزینه تشکیل خانواده",
                  count: 310,
                  growthPercent: 3.4,
                  complaintSharePercent: 8,
                },
                {
                  id: "sub-other-women",
                  level: "subject",
                  name: "سایر خدمات اجتماعی زنان",
                  count: 250,
                  growthPercent: 1.1,
                  complaintSharePercent: 6,
                },
              ],
            },
          ],
        },
        {
          id: "nat-children",
          level: "nature",
          name: "مراقبت و توانمندسازی کودکان و نوجوانان",
          count: 860,
          growthPercent: 2.8,
          children: [
            {
              id: "grp-children",
              level: "group",
              name: "شبه خانواده / نگهداری",
              count: 860,
              growthPercent: 2.8,
              children: [
                {
                  id: "sub-adoption",
                  level: "subject",
                  name: "فرزندخواندگی",
                  count: 280,
                  growthPercent: 4.0,
                  complaintSharePercent: 14,
                },
                {
                  id: "sub-care-center",
                  level: "subject",
                  name: "نگهداری کودکان فاقد سرپرست موثر",
                  count: 580,
                  growthPercent: 2.2,
                  complaintSharePercent: 16,
                },
              ],
            },
          ],
        },
        {
          id: "nat-guidance",
          level: "nature",
          name: "راهنمایی",
          count: 1440,
          growthPercent: -1.2,
          children: [
            {
              id: "grp-guidance",
              level: "group",
              name: "راهنمایی و ارشاد",
              count: 1440,
              growthPercent: -1.2,
              children: [
                {
                  id: "sub-out-of-scope",
                  level: "subject",
                  name: "راهنمایی (مربوط به بهزیستی نمی‌باشد)",
                  count: 860,
                  growthPercent: -3.4,
                  complaintSharePercent: 2,
                },
                {
                  id: "sub-guidance-general",
                  level: "subject",
                  name: "راهنمایی عمومی خدمات بهزیستی",
                  count: 580,
                  growthPercent: 1.0,
                  complaintSharePercent: 4,
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: "zone-emergency",
      level: "zone",
      name: "اورژانس اجتماعی، پیشگیری از آسیب‌ها و بازتوانی اعتیاد",
      count: 1860,
      growthPercent: 7.6,
      children: [
        {
          id: "nat-emergency",
          level: "nature",
          name: "اورژانس اجتماعی",
          count: 720,
          growthPercent: 5.1,
          children: [
            {
              id: "grp-emergency",
              level: "group",
              name: "اورژانس اجتماعی",
              count: 720,
              growthPercent: 5.1,
              children: [
                {
                  id: "sub-emergency",
                  level: "subject",
                  name: "مداخلات اورژانس اجتماعی",
                  count: 720,
                  growthPercent: 5.1,
                  complaintSharePercent: 20,
                },
              ],
            },
          ],
        },
        {
          id: "nat-addiction",
          level: "nature",
          name: "پیشگیری از آسیب‌ها و بازتوانی اعتیاد",
          count: 640,
          growthPercent: 8.8,
          children: [
            {
              id: "grp-addiction",
              level: "group",
              name: "مراکز بازتوانی اعتیاد",
              count: 640,
              growthPercent: 8.8,
              children: [
                {
                  id: "sub-addiction",
                  level: "subject",
                  name: "خدمات مراکز خدماتی و نگهداری معتادین",
                  count: 640,
                  growthPercent: 8.8,
                  complaintSharePercent: 27,
                },
              ],
            },
          ],
        },
        {
          id: "nat-staff-complaint",
          level: "nature",
          name: "شکایت از پرسنل (اورژانس / پیشگیری)",
          count: 500,
          growthPercent: 9.1,
          children: [
            {
              id: "grp-staff",
              level: "group",
              name: "عملکرد پرسنل",
              count: 500,
              growthPercent: 9.1,
              children: [
                {
                  id: "sub-staff",
                  level: "subject",
                  name: "عدم رعایت بخشنامه‌ها و دستورالعمل‌ها",
                  count: 500,
                  growthPercent: 9.1,
                  complaintSharePercent: 92,
                  samples: [
                    {
                      id: "c-10901",
                      caption: "شکایت از برخورد کارشناس مرکز",
                      className: "شکایت",
                      status: "در دست بررسی",
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: "zone-channel-noise",
      level: "zone",
      name: "تماس‌ها و کانال‌های غیرقابل پیگیری",
      count: 1220,
      growthPercent: 8.6,
      children: [
        {
          id: "nat-calls",
          level: "nature",
          name: "تماس‌های صوتی / اینترنتی / اپلیکیشن",
          count: 1220,
          growthPercent: 8.6,
          children: [
            {
              id: "grp-calls",
              level: "group",
              name: "تماس‌ها (صوتی، اینترنتی، اپلیکیشن)",
              count: 1220,
              growthPercent: 8.6,
              children: [
                {
                  id: "sub-voice-untrackable",
                  level: "subject",
                  name: "پیام‌های صوتی غیرقابل پیگیری",
                  count: 980,
                  growthPercent: 8.6,
                  complaintSharePercent: 5,
                  samples: [
                    {
                      id: "c-11001",
                      caption: "پیام صوتی بدون محتوای قابل اقدام",
                      className: "راهنمایی و ارشاد",
                      status: "قابلیت توزیع ندارد",
                    },
                  ],
                },
                {
                  id: "sub-other-calls",
                  level: "subject",
                  name: "سایر تماس‌های کانالی",
                  count: 240,
                  growthPercent: 2.0,
                  complaintSharePercent: 3,
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};
