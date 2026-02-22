const Inputs = ({ data }: { data: any }) => {
  return (
    <div>
      <label
        htmlFor="email"
        className="block text-sm font-medium text-gray-700 mb-2 pl-1"
      >
        {data.title}
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <span className="text-gray-400">{data.icon}</span>
        </div>
        <input
          id="email"
          {...data}
          className="w-full pl-11 pr-4 py-4 bg-gray-50 border-2 border-gray-100 rounded-xl focus:outline-none focus:border-black focus:bg-white transition-all font-medium"
        />
      </div>
    </div>
  );
};

export { Inputs };
