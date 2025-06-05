import React from "react";

const RequestInfoCard = ({ requestId, date, name, status }) => {
  const infoItems = [
    { label: "RequestID", value: requestId },
    { label: "Date", value: date },
    { label: "Name", value: name },
    { label: "Status", value: status },
  ];

  return (
    <div className="w-full border-2 border-red-500 rounded-xl bg-white p-4">
      <div className="flex flex-wrap justify-between gap-10 px-80">
        {infoItems.map((item) => (
          <div
            key={item.label}
            className="flex-1 min-w-[120px] bg-gradient-to-br from-red-400 to-rose-500 rounded-4xl p-2 text-center"
          >
            <div className="text-xl font-semibold text-white mb-1">
              {item.label}
            </div>
            <div className="text-lg font-bold text-black">{item.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RequestInfoCard;
