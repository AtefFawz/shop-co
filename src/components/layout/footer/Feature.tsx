export const Feature = ({
  feature,
  title,
}: {
  feature: string[];
  title: string;
}) => {
  return (
    <div className="flex flex-col gap-4  ">
      <h1 className="font-medium">{title}</h1>
      {feature.map((item, index) => (
        <span key={index} className="text-xs md:text-sm text-gray-500">
          {item}
        </span>
      ))}
    </div>
  );
};
