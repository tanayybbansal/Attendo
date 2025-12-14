export default function WhatIf({ subjects }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h2 className="font-bold mb-4">📈 What If !!</h2>

      {subjects.length === 0 ? (
        <p>Add subjects to see predictions</p>
      ) : (
        subjects.map((s, i) => (
          <div key={i} className="mb-4">
            <p className="font-semibold">{s.name}</p>
            <div className="bg-green-100 p-2 rounded">
              Attend Next → {(((s.attended + 1) / (s.total + 1)) * 100).toFixed(1)}%
            </div>
            <div className="bg-red-100 p-2 rounded mt-2">
              Skip Next → {((s.attended / (s.total + 1)) * 100).toFixed(1)}%
            </div>
          </div>
        ))
      )}
    </div>
  );
}
