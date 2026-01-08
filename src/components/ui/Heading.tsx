interface types {
  title: string;
  styling?: string;
}
export default function Heading({ title, styling }: types) {
  return <h1 className={`h1-main w-full text-center ${styling} `}>{title}</h1>;
}
