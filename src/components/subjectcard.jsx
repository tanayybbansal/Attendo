export default function SubjectCard({
  subject,
  index,
  updateSubject,
  deleteSubject,   // ✅ RECEIVED
}) {
  const percent = ((subject.attended / subject.total) * 100).toFixed(1);

  return (
    <div className="bg-red-100 p-6 rounded-xl shadow relative">

      {/* ❌ DELETE BUTTON */}
      <button
        onClick={() => deleteSubject(index)}
        className="absolute top-2 right-3 text-red-600 font-bold text-xl"
        title="Delete Subject"
      >
        ✕
      </button>

      <h3 className="font-bold text-lg">{subject.name}</h3>
      <p>{subject.attended}/{subject.total} lectures</p>

      <div className="bg-red-200 h-2 rounded-full my-3">
        <div
          className="bg-red-500 h-2 rounded-full"
          style={{ width: `${percent}%` }}
        />
      </div>

      <p className={`font-semibold ${percent < 80 ? "text-red-700" : "text-green-700"}`}>
        {percent < 75 ? "Not Eligible" : "Eligible"}
      </p>

      <div className="flex justify-between mt-4">

        {/* ATTENDED */}
        <div>
          <p className="text-sm">Attended</p>
          <button
            onClick={() =>
              updateSubject(index, {
                ...subject,
                attended: Math.max(0, subject.attended - 1),
              })
            }
          >
            -
          </button>

          <span className="mx-2">{subject.attended}</span>

          <button
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

        {/* TOTAL */}
        <div>
          <p className="text-sm">Total</p>
          <button
            onClick={() =>
              updateSubject(index, {
                ...subject,
                total: Math.max(0, subject.total - 1),
              })
            }
          >
            -
          </button>

          <span className="mx-2">{subject.total}</span>

          <button
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
  );
}
