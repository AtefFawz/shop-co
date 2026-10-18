interface SectionHeadingProps {
  title: string;
  styling?: string;
}
export default function SectionHeading({ title, styling }: SectionHeadingProps) {
  return (
    <h1 className={`h1-main w-full text-center pb-3 mb-8 pl-4  ${styling} `}>
      {`${title}`.toLocaleUpperCase()}
    </h1>
  );
}
