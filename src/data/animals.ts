import goldenRetriever from "@/assets/animals/golden-retriever.jpg";
import maineCoon from "@/assets/animals/maine-coon.jpg";
import hamster from "@/assets/animals/hamster.jpg";
import macaw from "@/assets/animals/macaw.jpg";
import canary from "@/assets/animals/canary.jpg";
import bettaFish from "@/assets/animals/betta-fish.jpg";
import turtle from "@/assets/animals/turtle.jpg";
import iguana from "@/assets/animals/iguana.jpg";

export interface Animal {
  id: string;
  name: string;
  species: string;
  breed: string;
  category: "mammals" | "birds" | "aquatic" | "reptiles";
  price: number;
  age: string;
  image: string;
  certified: boolean;
  certificateId: string;
  description: string;
  temperament: string;
  healthStatus: string;
  vaccinated: boolean;
  seller: string;
}

export const animals: Animal[] = [
  {
    id: "1",
    name: "Buddy",
    species: "Dog",
    breed: "Golden Retriever",
    category: "mammals",
    price: 1200,
    age: "3 months",
    image: goldenRetriever,
    certified: true,
    certificateId: "KODA-MML-2024-0847",
    description: "Friendly and loyal Golden Retriever puppy with excellent pedigree. Raised in a loving home environment with proper socialization. Great with children and other pets.",
    temperament: "Friendly, Loyal, Playful",
    healthStatus: "Excellent",
    vaccinated: true,
    seller: "Happy Paws Breeder",
  },
  {
    id: "2",
    name: "Whiskers",
    species: "Cat",
    breed: "Maine Coon",
    category: "mammals",
    price: 950,
    age: "5 months",
    image: maineCoon,
    certified: true,
    certificateId: "KODA-MML-2024-1203",
    description: "Majestic Maine Coon kitten with a luxurious coat and gentle nature. Known for their intelligence and dog-like personality. Loves to play fetch and follow their owner around.",
    temperament: "Gentle, Intelligent, Sociable",
    healthStatus: "Excellent",
    vaccinated: true,
    seller: "Feline Royalty Cattery",
  },
  {
    id: "3",
    name: "Nugget",
    species: "Hamster",
    breed: "Syrian Golden",
    category: "mammals",
    price: 35,
    age: "2 months",
    image: hamster,
    certified: true,
    certificateId: "KODA-MML-2024-0392",
    description: "Adorable Syrian Golden Hamster with a sweet temperament. Low maintenance pet perfect for families. Comes with care guide and starter food supply.",
    temperament: "Curious, Gentle, Active",
    healthStatus: "Good",
    vaccinated: false,
    seller: "Tiny Critters Shop",
  },
  {
    id: "4",
    name: "Rio",
    species: "Parrot",
    breed: "Scarlet Macaw",
    category: "birds",
    price: 2800,
    age: "1 year",
    image: macaw,
    certified: true,
    certificateId: "KODA-BRD-2024-0156",
    description: "Stunning Scarlet Macaw with vibrant plumage and an engaging personality. Hand-raised and well-socialized. Can learn to speak up to 50 words. CITES certified.",
    temperament: "Intelligent, Social, Vocal",
    healthStatus: "Excellent",
    vaccinated: true,
    seller: "Tropical Wings Aviary",
  },
  {
    id: "5",
    name: "Sunny",
    species: "Canary",
    breed: "Yellow Canary",
    category: "birds",
    price: 85,
    age: "6 months",
    image: canary,
    certified: true,
    certificateId: "KODA-BRD-2024-0891",
    description: "Beautiful Yellow Canary with a melodious singing voice. Bred for show quality. Brightens any room with cheerful songs throughout the day.",
    temperament: "Cheerful, Calm, Melodious",
    healthStatus: "Good",
    vaccinated: false,
    seller: "Songbird Haven",
  },
  {
    id: "6",
    name: "Azure",
    species: "Fish",
    breed: "Betta Splendens",
    category: "aquatic",
    price: 45,
    age: "4 months",
    image: bettaFish,
    certified: true,
    certificateId: "KODA-AQU-2024-0567",
    description: "Magnificent Betta fish with flowing blue and red fins. Captive bred for optimal health and color. Thrives in a 5+ gallon heated aquarium.",
    temperament: "Curious, Territorial, Active",
    healthStatus: "Excellent",
    vaccinated: false,
    seller: "AquaLife Store",
  },
  {
    id: "7",
    name: "Shelly",
    species: "Turtle",
    breed: "Red-Eared Slider",
    category: "aquatic",
    price: 120,
    age: "8 months",
    image: turtle,
    certified: true,
    certificateId: "KODA-AQU-2024-0234",
    description: "Healthy Red-Eared Slider turtle with distinctive markings. Semi-aquatic pet that enjoys basking and swimming. Can live 20-40 years with proper care.",
    temperament: "Calm, Hardy, Curious",
    healthStatus: "Good",
    vaccinated: false,
    seller: "Shell & Scale Pets",
  },
  {
    id: "8",
    name: "Rex",
    species: "Lizard",
    breed: "Green Iguana",
    category: "reptiles",
    price: 250,
    age: "6 months",
    image: iguana,
    certified: true,
    certificateId: "KODA-RPT-2024-0712",
    description: "Vibrant Green Iguana with a docile nature. Captive bred and handled regularly for a tame disposition. Herbivorous diet makes feeding straightforward.",
    temperament: "Docile, Curious, Calm",
    healthStatus: "Excellent",
    vaccinated: false,
    seller: "Exotic Reptile Co.",
  },
];

export const categories = [
  { key: "all", label: "All Pets" },
  { key: "mammals", label: "Mammals" },
  { key: "birds", label: "Birds" },
  { key: "aquatic", label: "Aquatic" },
  { key: "reptiles", label: "Reptiles" },
] as const;
