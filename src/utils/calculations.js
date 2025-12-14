// src/utils/calculations.js
export function calculatePercentage(attended, total) {
  return total === 0 ? 0 : ((attended / total) * 100).toFixed(1);
}

export function calculateOverall(subjects) {
  let totalAttended = 0, totalLectures = 0;
  subjects.forEach(s => {
    totalAttended += s.attended;
    totalLectures += s.total;
  });
  return calculatePercentage(totalAttended, totalLectures);
}

export function predictIfAttendNext(attended, total) {
  return calculatePercentage(attended + 1, total + 1);
}

export function predictIfSkipNext(attended, total) {
  return calculatePercentage(attended, total + 1);
}
