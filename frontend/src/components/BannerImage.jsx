import img from '../assets/images/cover-photo.jpg';
import BloodCompatibilityChecker from './BloodCompatibilityChecker';
import Footer from './Footer';

// const [bloodDoc, setBloodDoc] = useState({
//     "bloodType":"",
//     "description":"",
//     "image":"",
// });

export default function BannerImage() {
  return (
    <>
      <div className="w-full h-auto bg-white mb-[50px]">
        <img src={img} alt="banner" className="w-full h-40 object-cover " />
        <BloodCompatibilityChecker />
      </div>
      <Footer />
    </>
  );
}
