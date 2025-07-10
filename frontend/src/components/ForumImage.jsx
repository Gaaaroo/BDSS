import img from "../assets/images/cover-photo.jpg";
export default function ForumImage({ searchKey, setSearchKey, handleSearch }) {
  return (
    <>
      <div className="relative w-full h-44 md:h-56 overflow-hidden bg-white flex items-center justify-center">
        <img src={img} alt="banner" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-[#F76C6C] opacity-30"></div>
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white drop-shadow-lg tracking-wide text-center">
            BDSS Forum
          </h1>
          <p className="mt-2 text-lg md:text-xl text-white drop-shadow text-center font-medium">
            A place to share, connect, and spread kindness
          </p>
        </div>
      </div>
    </>
  );
}