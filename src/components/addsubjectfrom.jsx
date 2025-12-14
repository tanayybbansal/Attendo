export default function AddSubjectForm({ newSub, setNewSub, addSubject }) {
  return (
    <div className="bg-white border-2 border-dashed border-blue-400 p-6 rounded-xl shadow">
      <h3 className="font-bold mb-3">Add New Subject</h3>

      <input
        placeholder="Subject Name"
        className="border p-2 w-full mb-2"
        value={newSub.name}
        onChange={(e) => setNewSub({ ...newSub, name: e.target.value })}
      />

      <input
        placeholder="Attended"
        className="border p-2 w-full mb-2"
        value={newSub.attended}
        onChange={(e) => setNewSub({ ...newSub, attended: Number(e.target.value) })}
      />

      <input
        placeholder="Total"
        className="border p-2 w-full mb-4"
        value={newSub.total}
        onChange={(e) => setNewSub({ ...newSub, total: Number(e.target.value) })}
      />

      <button onClick={addSubject} className="bg-blue-600 text-white w-full py-2 rounded">
        Add Subject
      </button>
    </div>
  );
}
