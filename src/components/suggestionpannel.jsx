export default function SuggestionPanel({ subjects }) {
  // No subjects case
  if (subjects.length === 0) {
    return (
      <div className="bg-white p-6 rounded-2xl shadow">
        <h2 className="font-bold text-xl mb-4">💡 Smart Suggestions</h2>
        <p className="text-gray-500">Add subjects to get suggestions</p>
      </div>
    );
  }

  // 1️⃣ Calculate percentage for each subject
  const subjectsWithPercent = subjects.map((sub) => {
    const percent =
      sub.total === 0 ? 0 : (sub.attended / sub.total) * 100;

    return { ...sub, percent };
  });

  // 2️⃣ Sort by lowest attendance first
  const sortedSubjects = subjectsWithPercent.sort(
    (a, b) => a.percent - b.percent
  );

  // 3️⃣ Take top 3 subjects
  const prioritySubjects = sortedSubjects.slice(0, 3);

  return (
    <div className="bg-white p-6 rounded-2xl shadow">
      <h2 className="font-bold text-xl mb-4 flex items-center gap-2">
        💡 Smart Suggestions
      </h2>

      <p className="text-gray-600 mb-3">
        Attending these subjects will help boost your overall attendance:
      </p>

      <ul className="space-y-3">
        {prioritySubjects.map((sub, index) => (
          <li
            key={index}
            className="bg-red-100 p-3 rounded-xl text-red-700 font-medium"
          >
            {index + 1}. <b>{sub.name}</b> ({sub.percent.toFixed(1)}%)
          </li>
        ))}
      </ul>

      <p className="text-gray-400 text-sm mt-3">
        Prioritized based on lowest attendance
      </p>
    </div>
  );
}
