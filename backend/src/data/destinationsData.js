// Dubai Tourist Attractions Data
const destinationsData = [
  {
    id: "burj-khalifa",
    name: "Burj Khalifa",
    location: "1 Sheikh Mohammed bin Rashid Blvd, Downtown Dubai",
    category: "Iconic Landmark & Skyscraper",
    description: "The tallest freestanding structure on earth standing at 828 meters. Soar to the 124th and 125th floor observation decks for unmatched 360-degree vistas across the Arabian Gulf and desert horizon.",
    estimatedDuration: "2 - 3 Hours",
    estimatedEntryPrice: 5500, // in BDT (demo estimate)
    aedEntryPrice: 179,
    bestVisitingTime: "Late afternoon for golden hour sunset (4:30 PM - 6:30 PM)",
    imageUrl: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80",
    rating: 4.9,
    reviewsCount: 1250,
    highlights: [
      "Level 124 & 125 'At The Top' Outdoor Observation Terrace",
      "High-speed double-deck elevator traveling at 10m/second",
      "Interactive telescope viewing historical Dubai progression",
      "Overlooking the Dubai Fountain lake show"
    ],
    nearbyAttractions: ["The Dubai Mall", "Dubai Opera", "Dubai Fountain Show", "Souk Al Bahar"],
    travelTips: "Book non-prime morning or early evening slots online to skip ticket queue lines. Bring a light jacket as the observation deck can be breezy."
  },
  {
    id: "dubai-mall",
    name: "The Dubai Mall & Dubai Fountain",
    location: "Downtown Dubai, adjacent to Burj Khalifa",
    category: "Shopping, Leisure & Entertainment",
    description: "The world's most visited retail and entertainment destination, housing over 1,200 retail stores, the massive Dubai Aquarium & Underwater Zoo, Olympic-sized ice rink, and the mesmerizing choreographed Dubai Fountain.",
    estimatedDuration: "4 - 6 Hours",
    estimatedEntryPrice: 0, // Free entry to mall & fountain
    aedEntryPrice: 0,
    bestVisitingTime: "Evening for the illuminated fountain performances (every 30 mins from 6 PM)",
    imageUrl: "https://images.unsplash.com/photo-1580674684081-7617fbf3d745?auto=format&fit=crop&w=1200&q=80",
    rating: 4.8,
    reviewsCount: 980,
    highlights: [
      "World's largest choreographed dancing fountain system",
      "10-million-liter Dubai Aquarium & Underwater Zoo tunnel",
      "VR Park & KidZania entertainment zones",
      "Chinatown & Fashion Avenue luxury district"
    ],
    nearbyAttractions: ["Burj Khalifa", "Souk Al Bahar bridge", "Dubai Opera"],
    travelTips: "Wear comfortable walking footwear; the mall encompasses over 1 million square meters. Watch the fountain show from the Apple Store balcony or Waterfront Promenade."
  },
  {
    id: "dubai-marina",
    name: "Dubai Marina & Marina Walk",
    location: "Al Marsa Street, Dubai Marina District",
    category: "Waterfront & Lifestyle",
    description: "A breathtaking man-made canal city framed by glittering high-rise towers, luxury yachts, al fresco dining bistros along the 7 km Marina Walk, and traditional dhow dinner cruises.",
    estimatedDuration: "3 - 4 Hours",
    estimatedEntryPrice: 3500, // Optional Dhow Cruise BDT
    aedEntryPrice: 115,
    bestVisitingTime: "Sunset & Evening for cool breezes and night illuminations",
    imageUrl: "https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=1200&q=80",
    rating: 4.8,
    reviewsCount: 840,
    highlights: [
      "7 km landscaped pedestrian walkway with 300+ cafes and restaurants",
      "Sunset and dinner cruises aboard illuminated wooden Dhow boats",
      "Dubai Marina Mall waterfront shopping",
      "XLine Dubai Marina — the world's longest urban zipline"
    ],
    nearbyAttractions: ["JBR The Beach", "Ain Dubai on Bluewaters Island", "Dubai Marina Mall"],
    travelTips: "Take the Dubai Tram from Marina Towers to JBR. An evening 2-hour dinner cruise is the most relaxing way to view the skyscrapers."
  },
  {
    id: "palm-jumeirah",
    name: "Palm Jumeirah & The View at The Palm",
    location: "Palm Jumeirah Island, Arabian Gulf",
    category: "Architectural Wonder & Luxury",
    description: "The world-famous tree-shaped artificial archipelago extending into the Arabian Gulf. Home to luxury resorts, Aquaventure Waterpark, Boardwalk sunsets, and 360-degree views from The View at The Palm.",
    estimatedDuration: "3 - 5 Hours",
    estimatedEntryPrice: 3200, // The View entry BDT
    aedEntryPrice: 100,
    bestVisitingTime: "Afternoon leading into sunset",
    imageUrl: "https://images.unsplash.com/photo-1580674684081-7617fbf3d745?auto=format&fit=crop&w=1200&q=80",
    rating: 4.9,
    reviewsCount: 920,
    highlights: [
      "The View at The Palm — 240-meter high observation deck on Palm Tower",
      "Scenic Palm Monorail journey from gateway to Atlantis",
      "Palm Jumeirah Boardwalk overlooking Dubai skyline",
      "The Pointe dining destination facing Atlantis"
    ],
    nearbyAttractions: ["Atlantis The Palm", "Aquaventure Waterpark", "Nakheel Mall"],
    travelTips: "Ride the Palm Monorail for panoramic views of the fronds and luxury villas. Visit The View on Level 52 for photo opportunities."
  },
  {
    id: "desert-safari",
    name: "Dubai Desert Safari & Arabian Camp",
    location: "Lahbab Red Dunes Desert, Dubai",
    category: "Adventure & Cultural Experience",
    description: "The quintessentially Arabian desert adventure. Thrill to 4x4 Land Cruiser dune bashing across crimson sands, try sandboarding, ride camels, and enjoy a traditional Bedouin barbecue buffet with fire shows and Tanoura dancing under the stars.",
    estimatedDuration: "6 Hours (2:30 PM - 8:30 PM)",
    estimatedEntryPrice: 4200, // Package per person BDT
    aedEntryPrice: 135,
    bestVisitingTime: "Afternoon to Evening (Year-round, best Oct - April)",
    imageUrl: "https://images.unsplash.com/photo-1451337516015-6b6e9a44a8a3?auto=format&fit=crop&w=1200&q=80",
    rating: 4.9,
    reviewsCount: 1450,
    highlights: [
      "Adrenaline-pumping 4x4 dune bashing across high red dunes",
      "Sunset photography stop atop undisturbed desert ridges",
      "Camel rides and desert sandboarding",
      "Henna hand-painting and Arabic attire photo stops",
      "BBQ buffet dinner with live Tanoura and fire dance shows"
    ],
    nearbyAttractions: ["Al Marmoom Desert Conservation Reserve", "Bab Al Shams Desert Resort"],
    travelTips: "Wear loose, breathable clothing and sandals or slip-on shoes to shake off sand. Keep cameras protected in zip bags while dune bashing."
  },
  {
    id: "miracle-garden",
    name: "Dubai Miracle Garden",
    location: "Al Barsha South 3, Dubailand",
    category: "Botanical Floral Wonderland",
    description: "The world's largest natural flower garden boasting over 150 million blooming flowers sculpted into whimsical castles, hearts, character arches, and a full-size Emirates Airbus A380 covered entirely in vibrant blossoms.",
    estimatedDuration: "2 - 3 Hours",
    estimatedEntryPrice: 2800, // Entry BDT
    aedEntryPrice: 95,
    bestVisitingTime: "Morning or late afternoon (Seasonal: November to April only)",
    imageUrl: "https://images.unsplash.com/photo-1597659840241-37e2b9c2f55f?auto=format&fit=crop&w=1200&q=80",
    rating: 4.7,
    reviewsCount: 650,
    highlights: [
      "Guinness World Record Emirates A380 floral installation",
      "Heart-shaped flower pathway and Umbrella Tunnel",
      "Floral Castle and Disney Avenue character sculptures",
      "Adjacent Dubai Butterfly Garden with thousands of species"
    ],
    nearbyAttractions: ["Dubai Butterfly Garden", "Global Village (15 mins by taxi)", "Mall of the Emirates"],
    travelTips: "Miracle Garden closes during the summer heat months (May - October). Visit on weekdays to avoid family weekend crowds."
  },
  {
    id: "museum-of-the-future",
    name: "Museum of the Future",
    location: "Sheikh Zayed Road, Trade Centre 2",
    category: "Architecture & Futuristic Innovation",
    description: "Acclaimed as 'the most beautiful building on Earth', this torus-shaped architectural masterpiece is wrapped in Arabic calligraphy quoting HH Sheikh Mohammed. Inside, explore immersive exhibits predicting humanity, climate, and space in 2071.",
    estimatedDuration: "2 - 3 Hours",
    estimatedEntryPrice: 4500, // Entry BDT
    aedEntryPrice: 149,
    bestVisitingTime: "Morning slots (10:00 AM - 1:00 PM)",
    imageUrl: "https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=1200&q=80",
    rating: 4.8,
    reviewsCount: 780,
    highlights: [
      "Pillarless architectural design with poetry embossed in Arabic calligraphy",
      "Space shuttle simulator to the OSS Hope space station in 2071",
      "The Heal Institute — digital DNA rainforest of thousands of species",
      "Future Heroes playground fostering creativity for children"
    ],
    nearbyAttractions: ["Emirates Towers", "Dubai World Trade Centre", "Dubai Frame"],
    travelTips: "Tickets sell out 2 to 4 weeks in advance; early booking is mandatory. Accessible directly via Emirates Towers Metro Station."
  },
  {
    id: "global-village",
    name: "Global Village Dubai",
    location: "Sheikh Mohammed Bin Zayed Road (Exit 37)",
    category: "Multicultural Festival & Food Park",
    description: "A gigantic open-air multicultural festival park bringing together over 90 world cultures across themed country pavilions. Experience authentic street foods, live folk music, artisan bazaars, and exhilarating carnival rides.",
    estimatedDuration: "4 - 5 Hours",
    estimatedEntryPrice: 850, // Entry BDT (very affordable)
    aedEntryPrice: 25,
    bestVisitingTime: "Evening from 5:30 PM until late midnight (Seasonal: Oct - April)",
    imageUrl: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80",
    rating: 4.8,
    reviewsCount: 1100,
    highlights: [
      "90+ international cultural pavilions including Bangladesh, Turkey, and UAE",
      "Floating market serving authentic Southeast Asian and Middle Eastern dishes",
      "Carnaval thrill rides, bumper cars, and games zone",
      "Nightly fireworks displays every Friday and Saturday"
    ],
    nearbyAttractions: ["IMG Worlds of Adventure", "Dubai Miracle Garden", "Cityland Mall"],
    travelTips: "Arrive around 4:30 PM right as gates open to find easy parking. Try the Turkish ice cream, Emirati luqaimat sweets, and Yemeni honey."
  }
];

module.exports = destinationsData;
