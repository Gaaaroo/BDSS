import { ArrowRight } from 'lucide-react';

export default function BloodCard({ bloodType, units }) {
  return (
    <div className="bg-red-200 rounded-lg w-[250px] h-[130px] p-4 pt-1 shadow-md hover:shadow-lg transition-all">
      <div className="flex justify-end">
        <ArrowRight className=" text-red-600" size={20} />
      </div>
      <div className="text-3xl font-bold text-red-700 text-left">
        {bloodType}
      </div>
      <div className="flex justify-between">
        <div>
          <div className="text-md text-gray-800 font-medium mt-1">
            12 request
          </div>
          <div className="text-md text-red-800 font-medium mt-1">
            {units}
            {units > 1 ? ' Units' : ' Unit'}
          </div>
        </div>
        <img
          src="https://png.pngtree.com/png-vector/20220820/ourmid/pngtree-blood-logo-template-vector-icon-illustration-donate-teardrop-red-vector-png-image_38444056.png"
          alt=""
          className="h-35 w-35 -mt-12 -mr-10"
        />
      </div>
    </div>
  );
}
