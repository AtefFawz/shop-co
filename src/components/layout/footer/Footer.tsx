import Newsletter from "./Newsletter";
import { Feature } from "./Feature";
import { Media } from "./Media";
import { CopyRight } from "./CopyRight";
export default function Footer() {
  const all = [
    { title: "COMPANY", items: ["About ", "Features ", "Works ", "Career "] },
    {
      title: "HELP",
      items: [
        "Customer Support",
        "Delivery Details",
        "Terms & Conditions",
        "Privacy Policy",
      ],
    },
    {
      title: "FAQ",
      items: ["Account", "Manage Deliveries", "Orders", "Payments"],
    },
    {
      title: "RESOURCES",
      items: [
        "Free eBooks",
        "Development Tutorial",
        "How to - Blog",
        "Youtube Playlist",
      ],
    },
  ];

  return (
    <section>
      {" "}
      <Newsletter />
      <div className="bg-[#F0F0F0] ">
        <div className="container mx-auto w-full py-10 flex items-center justify-between flex-wrap ">
          <div className="md:w-[20%] w-full px-4">
            <Media />
          </div>
          <div className="md:w-[77%] xl:w-[70%] w-full flex justify-evenly items-center mt-6 flex-wrap gap-6 px-2">
            {" "}
            {all.map((item, index) => (
              <div key={index} className="md:w-[20%] w-[40%]">
                <Feature title={item.title} feature={item.items} />
              </div>
            ))}
          </div>
          <CopyRight />
        </div>
      </div>
    </section>
  );
}
