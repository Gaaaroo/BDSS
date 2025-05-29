export default function BloodSearch() {
    return(

        <div className="absolute left-1/2 top-[50] transform -translate-x-1/2 -translate-y-1/2 w-full flex justify-center h-15">
        <form
          className="flex items-center gap-2 p-4 rounded-[50px] shadow-lg relative w-3xl bg-[#FFDEDE] hover:scale-103 transition duration-300"
        >
          <input
            type="text"
            placeholder="Search for blood documents..."
            className="absolute left-1/13 p-2 rounded-[50px]  border-gray-300 w-130 
            hover:scale-100 transition duration-300 focus:outline-none focus:underline focus:underline-offset-4 
            text-base text-[17px]"
          />
          <button
            type="submit"
            className="absolute right-1/13 bg-[#FFA1A1] rounded-[50px] text-black px-8 py-2 
            hover:bg-[#FD3131] transition duration-300 hover:text-white 
            text-[17px]"
          >
            Search
          </button>
        </form>
        
      </div>
    );
}