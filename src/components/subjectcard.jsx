export default function SubjectCard({
  subject,
  index,
  updateSubject,
  deleteSubject,
}) {
  const percent =
    subject.total === 0
      ? 0
      : ((subject.attended / subject.total) * 100).toFixed(1);

  // 🎯 COLOR LOGIC BASED ON ATTENDANCE
  let bgColor = "";
  let barBg = "";
  let barFill = "";
  let textColor = "";

  if (percent >= 75) {
    bgColor = "bg-green-100";
    barBg = "bg-green-200";
    barFill = "bg-green-500";
    textColor = "text-green-700";
  } else if (percent >= 65) {
    bgColor = "bg-yellow-100";
    barBg = "bg-yellow-200";
    barFill = "bg-yellow-500";
    textColor = "text-yellow-700";
  } else {
    bgColor = "bg-red-100";
    barBg = "bg-red-200";
    barFill = "bg-red-500";
    textColor = "text-red-700";
  }

  return (
    <div className={`${bgColor} p-6 rounded-xl shadow relative`}>

      {/* ❌ DELETE BUTTON */}
      <button
        onClick={() => deleteSubject(index)}
        className="absolute top-2 right-3 text-gray-500 hover:text-red-600 font-bold text-xl"
        title="Delete Subject"
      >
        ✕
      </button>

      <h3 className="font-bold text-lg">{subject.name}</h3>
      <p className="text-sm text-gray-700">
        {subject.attended}/{subject.total} lectures
      </p>

      {/* PROGRESS BAR */}
      <div className={`${barBg} h-2 rounded-full my-3`}>
        <div
          className={`${barFill} h-2 rounded-full`}
          style={{ width: `${percent}%` }}
        />
      </div>

      {/* STATUS */}
      <p className={`font-semibold ${textColor}`}>
        {percent >= 75 ? "Eligible" : "Not Eligible"}
      </p>

      {/* CONTROLS */}
      <div className="flex justify-between mt-4">

        {/* ATTENDED */}
        <div>
          <p className="text-sm">Attended</p>
          <div className="flex items-center gap-2 mt-1">
            <button
              className="px-2 py-1 bg-white rounded shadow"
              onClick={() =>
                updateSubject(index, {
                  ...subject,
                  attended: Math.max(0, subject.attended - 1),
                })
              }
            >
              -
            </button>

            <span>{subject.attended}</span>

            <button
              className="px-2 py-1 bg-white rounded shadow"
              onClick={() =>
                updateSubject(index, {
                  ...subject,
                  attended: subject.attended + 1,
                  total: subject.total + 1,
                })
              }
            >
              +
            </button>
          </div>
        </div>

        {/* TOTAL */}
        <div>
          <p className="text-sm">Total</p>
          <div className="flex items-center gap-2 mt-1">
            <button
              className="px-2 py-1 bg-white rounded shadow"
              onClick={() =>
                updateSubject(index, {
                  ...subject,
                  total: Math.max(0, subject.total - 1),
                })
              }
            >
              -
            </button>

            <span>{subject.total}</span>

            <button
              className="px-2 py-1 bg-white rounded shadow"
              onClick={() =>
                updateSubject(index, {
                  ...subject,
                  total: subject.total + 1,
                })
              }
            >
              +
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
