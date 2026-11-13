export interface scrollingType {
  name: string;
  description: string;
  rate: number;
  type?: string;
}
export const ScrollingItem: scrollingType[] = [
  {
    name: "Sarah M.",
    description:
      "I'm blown away by the quality and style of the clothes I received from Shop.co. From casual wear to elegant dresses, every piece Ive bought has exceeded my expectations.",
    rate: 5,
  },
  {
    rate: 5,
    name: "Alex K.",
    description:
      "Finding clothes that align with my personal style used to be a challenge until I discovered Shop.co. The range of options they offer is truly remarkable, catering to a variety of tastes and occasions.",
  },

  {
    rate: 5,
    name: "James L.",
    description:
      "As someone who's always on the lookout for unique fashion pieces, I'm thrilled to have stumbled upon Shop.co. The selection of clothes is not only diverse but also on-point with the latest trends.",
  },
  {
    rate: 5,
    name: "Mooen",
    description:
      "As someone who's always on the lookout for unique fashion pieces, I'm thrilled to have stumbled upon Shop.co. The selection of clothes is not only diverse but also on-point with the latest trends.",
  },
  {
    rate: 5,
    name: "Sarah M.",
    description:
      "I'm blown away by the quality and style of the clothes I received from Shop.co. From casual wear to elegant dresses, every piece I've bought has exceeded my expectations.",
  },
  {
    name: "Sarah M.",
    description:
      "I'm blown away by the quality and style of the clothes I received from Shop.co. From casual wear to elegant dresses, every piece I've bought has exceeded my expectations.",
    rate: 5,
    type: "Casual",
  },
  {
    name: "Alex K.",
    description:
      "Finding clothes that align with my personal style used to be a challenge until I discovered Shop.co. The range of options they offer is truly remarkable.",
    rate: 5,
    type: "Casual",
  },
  {
    name: "James L.",
    description:
      "As someone who's always on the lookout for unique fashion pieces, I'm thrilled to have stumbled upon Shop.co. The selection of clothes is not only diverse but also on-point.",
    rate: 5,
    type: "Casual",
  },
  {
    name: "Mooen",
    description:
      "The T-SHIRT fits perfectly and the material feels premium. Definitely buying more for my daily wear.",
    rate: 4.5,
    type: "Casual",
  },
  {
    name: "Emily R.",
    description:
      "Simple, clean designs that work for any casual outing. Fast delivery too!",
    rate: 4,
    type: "Casual",
  },

  // --- Formal Category ---
  {
    name: "Michael B.",
    description:
      "The suit I ordered fits like a glove. The fabric quality is top-notch, comparable to high-end designer brands.",
    rate: 5,
    type: "Formal",
  },
  {
    name: "David H.",
    description:
      "Perfect for office wear. Professional look with great comfort for all-day wear.",
    rate: 4.5,
    type: "Formal",
  },
  {
    name: "Sophia L.",
    description:
      "Elegant and classy. I wore this blazer to a business meeting and got so many compliments.",
    rate: 5,
    type: "Formal",
  },
  {
    name: "Robert P.",
    description:
      "Great value for money. The stitching and attention to detail on the formal shirts are impressive.",
    rate: 4,
    type: "Formal",
  },
  {
    name: "William T.",
    description:
      "Finally found a brand that understands formal fitting. Highly recommended for professionals.",
    rate: 5,
    type: "Formal",
  },

  // --- Party Category ---
  {
    name: "Jessica W.",
    description:
      "Absolutely stunning dress! It sparkled all night and I felt like a star. Great fit.",
    rate: 5,
    type: "Party",
  },
  {
    name: "Olivia G.",
    description:
      "The perfect outfit for a night out. Comfortable enough to dance in, yet stylish enough to turn heads.",
    rate: 5,
    type: "Party",
  },
  {
    name: "Daniel K.",
    description:
      "Bought a party shirt for New Year's Eve. The print is bold and the fabric is breathable.",
    rate: 4.5,
    type: "Party",
  },
  {
    name: "Mia S.",
    description:
      "Trendy and chic. Loved the vibes of this collection. Will definitely shop for my next event here.",
    rate: 4,
    type: "Party",
  },
  {
    name: "Isabella M.",
    description:
      "Unique designs that you don't see everywhere. If you want to stand out at a party, this is the place.",
    rate: 5,
    type: "Party",
  },

  // --- Gym Category ---
  {
    name: "Ryan C.",
    description:
      "Best gym wear I've purchased in a while. The material wicks sweat perfectly and moves with my body.",
    rate: 5,
    type: "Gym",
  },
  {
    name: "Linda K.",
    description:
      "Squat-proof leggings! Finally! Super comfortable for heavy lifting and cardio sessions.",
    rate: 5,
    type: "Gym",
  },
  {
    name: "Chris Evans",
    description:
      "Durable and stylish. I wash them frequently and the color hasn't faded a bit. Great for daily workouts.",
    rate: 4.5,
    type: "Gym",
  },
  {
    name: "Anna B.",
    description:
      "The sports bra offers great support without being restrictive. Highly recommend for runners.",
    rate: 5,
    type: "Gym",
  },
  {
    name: "Tom H.",
    description:
      "Lightweight and breathable. Makes my intense training sessions much more bearable.",
    rate: 4,
    type: "Gym",
  },
  // --- T-SHIRTs ---
  {
    name: "Mark D.",
    description:
      "The cotton quality is amazing. I've washed it 5 times and the print hasn't faded at all. Fits true to size.",
    rate: 5,
    type: "T-SHIRT",
  },
  {
    name: "Samantha L.",
    description:
      "Love the oversized fit! It's super breathable and perfect for summer. Will buy in other colors.",
    rate: 4.5,
    type: "T-SHIRT",
  },
  {
    name: "Chris P.",
    description:
      "Good quality for the price. The fabric is soft, but I suggest sizing up if you prefer a loose fit.",
    rate: 4,
    type: "T-SHIRT",
  },
  {
    name: "Jordan H.",
    description:
      "Simple, minimal, and stylish. It’s my go-to T-SHIRT for layering under jackets.",
    rate: 5,
    type: "T-SHIRT",
  },

  // --- JEANS ---
  {
    name: "Emily R.",
    description:
      "Finally found JEANS that fit my waist and thighs perfectly! The stretch denim is a game changer.",
    rate: 5,
    type: "JEANS",
  },
  {
    name: "Jacob T.",
    description:
      "Rugged and durable. I wear these for work and they hold up really well. Great stitching.",
    rate: 5,
    type: "JEANS",
  },
  {
    name: "Sophia K.",
    description:
      "The color is exactly as shown in the picture. Very comfortable, though a bit long for me.",
    rate: 4,
    type: "JEANS",
  },
  {
    name: "Mike W.",
    description:
      "Classic straight fit. Reminds me of the vintage denim styles. Highly recommended.",
    rate: 4.5,
    type: "JEANS",
  },

  // --- Hoodies ---
  {
    name: "Alex B.",
    description:
      "It feels like wearing a cloud. Super warm fleece inside, perfect for chilly evenings.",
    rate: 5,
    type: "Hoodie",
  },
  {
    name: "Jessica M.",
    description:
      "The pocket is huge and very convenient. The hood actually covers my head properly.",
    rate: 4.5,
    type: "Hoodie",
  },
  {
    name: "Ryan G.",
    description:
      "Great hoodie, but lint sticks to it easily. Otherwise, it's very cozy and stylish.",
    rate: 3.5,
    type: "Hoodie",
  },
  {
    name: "Leo N.",
    description:
      "Bought this for my gym sessions in winter. Keeps me warm before I start sweating.",
    rate: 5,
    type: "Hoodie",
  },

  // --- Shirts (Casual/Formal) ---
  {
    name: "Daniel C.",
    description:
      "The fabric is wrinkle-free which is a lifesaver for my business trips. Looks sharp.",
    rate: 5,
    type: "Shirt",
  },
  {
    name: "Laura S.",
    description:
      "Bought this checkered shirt for a casual look. Matches perfectly with my denim skirt.",
    rate: 4.5,
    type: "Shirt",
  },
  {
    name: "Kevin B.",
    description:
      "Nice pattern and buttons feels premium. Sleeves are a tiny bit short for me though.",
    rate: 4,
    type: "Shirt",
  },
  {
    name: "Ethan F.",
    description:
      "Perfect linen shirt for beach vacations. Light, airy, and looks expensive.",
    rate: 5,
    type: "Shirt",
  },
];
