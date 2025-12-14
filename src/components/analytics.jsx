// ===================================
// ANALYTICS PAGE
// Contains: Analytics Panel + Goal Planner
// Simple code for viva explanation
// ===================================

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function AnalyticsPage() {
    // Get user info
    const userEmail = localStorage.getItem("loggedInUser");
    const user = JSON.parse(localStorage.getItem("user"));
    const username = user?.username || "User";

    // Protect page
    if (localStorage.getItem("isLoggedIn") !== "true") {
        window.location.href = "/login";
    }

    // ===== STATE =====
    const [subjects, setSubjects] = useState([]);
    const [selectedSubject, setSelectedSubject] = useState("");
    const [targetPercent, setTargetPercent] = useState(75);
    const [savedGoals, setSavedGoals] = useState([]);

    // ===== LOAD DATA =====
    useEffect(() => {
        if (!userEmail) return;
        const savedSubjects = localStorage.getItem(`subjects_${userEmail}`);
        if (savedSubjects) setSubjects(JSON.parse(savedSubjects));

        const goals = localStorage.getItem(`goals_${userEmail}`);
        if (goals) setSavedGoals(JSON.parse(goals));
    }, [userEmail]);

    // ===== SAVE GOALS =====
    useEffect(() => {
        if (!userEmail) return;
        localStorage.setItem(`goals_${userEmail}`, JSON.stringify(savedGoals));
    }, [savedGoals, userEmail]);

    // ===== CALCULATIONS =====
    let totalAttended = 0;
    let totalLectures = 0;
    for (let i = 0; i < subjects.length; i++) {
        totalAttended += Number(subjects[i].attended);
        totalLectures += Number(subjects[i].total);
    }
    const overallPercent = totalLectures === 0 ? 0 : ((totalAttended / totalLectures) * 100).toFixed(1);

    let statusText = "At Risk";
    let statusColor = "text-red-600";
    if (overallPercent >= 75) { statusText = "Safe"; statusColor = "text-green-600"; }
    else if (overallPercent >= 65) { statusText = "Warning"; statusColor = "text-yellow-600"; }

    let eligibleCount = 0;
    for (let i = 0; i < subjects.length; i++) {
        if (subjects[i].total > 0 && (subjects[i].attended / subjects[i].total) * 100 >= 75) eligibleCount++;
    }

    // Goal planner calc
    const subject = subjects.find((s) => s.name === selectedSubject);
    let currentPercent = 0;
    let lecturesNeeded = 0;
    let alreadyAchieved = false;

    if (subject && subject.total > 0) {
        currentPercent = ((subject.attended / subject.total) * 100).toFixed(1);
        if (currentPercent >= targetPercent) {
            alreadyAchieved = true;
        } else {
            const target = targetPercent / 100;
            lecturesNeeded = Math.ceil((target * subject.total - subject.attended) / (1 - target));
            if (lecturesNeeded < 0) lecturesNeeded = 0;
        }
    }

    // ===== FUNCTIONS =====
    function addGoal() {
        if (!selectedSubject) { alert("Please select a subject"); return; }
        if (savedGoals.find((g) => g.subject === selectedSubject)) {
            alert("Goal already exists!"); return;
        }
        setSavedGoals([...savedGoals, {
            subject: selectedSubject,
            target: targetPercent,
        }]);
        alert("Goal saved!");
    }

    function deleteGoal(index) {
        setSavedGoals(savedGoals.filter((_, i) => i !== index));
    }

    // Calculate lectures needed for a goal
    function calcLecturesNeeded(subName, targetPct) {
        const sub = subjects.find((s) => s.name === subName);
        if (!sub || sub.total === 0) return 0;

        const current = (sub.attended / sub.total) * 100;
        if (current >= targetPct) return 0;

        const target = targetPct / 100;
        const needed = Math.ceil((target * sub.total - sub.attended) / (1 - target));
        return needed > 0 ? needed : 0;
    }

    return (
        <div className="min-h-screen bg-[#f7f8fc] px-6 md:px-12 lg:px-24 py-5">

            {/* NAVBAR */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-extrabold">📊 Analytics</h1>
                    <p className="text-sm text-gray-500">Hello, <span className="font-semibold">{username}</span></p>
                </div>
                <Link to="/dashboard" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                    ← Back to Dashboard
                </Link>
            </div>

            {/* ===== SECTION 1: ANALYTICS ===== */}
            <div className="bg-white p-6 rounded-2xl shadow mb-6">
                <h2 className="text-lg font-bold text-gray-800 mb-4">📈 Attendance Analytics</h2>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="bg-blue-50 p-4 rounded-xl text-center">
                        <p className="text-xs text-gray-500 mb-1">Overall</p>
                        <p className="text-2xl font-bold text-blue-600">{overallPercent}%</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-xl text-center">
                        <p className="text-xs text-gray-500 mb-1">Status</p>
                        <p className={`text-lg font-bold ${statusColor}`}>{statusText}</p>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-xl text-center">
                        <p className="text-xs text-gray-500 mb-1">Eligible</p>
                        <p className="text-2xl font-bold text-purple-600">{eligibleCount}/{subjects.length}</p>
                    </div>
                </div>

                {/* VERTICAL BAR CHART */}
                <h3 className="text-sm font-semibold text-gray-600 mb-4">Subject-wise Attendance Chart</h3>

                {subjects.length === 0 ? (
                    <p className="text-gray-400 text-center py-8">Add subjects on dashboard to see chart</p>
                ) : (
                    <div className="bg-gray-50 p-4 rounded-xl">
                        {/* Chart Container */}
                        {/* Bars */}
                        <div className="flex items-end justify-around gap-2" style={{ height: '200px' }}>
                            {subjects.map((sub, index) => {
                                const percent = sub.total === 0 ? 0 : ((sub.attended / sub.total) * 100);
                                const percentRounded = percent.toFixed(1);

                                let barColor = "bg-red-500";
                                if (percent >= 75) barColor = "bg-green-500";
                                else if (percent >= 65) barColor = "bg-yellow-500";

                                // Height = percentage of 200px
                                const barHeight = Math.max((percent / 100) * 200, 8);

                                return (
                                    <div key={index} className="flex flex-col items-center flex-1 max-w-20">
                                        {/* Percentage on top */}
                                        <span className="text-xs font-bold mb-1">{percentRounded}%</span>

                                        {/* Bar */}
                                        <div
                                            className={`${barColor} w-full rounded-t-lg transition-all`}
                                            style={{ height: `${barHeight}px`, minWidth: '30px' }}
                                        />

                                        {/* Subject name */}
                                        <span className="text-xs text-gray-600 mt-2 text-center truncate w-full">
                                            {sub.name.length > 8 ? sub.name.slice(0, 8) + '..' : sub.name}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>

            {/* ===== SECTION 2: GOAL PLANNER ===== */}
            <div className="bg-white p-6 rounded-2xl shadow mb-6">
                <h2 className="text-lg font-bold text-gray-800 mb-4">🎯 Attendance Goal Planner</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Select Subject</label>
                        <select
                            className="w-full border border-gray-300 px-3 py-2 rounded-lg mb-4"
                            value={selectedSubject}
                            onChange={(e) => setSelectedSubject(e.target.value)}
                        >
                            <option value="">-- Choose --</option>
                            {subjects.map((sub, i) => (
                                <option key={i} value={sub.name}>{sub.name}</option>
                            ))}
                        </select>

                        <label className="block text-sm font-medium text-gray-600 mb-1">Target: {targetPercent}%</label>
                        <input
                            type="range" min="50" max="100" value={targetPercent}
                            onChange={(e) => setTargetPercent(Number(e.target.value))}
                            className="w-full mb-4"
                        />

                        <button onClick={addGoal} className="w-full bg-green-600 text-white py-2 rounded-lg font-medium hover:bg-green-700">
                            + Add This Goal
                        </button>
                    </div>

                    <div className={`p-4 rounded-xl ${subject ? (alreadyAchieved ? "bg-green-50" : "bg-blue-50") : "bg-gray-50"}`}>
                        {subject ? (
                            <>
                                <p className="text-sm text-gray-600 mb-2">
                                    Current: <strong>{currentPercent}%</strong> → Target: <strong>{targetPercent}%</strong>
                                </p>
                                {alreadyAchieved ? (
                                    <p className="text-green-600 font-bold text-lg">✅ Goal already achieved!</p>
                                ) : (
                                    <p className="text-blue-600 font-bold">
                                        Attend <span className="text-2xl">{lecturesNeeded}</span> more lecture{lecturesNeeded !== 1 ? "s" : ""}
                                    </p>
                                )}
                            </>
                        ) : (
                            <p className="text-gray-400 text-sm text-center py-4">Select a subject to calculate</p>
                        )}
                    </div>
                </div>
            </div>

            {/* ===== SECTION 3: SAVED GOALS ===== */}
            <div className="bg-white p-6 rounded-2xl shadow">
                <h2 className="text-lg font-bold text-gray-800 mb-4">📋 My Saved Goals</h2>

                {savedGoals.length === 0 ? (
                    <p className="text-gray-400 text-center py-4">No goals saved yet. Add a goal above!</p>
                ) : (
                    <div className="space-y-4">
                        {savedGoals.map((goal, index) => {
                            const sub = subjects.find((s) => s.name === goal.subject);
                            const current = sub && sub.total > 0 ? ((sub.attended / sub.total) * 100) : 0;
                            const currentRounded = current.toFixed(1);
                            const progress = Math.min((current / goal.target) * 100, 100);
                            const achieved = current >= goal.target;
                            const lectNeeded = calcLecturesNeeded(goal.subject, goal.target);

                            let progressColor = "bg-red-500";
                            if (achieved) progressColor = "bg-green-500";
                            else if (progress >= 80) progressColor = "bg-yellow-500";

                            return (
                                <div key={index} className={`p-4 rounded-xl border ${achieved ? "bg-green-50 border-green-200" : "bg-gray-50 border-gray-200"}`}>
                                    {/* Header */}
                                    <div className="flex justify-between items-start mb-3">
                                        <div>
                                            <p className="font-semibold text-lg">{goal.subject}</p>
                                            <p className="text-sm text-gray-500">Target: {goal.target}%</p>
                                        </div>
                                        <button onClick={() => deleteGoal(index)} className="text-red-500 hover:text-red-700 text-xl">✕</button>
                                    </div>

                                    {/* Progress Bar */}
                                    <div className="bg-gray-200 h-4 rounded-full overflow-hidden mb-2">
                                        <div className={`${progressColor} h-4 rounded-full`} style={{ width: `${progress}%` }} />
                                    </div>

                                    {/* Status */}
                                    <div className="flex justify-between text-sm">
                                        <span>Current: <strong>{currentRounded}%</strong></span>
                                        {achieved ? (
                                            <span className="text-green-600 font-bold">✅ Achieved!</span>
                                        ) : (
                                            <span className="text-blue-600 font-medium">
                                                📚 {lectNeeded} lecture{lectNeeded !== 1 ? "s" : ""} needed
                                            </span>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* FOOTER */}
            <footer className="mt-8">
                <p className="text-center text-gray-400 text-sm">
                    Attendo Analytics • Built by <span className="font-semibold">Tanay Bansal</span>
                </p>
            </footer>
        </div >
    );
}
