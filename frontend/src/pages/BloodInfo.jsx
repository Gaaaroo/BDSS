import BannerImage from "../components/BannerImage";
import BloodDocs from "../components/BloodDocs";
import Navbar from "../components/Navbar";

export default function BloodInfo() {
  return (
    <div >
      <Navbar showMenu={false} />
      <BannerImage />
      <BloodDocs />
    </div>
  );
}
