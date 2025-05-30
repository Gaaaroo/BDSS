import img from "../assets/images/cover-photo.jpg";
import BloodCompatibilityChecker from "./BloodCompatibilityChecker";
import BloodDocs from "./BloodDocs";

// const [bloodDoc, setBloodDoc] = useState({
//     "bloodType":"",
//     "description":"",
//     "image":"",
// });




export default function BannerImage() {
  return (
    <div className="relative w-full h-65 overflow-hidden">
      <div className="absolute inset-0 bg-white opacity-10"></div>
      <img src={img} alt="banner" className="w-full h-40 object-cover " />
      <BloodCompatibilityChecker />

    </div>
  );
}
