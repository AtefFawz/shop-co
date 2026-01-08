import Heading from "@/components/ui/Heading";
export default function Newsletter() {
  return (
    <section className="flex md:flex-row flex-col container mx-auto px-4 lg:px-6 xl:px-8 2xl:px-10 bg-gray-950 justify-evenly rounded-2xl p-6 gap-8">
      <div className="text-white w-full ">
        {" "}
        <Heading
          title="STAY UPTO DATE ABOUT OUR LATEST OFFERS"
          styling="text-[#ffffff] text-start"
        />{" "}
      </div>
      <div className="flex flex-col gap-y-5 w-full ">
        <input
          type="text"
          placeholder="enter your email address"
          className="bg-[#ffffff] rounded-full border-none outline-none text-gray-400 px-5 py-3 w-full focus:ring-2 focus:ring-green-300 transition-all"
        />
        <button className="bg-[#ffffff] border-none rounded-full  px-5 py-3 w-full">
          Subscribe to Newsletter
        </button>
      </div>
    </section>
  );
}
