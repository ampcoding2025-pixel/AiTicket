"use client";

const provider = process.env.NEXT_PUBLIC_DATA_PROVIDER ?? "mock";

export function DemoBanner() {
  if (provider === "api") {
    return (
      <div className="border-b border-teal-200 bg-teal-50 px-4 py-2 text-center text-sm text-teal-950">
        منبع داده:{" "}
        <span className="font-semibold">API فقط‌خواندنی دیده‌بان</span>
        {" — "}
        برخی نمودارها هنوز کامل متصل نیستند و ممکن است خالی بمانند.
      </div>
    );
  }

  return (
    <div className="border-b border-amber-200 bg-amber-50 px-4 py-2 text-center text-sm text-amber-950">
      داده‌های این نسخه{" "}
      <span className="font-semibold">نمایشی (Mock)</span> هستند. ابعاد از طرحواره
      دیده‌بان بهزیستی الهام گرفته‌اند، اما هنوز کوئری زنده به پایگاه متصل نیست و
      عددها دادهٔ عملیاتی قطعی محسوب نمی‌شوند.
    </div>
  );
}
