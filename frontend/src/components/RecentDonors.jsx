export default function RecentList({ list, title, color }) {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <ul className="space-y-3">
        {list.map((item, idx) => (
          <li
            key={idx}
            className="flex items-center justify-between p-2 bg-white rounded shadow"
          >
            <div className="flex items-center gap-2">
              <div>
                <div className="font-semibold">{item.name}</div>
                <div className="text-sm text-gray-500">{item.requestDate}</div>
              </div>
            </div>
            <div
              className={`text-red-600 font-bold ${color} w-10 h-10 flex justify-center items-center rounded-lg`}
            >
              {item.bloodType}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
