const Inputs = ({ data }: { data: any }) => {
  return (
    <div className="relative">
      <input
        {...data}
        className="border border-gray-300 outline-none focus:border focus:border-green-700 duration-300 rounded-md py-4 pl-13 w-full"
      />
      <div className="text-gray-800 text-2xl absolute left-4 top-1/2 transform -translate-y-1/2 ">
        {data.icon}
      </div>
    </div>
  );
};

export { Inputs };
