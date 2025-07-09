export default function RecentDonors({ donors }) {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">Recent Donors</h3>
      <ul className="space-y-3">
        {donors.map((donor, idx) => (
          <li
            key={idx}
            className="flex items-center justify-between p-2 bg-white rounded shadow"
          >
            <div className="flex items-center gap-2">
              <img
                src={donor.image}
                className="w-10 h-10 rounded-full"
                alt={donor.name}
              />
              <div>
                <div className="font-semibold">{donor.name}</div>
                <div className="text-sm text-gray-500">{donor.date}</div>
              </div>
            </div>
            <span className="text-red-500 font-bold">{donor.bloodType}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
