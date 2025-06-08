import img from "../assets/images/cover-photo.jpg";
import SearchForumPost from "./SearchForumPost";
export default function ForumImage() {
  return (
    <>
      <div className="relative w-full h-40 overflow-hidden bg-white">
        <div className="absolute inset-0 bg-white opacity-10"></div>
        <img src={img} alt="banner" className="w-full h-40 object-cover " />
      </div>

      <SearchForumPost />
    </>
  );
}
