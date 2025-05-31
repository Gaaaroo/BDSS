import img from "../assets/images/logo.jpg";

export default function BloodDoc({ bloodType, image, description }) {
  return (
    <li
      className=" bg-[#FFDEDE] w-80 h-80 m-5
      rounded-[50px] shadow-lg flex flex-col items-center justify-center"
    >
      <img
        src={img}
        alt={bloodType}
        className="w-12 h-12 mb-2 object-contain "
      />
      <div className="font-bold text-red-600">{bloodType}</div>
      <div className="text-sm text-gray-700 text-center">{description}</div>
    </li>
  );
}
