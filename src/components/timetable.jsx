// ===================================
// TIMETABLE PAGE
// Period-wise timetable (9:20 AM to 4:00 PM)
// Each period = 50 minutes
// ===================================

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

// Days (Monday to Saturday)
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const FULL_DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

// Periods with timings (50 min each, starting 9:20)
const PERIODS = [
    { period: 1, time: "9:20 - 10:10" },
    { period: 2, time: "10:10 - 11:00" },
    { period: 3, time: "11:00 - 11:50" },
    { period: 4, time: "11:50 - 12:40" },
    { period: "Lunch", time: "12:40 - 1:30" },
    { period: 5, time: "1:30 - 2:20" },
    { period: 6, time: "2:20 - 3:10" },
    { period: 7, time: "3:10 - 4:00" },
];

export default function TimetablePage() {
    const userEmail = localStorage.getItem("loggedInUser");
    const user = JSON.parse(localStorage.getItem("user"));
    const username = user?.username || "User";

    // Protect page
    if (localStorage.getItem("isLoggedIn") !== "true") {
        window.location.href = "/login";
    }

    // Today
    const todayIndex = new Date().getDay();
    const today = DAY_NAMES[todayIndex];
    const todayShort = todayIndex === 0 ? null : DAYS[todayIndex - 1];

    // ===== STATE =====
    // timetable format: { "Mon_1": "Math", "Mon_2": "Physics", ... }
    const [timetable, setTimetable] = useState({});
    const [editingCell, setEditingCell] = useState(null); // { day, period }
    const [editText, setEditText] = useState("");

    // ===== LOAD TIMETABLE =====
    useEffect(() => {
        if (!userEmail) return;
        const saved = localStorage.getItem(`timetable_${userEmail}`);
        if (saved) setTimetable(JSON.parse(saved));
    }, [userEmail]);

    // ===== SAVE TIMETABLE =====
    useEffect(() => {
        if (!userEmail) return;
        localStorage.setItem(`timetable_${userEmail}`, JSON.stringify(timetable));
    }, [timetable, userEmail]);

    // ===== FUNCTIONS =====
    function startEdit(day, period) {
        if (period === "Lunch") return; // Can't edit lunch
        setEditingCell({ day, period });
        setEditText(timetable[`${day}_${period}`] || "");
    }

    function saveEdit() {
        const key = `${editingCell.day}_${editingCell.period}`;
        if (editText.trim() === "") {
            // Remove if empty
            const newTimetable = { ...timetable };
            delete newTimetable[key];
            setTimetable(newTimetable);
        } else {
            setTimetable({ ...timetable, [key]: editText.trim() });
        }
        setEditingCell(null);
        setEditText("");
    }

    // Get today's classes
    function getTodayClasses() {
        if (!todayShort) return []; // Sunday
        const classes = [];
        PERIODS.forEach((p) => {
            if (p.period !== "Lunch") {
                const subject = timetable[`${todayShort}_${p.period}`];
                if (subject) {
                    classes.push({ period: p.period, time: p.time, subject });
                }
            }
        });
        return classes;
    }

    const todayClasses = getTodayClasses();

    return (
        <div className="min-h-screen bg-[#f7f8fc] px-6 md:px-12 lg:px-24 py-5">

            {/* NAVBAR */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-extrabold">Timetable</h1>
                    <p className="text-sm text-gray-500">
                        Hello, <span className="font-semibold">{username}</span>
                    </p>
                </div>
                <Link
                    to="/dashboard"
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                    ← Back to Dashboard
                </Link>
            </div>

            {/* ===== TODAY'S SCHEDULE ===== */}
            <div className="bg-white p-6 rounded-2xl shadow mb-6">
                <h2 className="text-lg font-bold text-gray-800 mb-4">
                    📚 Today's Schedule ({today})
                </h2>

                {today === "Sunday" ? (
                    <div className="bg-blue-50 p-4 rounded-xl text-center">
                        <p className="text-blue-600 text-lg">🎉 It's Sunday - No Classes!</p>
                    </div>
                ) : todayClasses.length === 0 ? (
                    <div className="bg-gray-50 p-4 rounded-xl text-center">
                        <p className="text-gray-500">No classes scheduled for today.</p>
                        <p className="text-sm text-gray-400 mt-1">Add classes in the table below.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {todayClasses.map((cls, i) => (
                            <div key={i} className="bg-blue-50 p-3 rounded-xl border border-blue-200">
                                <p className="text-xs text-gray-500">Period {cls.period}</p>
                                <p className="font-semibold text-blue-700">{cls.subject}</p>
                                <p className="text-xs text-gray-400">{cls.time}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* ===== TIMETABLE TABLE ===== */}
            <div className="bg-white p-6 rounded-2xl shadow overflow-x-auto">
                <h2 className="text-lg font-bold text-gray-800 mb-4">
                    📅 Weekly Timetable
                </h2>
                <p className="text-sm text-gray-500 mb-4">
                    Click on any cell to add/edit a subject
                </p>

                <table className="w-full border-collapse text-sm">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="border border-gray-300 p-2 text-left">Period</th>
                            <th className="border border-gray-300 p-2 text-left">Time</th>
                            {DAYS.map((day) => (
                                <th
                                    key={day}
                                    className={`border border-gray-300 p-2 text-center ${day === todayShort ? "bg-blue-100" : ""
                                        }`}
                                >
                                    {day}
                                    {day === todayShort && (
                                        <span className="ml-1 text-xs text-blue-600">(Today)</span>
                                    )}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {PERIODS.map((p, rowIndex) => (
                            <tr key={rowIndex} className={p.period === "Lunch" ? "bg-yellow-50" : ""}>
                                {/* Period Number */}
                                <td className="border border-gray-300 p-2 font-medium text-center">
                                    {p.period === "Lunch" ? "🍴" : p.period}
                                </td>

                                {/* Time */}
                                <td className="border border-gray-300 p-2 text-gray-600 text-xs">
                                    {p.time}
                                </td>

                                {/* Days */}
                                {DAYS.map((day) => {
                                    const key = `${day}_${p.period}`;
                                    const subject = timetable[key] || "";
                                    const isLunch = p.period === "Lunch";
                                    const isToday = day === todayShort;

                                    return (
                                        <td
                                            key={key}
                                            onClick={() => !isLunch && startEdit(day, p.period)}
                                            className={`border border-gray-300 p-2 text-center ${isLunch
                                                ? "bg-yellow-100 text-yellow-700"
                                                : isToday
                                                    ? "bg-blue-50 cursor-pointer hover:bg-blue-100"
                                                    : "cursor-pointer hover:bg-gray-100"
                                                }`}
                                        >
                                            {isLunch ? (
                                                "Lunch"
                                            ) : subject ? (
                                                <span className="font-medium">{subject}</span>
                                            ) : (
                                                <span className="text-gray-300">+</span>
                                            )}
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* ===== EDIT MODAL ===== */}
            {editingCell && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-2xl w-80 shadow-xl">
                        <h3 className="font-bold text-lg mb-2">
                            📝 {FULL_DAYS[DAYS.indexOf(editingCell.day)]} - Period {editingCell.period}
                        </h3>
                        <p className="text-sm text-gray-500 mb-4">
                            Enter subject name (leave empty to clear)
                        </p>

                        <input
                            type="text"
                            placeholder="e.g. Mathematics"
                            className="w-full border border-gray-300 px-4 py-3 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            autoFocus
                        />

                        <div className="flex gap-3">
                            <button
                                onClick={saveEdit}
                                className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700"
                            >
                                Save
                            </button>
                            <button
                                onClick={() => setEditingCell(null)}
                                className="px-6 bg-gray-100 text-gray-600 py-2 rounded-lg font-medium hover:bg-gray-200"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* FOOTER */}
            <footer className="mt-8">
                <p className="text-center text-gray-400 text-sm">
                    Attendo Timetable • Built by <span className="font-semibold">Tanay Bansal</span>
                </p>
            </footer>
        </div>
    );
}
