export interface Couple {
  id: string;
  names: string;
  image: string;
  quote: string;
  story: string;
  location: string;
  marriedSince: string;
}

export const COUPLES: Couple[] = [
  {
    id: "priya-arjun",
    names: "Priya & Arjun",
    image: "/Images/sucess story.png",
    quote: "VivaahAI helped us find each other in the most beautiful way.",
    story:
      "Priya and Arjun matched on VivaahAI after months of searching elsewhere without luck. Their shared love for classical music and similar family values stood out instantly in their compatibility score. After three months of conversations and two family meetings, they knew they had found their person. Today, they credit VivaahAI's AI matching for connecting them not just as partners, but as best friends.",
    location: "Mumbai, Maharashtra",
    marriedSince: "Married in March 2024",
  },
  {
    id: "neha-karan",
    names: "Neha & Karan",
    image: "/Images/sucess story2.png",
    quote: "We connected instantly and never looked back since.",
    story:
      "Neha was hesitant about online matchmaking until VivaahAI's verified profiles and AI-driven compatibility report gave her confidence. Karan reached out first, and within their very first conversation, they realised how similar their outlooks on life and family were. A whirlwind six-month courtship later, their families met and the wedding was planned within the year.",
    location: "Delhi NCR",
    marriedSince: "Married in November 2023",
  },
  {
    id: "sneha-rohan",
    names: "Sneha & Rohan",
    image: "/Images/sucess story 3.png",
    quote: "Our families bonded as quickly as we did, thanks to VivaahAI.",
    story:
      "Sneha and Rohan's families lived in different cities, but VivaahAI's detailed profiles and video call feature made the early conversations feel natural and personal. What stood out most was how quickly both families connected over shared traditions and values, making the entire journey from first match to marriage feel effortless.",
    location: "Bengaluru, Karnataka",
    marriedSince: "Married in January 2024",
  },
  {
    id: "anjali-mohit",
    names: "Anjali & Mohit",
    image: "/Images/sucess story 4.png",
    quote: "From the first chat to forever, a beautiful journey together.",
    story:
      "Anjali and Mohit were both busy professionals who didn't have time for the traditional matchmaking process. VivaahAI's smart filters helped them find each other based on career ambitions and lifestyle compatibility. Their first chat lasted four hours, and they both knew this was different from any match they'd had before.",
    location: "Pune, Maharashtra",
    marriedSince: "Married in June 2024",
  },
];

export interface VideoStory {
  id: string;
  title: string;
  thumbnail: string;
  duration: string;
  description: string;
}

export const VIDEOS: VideoStory[] = [
  {
    id: "our-journey",
    title: "Our Journey with VivaahAI",
    thumbnail: "/Images/success story 5.png",
    duration: "2:30",
    description:
      "Watch how two families came together after a chance match on VivaahAI turned into a lifelong commitment. This heartfelt video captures their journey from the first message to the wedding mandap.",
  },
  {
    id: "perfect-match",
    title: "How We Found Our Perfect Match",
    thumbnail: "/Images/Ashish & Shubh .png",
    duration: "1:45",
    description:
      "Ashish and Shubh share how VivaahAI's compatibility scoring helped them see past the initial nervousness of online matchmaking and discover a genuine, lasting connection.",
  },
  {
    id: "bond-of-trust",
    title: "A Bond Built on Trust and Love",
    thumbnail: "/Images/wedding.png",
    duration: "3:12",
    description:
      "A candid conversation about how verified profiles and transparent communication on VivaahAI helped this couple build trust long before they met in person.",
  },
];
