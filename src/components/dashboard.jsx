import { useState, useEffect } from "react";
import OverallAttendance from "./overallattendance";
import SubjectCard from "./subjectcard";
import AddSubjectForm from "./addsubjectfrom";
import SuggestionPanel from "./suggestionpannel";
import WhatIf from "./whatif";

export default function Dashboard() {
  const [subjects, setSubjects] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));
  const username = user?.username || "User";
  const [newSub, setNewSub] = useState({
    name: "",
    attended: "",
    total: "",
  });

  // ✅ FLAG TO PREVENT OVERWRITING SAVED DATA
  const [loaded, setLoaded] = useState(false);

  // ✅ WHO IS LOGGED IN
  const userEmail = localStorage.getItem("loggedInUser");

  // 🔒 PROTECT DASHBOARD
  if (localStorage.getItem("isLoggedIn") !== "true") {
    window.location.href = "/login";
  }

  // ✅ LOAD SAVED SUBJECTS (ON DASHBOARD LOAD)
  useEffect(() => {
    if (!userEmail) return;

    const saved = localStorage.getItem(`subjects_${userEmail}`);
    if (saved) {
      setSubjects(JSON.parse(saved));
    }

    // 🔑 MARK DATA AS LOADED
    setLoaded(true);
  }, [userEmail]);

  // ✅ SAVE SUBJECTS (ONLY AFTER LOAD)
  useEffect(() => {
    if (!userEmail || !loaded) return;

    localStorage.setItem(`subjects_${userEmail}`, JSON.stringify(subjects));
  }, [subjects, userEmail, loaded]);

  // ➕ ADD SUBJECT
  function addSubject() {
    if (!newSub.name || newSub.attended === "" || newSub.total === "") {
      alert("Fill all fields");
      return;
    }

    setSubjects([...subjects, newSub]);
    setNewSub({ name: "", attended: "", total: "" });
  }

  // 🔄 UPDATE SUBJECT
  function updateSubject(index, updated) {
    const copy = [...subjects];
    copy[index] = updated;
    setSubjects(copy);
  }

  // ❌ DELETE SUBJECT
  function deleteSubject(index) {
    setSubjects(subjects.filter((_, i) => i !== index));
  }

  // 🚪 LOGOUT
  function handleLogout() {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("loggedInUser");
    window.location.href = "/login";
  }

  return (
    <div className="min-h-screen bg-[#f7f8fc] px-30 py-5">
      {/* NAVBAR */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-2xl font-extrabold">Attendo</h1>
          <p className="text-sm text-gray-500 ml-4">
               Welcome back, <span className="font-semibold">{username}!</span> 
          </p>
        </div>
        <button className="text-red-600 font-semibold mr-15" onClick={handleLogout}>
          Logout
        </button>
      </div>
  

      {/* TOP SECTION */}
      <div className="grid grid-cols-[2fr_1fr] gap-30">
        <OverallAttendance subjects={subjects} />
        <SuggestionPanel subjects={subjects} />
      </div>

      {/* MY SUBJECTS */}
      <h2 className="text-xl font-semibold mt-12 mb-4">My Subjects</h2>

      <div className="grid grid-cols-[2fr_1fr] gap-30 ">
        {/* SUBJECTS + ADD */}
        <div className="grid grid-cols-2 gap-10 ">
          {subjects.map((s, i) => (
            <SubjectCard
              key={i}
              subject={s}
              index={i}
              updateSubject={updateSubject}
              deleteSubject={deleteSubject}
            />
          ))}

          <AddSubjectForm
            newSub={newSub}
            setNewSub={setNewSub}
            addSubject={addSubject}
          />
        </div>

        <WhatIf subjects={subjects} />
      </div>
      <br />
      <footer>
        <p className="text-center text-gray-400 text-sm mt-10">Because 74.9% hurts.
          <br /> Designed and Developed by <span className="font-semibold">Tanay Bansal</span>
        </p>
     
      </footer>
    </div>
  );
}
