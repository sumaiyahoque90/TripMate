// Travel Packages Data
const packagesData = [
  {
    id: "pkg-dubai-explorer-5d",
    name: "Dubai Explorer – 5 Days / 4 Nights",
    destination: "Dubai, UAE",
    destinationId: "dubai",
    departure: "Dhaka, Bangladesh (DAC)",
    arrivalAirports: ["DXB", "DWC"],
    duration: "5 Days / 4 Nights",
    durationDays: 5,
    pricePerPerson: 85000,
    originalPrice: 98000,
    currency: "BDT",
    currencySymbol: "৳",
    badge: "Featured International Explorer",
    rating: 4.9,
    reviewsCount: 184,
    imageUrl: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80",
    description: "Embark on an unforgettable international journey from Dhaka to Dubai. Includes estimated return airfare, four nights luxury accommodation, Burj Khalifa observation deck entry, thrilling 4x4 desert safari, city tour, and private airport transfers.",
    includedServices: [
      "Estimated return airfare support from Dhaka (DAC) to Dubai (DXB/DWC)",
      "Four nights 4-Star luxury hotel accommodation in Downtown Dubai",
      "Private round-trip airport pickup and drop-off (DXB/DWC)",
      "Comprehensive Dubai city tour (Dubai Frame, Marina, Jumeirah Beach)",
      "Burj Khalifa 'At The Top' 124th & 125th floor observation deck entry",
      "Premium Desert Safari with 4x4 dune bashing, camel ride & BBQ dinner",
      "Daily international buffet breakfast",
      "Tourist visa assistance & 24/7 travel concierge"
    ],
    excludedServices: [
      "Personal shopping and souvenir expenses",
      "Optional premium adventure activities (e.g. Skydive, Helicopter tour)",
      "UAE Tourism Dirham hotel fee (approx. 15 AED / night paid at hotel checkout)",
      "Travel insurance (available upon request)"
    ],
    itinerary: [
      {
        day: 1,
        title: "Departure from Dhaka & Arrival in Dubai",
        activities: [
          "Departure from Hazrat Shahjalal International Airport (DAC) on your scheduled flight.",
          "Touchdown at Dubai International Airport (DXB) or Al Maktoum Airport (DWC).",
          "Meet & greet by your dedicated TripMate driver at the arrival terminal.",
          "Private chauffeur transfer to your 4-star hotel in Downtown Dubai.",
          "Smooth check-in, unpack, and evening at leisure to explore nearby promenade."
        ]
      },
      {
        day: 2,
        title: "Dubai City Tour, Burj Khalifa & The Dubai Mall",
        activities: [
          "Gourmet buffet breakfast at the hotel.",
          "Morning half-day guided city sightseeing covering Dubai Frame, Zabeel Palace, and Jumeirah Mosque.",
          "Afternoon visit to The Dubai Mall — indulge in shopping and viewing the giant aquarium.",
          "Sunset ascent to Burj Khalifa 'At The Top' observation deck for panoramic skyline views.",
          "Evening viewing of the illuminated musical Dubai Fountain choreography."
        ]
      },
      {
        day: 3,
        title: "Desert Safari, Dune Bashing & Arabian BBQ Camp",
        activities: [
          "Relaxed morning at hotel; lounge by the rooftop pool.",
          "2:30 PM: 4x4 Land Cruiser pickup for the Arabian Desert Safari.",
          "Exciting 45-minute dune bashing experience across the Lahbab red dunes.",
          "Sunset photo stop atop the crest of a desert ridge, followed by sandboarding.",
          "Arrive at the Bedouin desert camp: camel riding, henna tattoos, and Arabic coffee.",
          "Lavish barbecue buffet dinner accompanied by live Tanoura folk dance and fire shows.",
          "9:00 PM: Return transfer back to your hotel."
        ]
      },
      {
        day: 4,
        title: "Dubai Marina, Palm Jumeirah & Cultural Souks",
        activities: [
          "Breakfast at the hotel.",
          "Scenic ride across the trunk of Palm Jumeirah with views of Atlantis.",
          "Stroll along the luxury yacht harbor at Dubai Marina Walk.",
          "Afternoon shopping visit to the traditional Deira Gold & Spice Souks across Dubai Creek via historic wooden Abra boat.",
          "Optional romantic Dhow Dinner Cruise along Dubai Marina canal."
        ]
      },
      {
        day: 5,
        title: "Hotel Checkout & Return Journey to Dhaka",
        activities: [
          "Final lavish breakfast at the hotel and check out.",
          "Last-minute shopping or photography in Downtown Dubai.",
          "Private airport transfer to DXB or DWC airport terminal.",
          "Board return flight back to Hazrat Shahjalal International Airport (DAC), Dhaka with memories to last a lifetime."
        ]
      }
    ],
    isDemoEstimate: true
  },
  {
    id: "pkg-dubai-luxury-6d",
    name: "Dubai Luxury & Palm Splendor – 6 Days / 5 Nights",
    destination: "Dubai, UAE",
    destinationId: "dubai",
    departure: "Dhaka, Bangladesh (DAC)",
    arrivalAirports: ["DXB"],
    duration: "6 Days / 5 Nights",
    durationDays: 6,
    pricePerPerson: 135000,
    originalPrice: 155000,
    currency: "BDT",
    currencySymbol: "৳",
    badge: "Ultra Luxury",
    rating: 4.9,
    reviewsCount: 98,
    imageUrl: "https://images.unsplash.com/photo-1580674684081-7617fbf3d745?auto=format&fit=crop&w=1200&q=80",
    description: "Experience royal Arabian hospitality with 5-star beachfront resort stays on Palm Jumeirah, VIP Burj Khalifa Sky Lounge tickets, and private desert safari dinner.",
    includedServices: [
      "Estimated return flights on Emirates or partner carriers",
      "5 Nights in 5-Star Luxury Beach Resort on Palm Jumeirah",
      "Private VIP Mercedes airport and city transfers",
      "Burj Khalifa SKY Level 148 VIP access with private lounge",
      "Private VIP 4x4 desert safari with personal camp gazebo",
      "Aquaventure Waterpark all-day VIP access passes",
      "Daily gourmet buffet breakfast and 2 set dinner vouchers"
    ],
    excludedServices: [
      "Personal luxury boutique purchases",
      "Helicopter city tour (optional add-on)"
    ],
    itinerary: [
      { day: 1, title: "VIP Arrival in Dubai & Palm Jumeirah Check-in", activities: ["Chauffeur pickup at DXB", "Check in at Palm Jumeirah 5-star resort"] },
      { day: 2, title: "Burj Khalifa SKY Level 148 & Dubai Mall", activities: ["VIP Lounge at Burj Khalifa", "Fine dining lunch"] },
      { day: 3, title: "Aquaventure Waterpark & Private Beach", activities: ["Waterpark thrills and private beach cabana relaxation"] },
      { day: 4, title: "Private Desert Safari & Gourmet Starlight Dinner", activities: ["Private Land Cruiser dune tour and private dining gazebo"] },
      { day: 5, title: "Dubai Marina Yacht Cruise & Shopping", activities: ["Private 2-hour luxury yacht cruise along Dubai Marina"] },
      { day: 6, title: "Departure to Dhaka", activities: ["Hotel checkout and VIP airport transfer back to DAC"] }
    ],
    isDemoEstimate: true
  },
  {
    id: "pkg-dubai-budget-4d",
    name: "Dubai Smart City Saver – 4 Days / 3 Nights",
    destination: "Dubai, UAE",
    destinationId: "dubai",
    departure: "Dhaka, Bangladesh (DAC)",
    arrivalAirports: ["DXB", "DWC"],
    duration: "4 Days / 3 Nights",
    durationDays: 4,
    pricePerPerson: 62000,
    originalPrice: 72000,
    currency: "BDT",
    currencySymbol: "৳",
    badge: "Budget Friendly",
    rating: 4.7,
    reviewsCount: 145,
    imageUrl: "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80",
    description: "An affordable getaway for budget-conscious Bangladeshi travelers. Comfortable 3-star hotel near metro, airport transfers, city tour, and desert safari included.",
    includedServices: [
      "Estimated return airfare support to DXB or DWC",
      "3 Nights in 3-Star hotel near metro station",
      "Round-trip shared airport transfers",
      "Standard desert safari with BBQ dinner and camel ride",
      "Half-day Dubai city tour",
      "Daily breakfast"
    ],
    excludedServices: [
      "Burj Khalifa entry tickets (can be added on request)",
      "Personal food & drinks outside breakfast & desert dinner"
    ],
    itinerary: [
      { day: 1, title: "Arrival in Dubai & Hotel Check-in", activities: ["Airport transfer and check-in to city hotel"] },
      { day: 2, title: "City Tour & Dubai Mall Fountain", activities: ["Guided city tour and evening fountain show"] },
      { day: 3, title: "Desert Safari & BBQ Evening", activities: ["4x4 Dune bashing, dinner and shows"] },
      { day: 4, title: "Souk Shopping & Return Flight", activities: ["Deira Spice & Gold Souks, transfer to airport"] }
    ],
    isDemoEstimate: true
  }
];

module.exports = packagesData;
