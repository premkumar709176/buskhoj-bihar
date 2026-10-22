
export const cities = [
  "Patna",
  "Muzaffarpur",
  "Gaya",
  "Darbhanga",
  "Bhagalpur",
  "Purnia",
  "Bihar Sharif",
  "Ara",
  "Begusarai",
  "Katihar",
  "Munger",
  "Chhapra",
  "Samastipur",
  "Hajipur",
  "Motihari",
  "Bettiah",
  "Saharsa",
  "Madhubani",
  "Sitamarhi",
  "Sasaram",
  "Dehri",
  "Buxar",
  "Jehanabad",
  "Nawada",
  "Jamui",
  "Lakhisarai",
  "Sheikhpura",
  "Araria",
  "Kishanganj",
  "Madhepura",
  "Supaul",
  "Khagaria",
  "Banka",
  "Aurangabad",
  "Bhabua",
  "Siwan",
  "Gopalganj",
  "Sheohar",
];

export const dailyDepartures = [
  "06:00 AM",
  "10:00 AM",
  "02:00 PM",
  "06:00 PM",
];

export type Bus = {
  number: string;
  from: string;
  to: string;
  name: string;
  stops: string[];
  departures: string[];
  demo: boolean;
};

const routeList: Array<{
  from: string;
  to: string;
  stops: string[];
}> = [
  {
    from: "Patna",
    to: "Muzaffarpur",
    stops: ["Patna", "Hajipur", "Muzaffarpur"],
  },
  {
    from: "Patna",
    to: "Gaya",
    stops: ["Patna", "Jehanabad", "Gaya"],
  },
  {
    from: "Patna",
    to: "Darbhanga",
    stops: ["Patna", "Muzaffarpur", "Darbhanga"],
  },
  {
    from: "Patna",
    to: "Bhagalpur",
    stops: ["Patna", "Bihar Sharif", "Munger", "Bhagalpur"],
  },
  {
    from: "Patna",
    to: "Purnia",
    stops: ["Patna", "Begusarai", "Katihar", "Purnia"],
  },
  {
    from: "Patna",
    to: "Ara",
    stops: ["Patna", "Ara"],
  },
  {
    from: "Patna",
    to: "Chhapra",
    stops: ["Patna", "Hajipur", "Chhapra"],
  },
  {
    from: "Patna",
    to: "Begusarai",
    stops: ["Patna", "Mokama", "Begusarai"],
  },
  {
    from: "Patna",
    to: "Hajipur",
    stops: ["Patna", "Hajipur"],
  },
  {
    from: "Patna",
    to: "Samastipur",
    stops: ["Patna", "Hajipur", "Samastipur"],
  },
  {
    from: "Patna",
    to: "Motihari",
    stops: ["Patna", "Muzaffarpur", "Motihari"],
  },
  {
    from: "Patna",
    to: "Bettiah",
    stops: ["Patna", "Muzaffarpur", "Bettiah"],
  },
  {
    from: "Patna",
    to: "Saharsa",
    stops: ["Patna", "Begusarai", "Saharsa"],
  },
  {
    from: "Patna",
    to: "Madhubani",
    stops: ["Patna", "Darbhanga", "Madhubani"],
  },
  {
    from: "Patna",
    to: "Sitamarhi",
    stops: ["Patna", "Muzaffarpur", "Sitamarhi"],
  },
  {
    from: "Patna",
    to: "Sasaram",
    stops: ["Patna", "Ara", "Sasaram"],
  },
  {
    from: "Patna",
    to: "Buxar",
    stops: ["Patna", "Ara", "Buxar"],
  },
  {
    from: "Patna",
    to: "Jehanabad",
    stops: ["Patna", "Jehanabad"],
  },
  {
    from: "Patna",
    to: "Nawada",
    stops: ["Patna", "Bihar Sharif", "Nawada"],
  },
  {
    from: "Patna",
    to: "Jamui",
    stops: ["Patna", "Lakhisarai", "Jamui"],
  },
  {
    from: "Patna",
    to: "Katihar",
    stops: ["Patna", "Begusarai", "Katihar"],
  },
  {
    from: "Patna",
    to: "Munger",
    stops: ["Patna", "Munger"],
  },
  {
    from: "Patna",
    to: "Madhepura",
    stops: ["Patna", "Begusarai", "Madhepura"],
  },
  {
    from: "Patna",
    to: "Supaul",
    stops: ["Patna", "Darbhanga", "Supaul"],
  },
  {
    from: "Patna",
    to: "Khagaria",
    stops: ["Patna", "Begusarai", "Khagaria"],
  },
  {
    from: "Muzaffarpur",
    to: "Darbhanga",
    stops: ["Muzaffarpur", "Darbhanga"],
  },
  {
    from: "Muzaffarpur",
    to: "Sitamarhi",
    stops: ["Muzaffarpur", "Sitamarhi"],
  },
  {
    from: "Muzaffarpur",
    to: "Motihari",
    stops: ["Muzaffarpur", "Motihari"],
  },
  {
    from: "Muzaffarpur",
    to: "Sheohar",
    stops: ["Muzaffarpur", "Sheohar"],
  },
  {
    from: "Gaya",
    to: "Aurangabad",
    stops: ["Gaya", "Aurangabad"],
  },
  {
    from: "Gaya",
    to: "Nawada",
    stops: ["Gaya", "Nawada"],
  },
  {
    from: "Darbhanga",
    to: "Madhubani",
    stops: ["Darbhanga", "Madhubani"],
  },
  {
    from: "Bhagalpur",
    to: "Banka",
    stops: ["Bhagalpur", "Banka"],
  },
  {
    from: "Purnia",
    to: "Araria",
    stops: ["Purnia", "Araria"],
  },
  {
    from: "Purnia",
    to: "Kishanganj",
    stops: ["Purnia", "Kishanganj"],
  },
  {
    from: "Siwan",
    to: "Gopalganj",
    stops: ["Siwan", "Gopalganj"],
  },
  {
    from: "Sasaram",
    to: "Bhabua",
    stops: ["Sasaram", "Bhabua"],
  },
];

const buses: Bus[] = routeList.map((route, index) => ({
  number: `BKH${String(101 + index).padStart(3, "0")}`,
  from: route.from,
  to: route.to,
  name: `${route.from} to ${route.to} Sample Bus`,
  stops: route.stops,
  departures: dailyDepartures,
  demo: true,
}));

export { buses };

export function findBus(busNumber: string): Bus | undefined {
  return buses.find(
    (bus) => bus.number.toLowerCase() === busNumber.trim().toLowerCase()
  );
}

export function findBusesByCities(from: string, to: string): Bus[] {
  if (!from || !to || from === to) {
    return [];
  }

  // Return a route already listed in the sample data.
  const existingRoutes = buses.filter(
    (bus) => bus.from === from && bus.to === to
  );

  if (existingRoutes.length > 0) {
    return existingRoutes;
  }

  // Generate an illustrative route for other city combinations.
  const fromIndex = cities.indexOf(from);
  const toIndex = cities.indexOf(to);

  if (fromIndex === -1 || toIndex === -1) {
    return [];
  }

  const routeId =
    Math.min(fromIndex, toIndex) * cities.length +
    Math.max(fromIndex, toIndex);

  const generatedRoute: Bus = {
    number: `BKH${String(900 + routeId).padStart(3, "0")}`,
    from,
    to,
    name: `${from} to ${to} Sample Route`,
    stops: [from, to],
    departures: dailyDepartures,
    demo: true,
  };

  return [generatedRoute];
}
