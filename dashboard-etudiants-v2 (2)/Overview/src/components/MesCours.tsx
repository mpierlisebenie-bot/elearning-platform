import { coursesData } from "../data";

export default function MesCours() {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm flex-1 min-w-[300px]">
      <h2 className="text-sm font-semibold text-gray-800 mb-4">Mes cours</h2>

      {/* Table header */}
      <div className="grid grid-cols-[28px_1fr_120px_56px] gap-2 text-[10px] font-semibold text-gray-400 uppercase mb-2 px-1">
        <span>#</span>
        <span>Cours</span>
        <span>Progression</span>
        <span className="text-right">Durée</span>
      </div>

      <div className="space-y-3">
        {coursesData.map(course => (
          <div
            key={course.id}
            className="grid grid-cols-[28px_1fr_120px_56px] gap-2 items-center px-1"
          >
            {/* Index */}
            <span className="text-xs text-gray-400 font-medium">{course.id}</span>

            {/* Title */}
            <span className="text-xs text-gray-700 font-medium truncate">{course.title}</span>

            {/* Progress bar */}
            <div className="flex items-center gap-2">
              <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${course.barColor}`}
                  style={{ width: `${course.progression}%` }}
                />
              </div>
              <span className="text-[10px] text-gray-400 w-6 text-right">
                {course.progression}%
              </span>
            </div>

            {/* Duration badge */}
            <div className="flex justify-end">
              <span className="text-[10px] font-semibold bg-gray-100 text-gray-600 rounded-lg px-2 py-0.5">
                {course.duration}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
