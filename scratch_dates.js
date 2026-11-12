const am = ['jan','feb','mar','apr','may','jun','jul','aug','sep','oct','nov','dec'];
const om = 2020;
const sm = 7;
const cm = sm * 12; // 84

function calcDates(datesStr) {
  // Support both "2021 — 2024" and "Jan 2024 — May 2026" and "2023 — Present"
  const parts = datesStr.split('—').map(s => s.trim());
  const startStr = parts[0];
  const endStr = parts[1];

  let startYear, startMonth = 0;
  if (/^\d{4}$/.test(startStr)) {
    startYear = parseInt(startStr);
    startMonth = 0; // Jan
  } else {
    const m = startStr.match(/^([A-Za-z]+)\s+(\d{4})$/);
    if (m) {
      startMonth = am.indexOf(m[1].slice(0, 3).toLowerCase());
      startYear = parseInt(m[2]);
    }
  }

  let endYear, endMonth = 11, isPresent = false;
  if (/^present$/i.test(endStr)) {
    isPresent = true;
    endYear = 2026;
    endMonth = 10; // Nov 2026
  } else if (/^\d{4}$/.test(endStr)) {
    endYear = parseInt(endStr);
    endMonth = 11; // Dec
  } else {
    const m = endStr.match(/^([A-Za-z]+)\s+(\d{4})$/);
    if (m) {
      endMonth = am.indexOf(m[1].slice(0, 3).toLowerCase());
      endYear = parseInt(m[2]);
    }
  }

  const startTotalMonths = (startYear - om) * 12 + startMonth;
  const endTotalMonths = isPresent ? (endYear - om) * 12 + endMonth + 0.5 : (endYear - om) * 12 + endMonth + 1;

  const left = (startTotalMonths / cm) * 100;
  const width = ((endTotalMonths - startTotalMonths) / cm) * 100;

  return { left: Math.max(0, left), width: Math.min(100 - left, width), present: isPresent };
}

console.log('2021 — 2024:', calcDates('2021 — 2024'));
console.log('2023 — Present:', calcDates('2023 — Present'));
console.log('Jul 2021 — Jun 2024:', calcDates('Jul 2021 — Jun 2024'));
console.log('Jan 2023 — Present:', calcDates('Jan 2023 — Present'));
