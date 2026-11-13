interface StorefrontHeroContent extends StorefrontStat {
  btnText: string;
  // image: StaticImageData;
}

export const storefrontHeroContent: StorefrontHeroContent = {
  title: "FIND CLOTHES THAT MATCHES YOUR STYLE",
  description:
    "Browse through our diverse range of meticulously crafted garments, designed to bring out your individuality and cater to your sense of style.",
  btnText: "Shop Now",
};
interface StorefrontStat {
  title: string;
  description: string;
}
export const storefrontStats: StorefrontStat[] = [
  { title: "200+", description: "International Brands" },
  { title: "2,000+", description: "High-Quality Products" },
  { title: "30,000+", description: "Happy Customers" },
];

export const featuredBrandNames: string[] = [
  "VERSACE",
  "ZARA",
  "GUCCI",
  "PRADA",
  "CALVINKLEIN",
];
