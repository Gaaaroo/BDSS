import img from "../assets/images/logo.jpg";

export default function BloodDoc({ bloodType, image, description, document }) {
  return (
    <li
      className="bg-[#FFDEDE] w-80 h-170 m-5 rounded-3xl shadow-xl flex flex-col
      items-center p-6 transition-transform hover:scale-105"
    >
      <img
        src={img}
        alt={bloodType}
        className="w-16 h-16 mb-3 object-contain rounded-full border-2 border-[#FFA1A1] shadow"
      />
      <div className="font-bold text-xl text-[#FD3131] mb-2">{bloodType}</div>
      <div className="text-base text-gray-800 text-center font-medium mb-2">{description}</div>
      <div className="text-sm text-gray-600 text-justify bg-white bg-opacity-70 rounded-xl px-4 py-2 mt-auto shadow-inner\
      h-100">
        {document}
      </div>
    </li>
  );
}