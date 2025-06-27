import { useState } from 'react';
import {
  separateBloodUnit,
  updateBloodStatus,
} from '../services/api/inventoryService';
import { toast } from 'react-toastify';

export default function ListBloodType({ list }) {
  const [selectedBloodId, setSelectedBloodId] = useState(null);
  const [selectedComponents, setSelectedComponents] = useState([]);
  const [showSeparateModal, setShowSeparateModal] = useState(false);

  const handleSeparate = async (selectedBloodId, selectedComponents) => {
    try {
      console.log('Id :', selectedBloodId);
      console.log('cpn', selectedComponents);
      const res = await separateBloodUnit(selectedBloodId, selectedComponents);
      await updateBloodStatus('Separated', selectedBloodId);
      console.log('response:', res);
      toast.success(`Blood separated successfully!`);
      setShowSeparateModal(false);
      setSelectedComponents([]);
    } catch (err) {
      console.error(err);
      toast.error('Separation failed!');
    }
  };

  return (
    <div className="overflow-x-auto mt-4">
      <table className="min-w-full bg-white border border-gray-200 text-sm">
        <thead className="bg-red-100 text-red-700">
          <tr>
            <th className="px-4 py-2 text-left">No.</th>
            <th className="px-4 py-2 text-left">Blood Type</th>
            <th className="px-4 py-2 text-left">Donated Date</th>
            <th className="px-4 py-2 text-left">Expiry Date</th>
            <th className="px-4 py-2 text-left">Status</th>
            <th className="px-4 py-2 text-left">Volume (ml)</th>
            <th className="px-4 py-2 text-left">Note</th>
            <th className="px-4 py-2 text-left">Action</th>
          </tr>
        </thead>
        <tbody>
          {list?.map((item, index) => (
            <tr key={item.bloodId} className="border-t">
              <td className="px-4 py-2">{index + 1}</td>
              <td className="px-4 py-2">{item.bloodType}</td>
              <td className="px-4 py-2">{item.donatedDate?.slice(0, 10)}</td>
              <td className="px-4 py-2">{item.expiryDate?.slice(0, 10)}</td>
              <td className="px-4 py-2">{item.status}</td>
              <td className="px-4 py-2">{item.volume}</td>
              <td className="px-4 py-2">{item.note}</td>
              <td className="px-4 py-2 space-x-1">
                <button
                  className="px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-500 text-xs"
                  onClick={() => alert(`View ${item.bloodId}`)}
                >
                  View
                </button>

                <button
                  className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-500 text-xs"
                  onClick={() => alert(`Delete ${item.bloodId}`)}
                >
                  Delete
                </button>

                {/* ✅ Button Separate */}
                {item.status === 'Stored' && (
                  <button
                    className="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-400 text-xs"
                    onClick={() => {
                      setSelectedBloodId(item.bloodId);
                      setShowSeparateModal(true);
                    }}
                  >
                    Separate
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {showSeparateModal && (
        <div className="fixed inset-0 backdrop-brightness-50 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-5 rounded-lg w-full max-w-[550px] shadow-xl">
            <h2 className="text-2xl mb-5 text-gray-600 text-center">
              Separate Blood Components
            </h2>

            <div className="grid grid-cols-2 gap-4 mb-5">
              {[
                { label: 'RBCs', color: 'red', desc: 'Carry oxygen' },
                { label: 'WBCs', color: 'green', desc: 'Fight infection' },
                { label: 'Platelets', color: 'yellow', desc: 'Aid clotting' },
                { label: 'Plasma', color: 'blue', desc: 'Protein-rich fluid' },
              ].map(({ label, color, desc }) => {
                const isChecked = selectedComponents.includes(label);
                return (
                  <label
                    key={label}
                    className={`relative flex flex-col justify-center items-start px-4 py-2 rounded-lg border cursor-pointer transition-all duration-200
              ${
                isChecked
                  ? `bg-${color}-50 border-${color}-300 ring-1 ring-${color}-300`
                  : 'bg-white border-gray-300 hover:bg-gray-50'
              }`}
                  >
                    {/* Hidden input checkbox */}
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={(e) => {
                        const isChecked = e.target.checked;
                        setSelectedComponents((prev) =>
                          isChecked
                            ? [...prev, label]
                            : prev.filter((c) => c !== label)
                        );
                      }}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />

                    <div className="flex items-center mb-1 w-full z-10">
                      <div
                        className={`w-5 h-5 rounded-full border-2 mr-2 flex items-center justify-center
                  ${isChecked ? `border-${color}-500` : 'border-gray-400'}`}
                      >
                        {isChecked && (
                          <div
                            className={`w-2.5 h-2.5 rounded-full bg-${color}-500`}
                          />
                        )}
                      </div>
                      <span className={`font-semibold text-${color}-700`}>
                        {label}
                      </span>
                    </div>
                    <span className="text-sm text-gray-600 ml-7 z-10">
                      {desc}
                    </span>
                  </label>
                );
              })}
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowSeparateModal(false);
                  setSelectedComponents([]);
                }}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition"
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-500 transition"
                onClick={() => {
                  handleSeparate(selectedBloodId, selectedComponents);
                }}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
