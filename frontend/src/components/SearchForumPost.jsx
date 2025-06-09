export default function SearchForumPost() {
  return (
    <>
      <div className="w-full flex justify-center items-center mt-2 h-[100px]">
        <div className="w-[700px] h-[80px]">
          <div className="bg-[#FFA1A1] rounded-[50px] h-[66px] hover:scale-105">
            <div className="flex justify-center mt-4">
              <input
                type="text"
                placeholder="Tìm kiếm theo chủ đề..."
                className="w-[520px] h-[44px] px-4 py-2 text-[14px] mt-3 mb-3 bg-[#FFDEDE]
                rounded-[50px] mr-5 hover:scale-105 text-gray-900"
              />
              <button
                className="px-4 py-2 h-[44px] w-[90px] bg-[#FD3131] text-white rounded-[50px]
                 hover:bg-[#FFDEDE] hover:text-red-500 hover:font-bold
                 mt-3 mb-3 text-[17px]"
              >
                Search
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
