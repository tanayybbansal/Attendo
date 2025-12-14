// ===================================
// DASHBOARD - ORIGINAL LAYOUT PRESERVED
// Only minor UI polish, no new sections added
// ===================================

import { useState, useEffect } from "react";
import OverallAttendance from "./overallattendance";
import SubjectCard from "./subjectcard";
import AddSubjectForm from "./addsubjectfrom";
import SuggestionPanel from "./suggestionpannel";
import WhatIf from "./whatif";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const [subjects, setSubjects] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));
  const username = user?.username || "User";
  const [newSub, setNewSub] = useState({
    name: "",
    attended: "",
    total: "",
  });

  const [loaded, setLoaded] = useState(false);
  const userEmail = localStorage.getItem("loggedInUser");

  // 🔒 PROTECT DASHBOARD
  if (localStorage.getItem("isLoggedIn") !== "true") {
    window.location.href = "/login";
  }

  // ✅ LOAD SAVED SUBJECTS
  useEffect(() => {
    if (!userEmail) return;
    const saved = localStorage.getItem(`subjects_${userEmail}`);
    if (saved) {
      setSubjects(JSON.parse(saved));
    }
    setLoaded(true);
  }, [userEmail]);

  // ✅ SAVE SUBJECTS
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
    <div className="min-h-screen bg-[#f7f8fc] px-6 md:px-12 lg:px-24 py-5">
      {/* NAVBAR */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-2xl font-extrabold">Attendo</h1>
          <p className="text-sm text-gray-500">
            Welcome back, <span className="font-semibold">{username}!</span>
          </p>
        </div>
        <div className="flex items-center gap-4">
          {/* ANALYTICS LINK */}
          <Link
            to="/analytics"
            className="text-blue-600 font-medium hover:text-blue-800 "
          >
             Analytics
          </Link>
          {/* TIMETABLE LINK */}
          <Link
            to="/timetable"
            className="text-blue-600 font-medium hover:text-blue-800"
          >
             Timetable
          </Link>
          <button
            className="text-red-600 font-semibold hover:text-red-800 ml-10"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>

      {/* TOP SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-8">
        <OverallAttendance subjects={subjects} />
        <SuggestionPanel subjects={subjects} />
      </div>

      {/* MY SUBJECTS */}
      <h2 className="text-xl font-semibold mt-12 mb-4">My Subjects</h2>

      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-8">
        {/* SUBJECTS + ADD */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

      {/* FOOTER */}
      <footer className="mt-12">
        <p className="text-center text-gray-400 text-sm">
          &copy; 2024 Attendo. All rights reserved.
          <br />
          Designed and Developed by <span className="font-semibold">Tanay Bansal</span>
        </p>
      </footer>
    </div>
  );
}
