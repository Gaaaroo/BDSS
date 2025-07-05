export default function BloodCard({ bloodType, units, onClick, request }) {
  return (
    <div
      className="bg-gray-100 rounded-lg w-[250px] h-[130px] p-4 pt-1 hover:border-1 border-red-700 transition-all"
      onClick={onClick}
    >
      <div className="text-3xl font-bold text-red-700 text-left p-2 pl-0">
        {bloodType}
      </div>
      <div className="flex justify-between">
        <div>
          <div className="text-md text-gray-800 font-medium mt-1">
            {request}
            {request > 1 ? ' requests' : ' request'}
          </div>
          <div className="text-md text-red-800 font-medium mt-1">
            {units}
            {units > 1 ? ' Units' : ' Unit'}
          </div>
        </div>
        <img
          src="https://png.pngtree.com/png-vector/20220820/ourmid/pngtree-blood-logo-template-vector-icon-illustration-donate-teardrop-red-vector-png-image_38444056.png"
          alt=""
          className="h-32 w-33 -mt-10 -mr-10"
        />
      </div>
    </div>
  );
}
