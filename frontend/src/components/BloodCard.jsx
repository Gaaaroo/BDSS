import { ArrowRight } from 'lucide-react';

export default function BloodCard({ bloodType, units }) {
  return (
    <div className="bg-red-200 rounded-lg w-[250px] h-[130px] p-4 shadow-md hover:shadow-lg transition-all">
      <ArrowRight className="absolute top-2 right-2 text-red-600" size={20} />

      <div className="text-2xl font-bold text-red-700 text-left">
        {bloodType}
      </div>

      <div className="text-md text-gray-800 font-medium mt-1">12 request</div>

      <div className="text-md text-red-800 font-medium mt-1">
        {units}
        {units > 1 ? ' Units' : ' Unit'}
      </div>
    </div>
  );
}
