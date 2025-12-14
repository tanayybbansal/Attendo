export default function OverallAttendance({ subjects }) {
  const totalAtt = subjects.reduce((a, b) => a + Number(b.attended), 0);
  const totalLect = subjects.reduce((a, b) => a + Number(b.total), 0);

  const percent =
    totalLect === 0 ? 0 : ((totalAtt / totalLect) * 100).toFixed(1);

  const value = Math.max(0, Math.min(100, percent));

  // 🎯 RISK STATUS + DONUT COLOR
  let riskLabel = "";
  let riskColor = "";
  let donutColor = "";

  if (value >= 75) {
    riskLabel = "Safe";
    riskColor = "text-green-600";
    donutColor = "#22c55e"; // green
  } else if (value >= 65) {
    riskLabel = "Borderline";
    riskColor = "text-yellow-500";
    donutColor = "#eab308"; // yellow
  } else {
    riskLabel = "At Risk";
    riskColor = "text-red-600";
    donutColor = "#ef4444"; // red
  }

  // ✅ SUBJECT COUNT LOGIC (THIS WAS MISSING)
  const totalSubjects = subjects.length;

  const eligibleSubjects = subjects.filter((sub) => {
    if (sub.total === 0) return false;
    const subPercent = (sub.attended / sub.total) * 100;
    return subPercent >= 75;
  }).length;

  return (
    <div className="bg-white p-8 rounded-2xl shadow text-center">
      <div className="relative w-40 h-40 mx-auto">
        <svg viewBox="0 0 36 36" className="w-full h-full -rotate-0">
          {/* BACKGROUND DONUT */}
          <path
            d="M18 2.0845
               a 15.9155 15.9155 0 0 1 0 31.831
               a 15.9155 15.9155 0 0 1 0 -31.831"
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="3"
          />

          {/* PROGRESS DONUT */}
          <path
            d="M18 2.0845
               a 15.9155 15.9155 0 0 1 0 31.831
               a 15.9155 15.9155 0 0 1 0 -31.831"
            fill="none"
            stroke={donutColor}
            strokeWidth="3"
            strokeDasharray="100 100"
            strokeDashoffset={100 - value}
            strokeLinecap="round"
          />
        </svg>

        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-bold">{value}%</span>
        </div>
      </div>

      <p className="mt-4 text-gray-600">Overall</p>

      {/* OPTIONAL RISK LABEL (you commented it, that’s fine) */}
      {/* <p className={`mt-2 font-semibold ${riskColor}`}>{riskLabel}</p> */}

      <p
        className={`mt-3 font-medium ${
          value < 75 ? "text-red-600" : "text-green-600"
        }`}
      >
        {value >= 75
          ? "Eligible in all subjects"
          : `Eligible in ${eligibleSubjects}/${totalSubjects} subjects`}
      </p>
    </div>
  );
}
