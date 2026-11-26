// Static Dubai attraction data. All costs are DEMO ESTIMATES in BDT per person (0 = free entry).
export const ATTRACTIONS = [
  { slug: "burj-khalifa", name: "Burj Khalifa", cost: 5500, duration: "2 hours", image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1200", description: "The world's tallest tower. The observation decks give sweeping views of the city, best around sunset." },
  { slug: "dubai-mall", name: "Dubai Mall", cost: 0, duration: "3 to 4 hours", image: "https://images.unsplash.com/photo-1518684079-3c830dcef090?w=1200", description: "Huge shopping and entertainment complex beside the Dubai Fountain. Entry is free; attractions inside are extra." },
  { slug: "dubai-marina", name: "Dubai Marina", cost: 0, duration: "2 to 3 hours", image: "https://images.unsplash.com/photo-1512632578888-169bbbc64f33?w=1200", description: "Waterfront promenade lined with towers, cafes and yachts. A dhow cruise is optional and paid separately." },
  { slug: "palm-jumeirah", name: "Palm Jumeirah", cost: 0, duration: "Half day", image: "https://images.unsplash.com/photo-1582672060674-bc2bd808a8b5?w=1200", description: "The palm-shaped island with beach clubs, resorts and the monorail. Viewing decks cost extra." },
  { slug: "desert-safari", name: "Dubai Desert Safari", cost: 6500, duration: "6 hours", image: "https://images.unsplash.com/photo-1451337516015-6b6e9a44a8a3?w=1200", description: "Dune bashing, camel rides and a desert camp dinner. Usually includes hotel pick-up." },
  { slug: "miracle-garden", name: "Dubai Miracle Garden", cost: 3200, duration: "2 to 3 hours", image: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=1200", description: "A giant flower park. Seasonal: typically open in the cooler months only, so check dates." },
  { slug: "museum-of-the-future", name: "Museum of the Future", cost: 7500, duration: "2 to 3 hours", image: "https://images.unsplash.com/photo-1597659840241-37e2b9c2f55f?w=1200", description: "A landmark museum of immersive exhibits on technology and the future. Timed tickets are common." },
  { slug: "global-village", name: "Global Village", cost: 800, duration: "3 to 4 hours", image: "https://images.unsplash.com/photo-1546412414-e1885259563a?w=1200", description: "Seasonal multicultural park with pavilions, food stalls and shows. Open roughly Oct to Apr." },
];
export const ATTRACTION_BY_SLUG = Object.fromEntries(ATTRACTIONS.map((a) => [a.slug, a]));

export const GUIDE = {
  bestTime: "November to March is the most comfortable (roughly 20 to 30°C). Summers are very hot, often above 40°C, but hotels are cheaper.",
  activities: ["Observation decks and city views", "Desert safari and dune driving", "Beach days and marina walks", "Shopping and food markets", "Museums and theme parks"],
  transport: "The Dubai Metro and tram cover the main areas. Taxis and ride-hailing are widely available. A Nol card is used for metro, bus and tram.",
  tips: ["Dress modestly in public places and religious sites.", "Carry water and plan outdoor visits for morning or evening.", "Check visa requirements for Bangladeshi passport holders well before travel.", "Confirm prices and opening hours before booking; figures here are demo estimates."],
};
