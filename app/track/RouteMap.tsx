
"use client";

import { useEffect, useRef, useState } from "react";
import "leaflet/dist/leaflet.css";

type RouteMapProps = {
  from: string;
  to: string;
  stops: string[];
  departureTime?: string;
};

type StopPoint = {
  name: string;
  coords: [number, number];
  approximate: boolean;
};

type RouteResponse = {
  code: string;
  message?: string;
  routes?: {
    geometry?: { coordinates: [number, number][] };
    distance?: number;
    duration?: number;
    legs?: { distance: number; duration: number }[];
  }[];
};

type StopTiming = {
  name: string;
  arrival: Date;
  distanceKm: number;
  approximate: boolean;
  isCurrent: boolean;
};

const coordinates: Record<string, [number, number]> = {
  Patna: [25.5941, 85.1376],
  "Patna Junction": [25.6022, 85.1377],
  "Gandhi Maidan": [25.6208, 85.1419],
  Danapur: [25.6329, 85.0472],
  Hajipur: [25.6858, 85.2146],
  Sonpur: [25.7009, 85.1802],
  Muzaffarpur: [26.1209, 85.3647],
  Darbhanga: [26.1542, 85.8918],
  "Darbhanga Junction": [26.166, 85.9],
  Samastipur: [25.8629, 85.781],
  Sitamarhi: [26.5956, 85.4906],
  Sheohar: [26.5147, 85.2937],
  Motihari: [26.647, 84.9089],
  Bettiah: [26.8025, 84.5198],
  Gopalganj: [26.4673, 84.44],
  Siwan: [26.2196, 84.3567],
  Chhapra: [25.7848, 84.7274],
  Saran: [25.9167, 84.75],
  Buxar: [25.5647, 83.9777],
  Ara: [25.556, 84.6603],
  Arrah: [25.556, 84.6603],
  Bhabua: [25.04, 83.61],
  Sasaram: [24.949, 84.0314],
  Dehri: [24.91, 84.18],
  Aurangabad: [24.752, 84.3742],
  Gaya: [24.7914, 85.0002],
  "Gaya Junction": [24.796, 84.999],
  Jehanabad: [25.2137, 84.9871],
  Nawada: [24.8867, 85.5435],
  Biharsharif: [25.198, 85.523],
  "Bihar Sharif": [25.198, 85.523],
  Nalanda: [25.1357, 85.444],
  Rajgir: [25.028, 85.42],
  Mokama: [25.396, 85.921],
  Begusarai: [25.4182, 86.1271],
  Khagaria: [25.5022, 86.4671],
  Munger: [25.374, 86.4735],
  Jamalpur: [25.312, 86.49],
  Lakhisarai: [25.1677, 86.0989],
  Sheikhpura: [25.139, 85.841],
  Jamui: [24.926, 86.225],
  Bhagalpur: [25.2425, 86.9842],
  Banka: [24.88, 86.92],
  Purnia: [25.7771, 87.4753],
  Purnea: [25.7771, 87.4753],
  Katihar: [25.538, 87.57],
  Kishanganj: [26.102, 87.955],
  Araria: [26.149, 87.513],
  Supaul: [26.126, 86.605],
  Madhepura: [25.921, 86.792],
  Saharsa: [25.8835, 86.6006],
  Forbesganj: [26.3, 87.26],
};

function normalize(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

function findCoordinates(name: string): [number, number] | undefined {
  const match = Object.entries(coordinates).find(
    ([key]) => normalize(key) === normalize(name)
  );

  if (match) return match[1];

  const partial = Object.entries(coordinates).find(
    ([key]) =>
      normalize(name).includes(normalize(key)) &&
      normalize(key).length >= 4
  );

  return partial?.[1];
}

function buildStopPoints(names: string[]): StopPoint[] {
  const known = names.map((name) => ({
    name,
    coords: findCoordinates(name),
  }));

  const knownIndexes = known
    .map((point, index) => (point.coords ? index : -1))
    .filter((index) => index >= 0);

  if (knownIndexes.length < 2) {
    throw new Error(
      "Coordinates for the start and destination are missing. Add them to the coordinates list."
    );
  }

  return known.map((point, index) => {
    if (point.coords) {
      return {
        name: point.name,
        coords: point.coords,
        approximate: false,
      };
    }

    let leftIndex = -1;
    let rightIndex = -1;

    for (const knownIndex of knownIndexes) {
      if (knownIndex < index) leftIndex = knownIndex;

      if (knownIndex > index) {
        rightIndex = knownIndex;
        break;
      }
    }

    const firstIndex = knownIndexes[0];
    const lastIndex = knownIndexes[knownIndexes.length - 1];
    const leftSafe = leftIndex >= 0 ? leftIndex : firstIndex;
    const rightSafe = rightIndex >= 0 ? rightIndex : lastIndex;

    const left = known[leftSafe].coords!;
    const right = known[rightSafe].coords!;

    const fraction =
      leftSafe === rightSafe
        ? 0
        : (index - leftSafe) / (rightSafe - leftSafe);

    return {
      name: point.name,
      coords: [
        left[0] + (right[0] - left[0]) * fraction,
        left[1] + (right[1] - left[1]) * fraction,
      ] as [number, number],
      approximate: true,
    };
  });
}

function parseDepartureTime(time?: string): Date {
  const now = new Date();
  const departure = new Date(now);
  departure.setSeconds(0, 0);

  const match = time?.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);

  if (match) {
    let hour = Number(match[1]);
    const minute = Number(match[2]);
    const period = match[3].toUpperCase();

    if (period === "PM" && hour !== 12) hour += 12;
    if (period === "AM" && hour === 12) hour = 0;

    departure.setHours(hour, minute, 0, 0);
  }

  if (departure.getTime() < now.getTime()) {
    departure.setDate(departure.getDate() + 1);
  }

  return departure;
}

function formatTime(date: Date) {
  return date.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

function formatDate(date: Date) {
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatDuration(minutes: number) {
  const totalMinutes = Math.max(0, Math.round(minutes));
  const hours = Math.floor(totalMinutes / 60);
  const remainingMinutes = totalMinutes % 60;

  if (hours === 0) return `${remainingMinutes} min`;
  if (remainingMinutes === 0) return `${hours} hr`;

  return `${hours} hr ${remainingMinutes} min`;
}

// Finds a point along the road route using its total travelled distance.
function pointAlongRoute(
  route: [number, number][],
  progress: number
): [number, number] {
  if (route.length === 0) return [25.5941, 85.1376];
  if (route.length === 1) return route[0];

  const lengths: number[] = [];
  let totalLength = 0;

  for (let i = 1; i < route.length; i++) {
    const [lat1, lng1] = route[i - 1];
    const [lat2, lng2] = route[i];

    const length = Math.hypot(
      (lat2 - lat1) * 111,
      (lng2 - lng1) * 111 * Math.cos((lat1 * Math.PI) / 180)
    );

    lengths.push(length);
    totalLength += length;
  }

  if (totalLength === 0) return route[0];

  let remaining = Math.max(0, Math.min(1, progress)) * totalLength;

  for (let i = 0; i < lengths.length; i++) {
    if (remaining <= lengths[i]) {
      const fraction = lengths[i] === 0 ? 0 : remaining / lengths[i];
      const [lat1, lng1] = route[i];
      const [lat2, lng2] = route[i + 1];

      return [
        lat1 + (lat2 - lat1) * fraction,
        lng1 + (lng2 - lng1) * fraction,
      ];
    }

    remaining -= lengths[i];
  }

  return route[route.length - 1];
}

export default function RouteMap({
  from,
  to,
  stops,
  departureTime,
}: RouteMapProps) {
  const mapElement = useRef<HTMLDivElement>(null);
  const busMarker = useRef<any>(null);
  const routeCoordinates = useRef<[number, number][]>([]);
  const trackingInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [stopTimings, setStopTimings] = useState<StopTiming[]>([]);
  const [distanceKm, setDistanceKm] = useState(0);
  const [durationMinutes, setDurationMinutes] = useState(0);
  const [journeyMinutes, setJourneyMinutes] = useState(0);

  const [tracking, setTracking] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let cancelled = false;
    let map: any;
    let observer: ResizeObserver | undefined;

    async function setupMap() {
      setLoading(true);
      setError("");
      setStopTimings([]);
      setDistanceKm(0);
      setDurationMinutes(0);
      setJourneyMinutes(0);
      setTracking(false);
      setProgress(0);
      routeCoordinates.current = [];
      busMarker.current = null;

      if (trackingInterval.current) {
        clearInterval(trackingInterval.current);
        trackingInterval.current = null;
      }

      try {
        const L = (await import("leaflet")).default;

        if (cancelled || !mapElement.current) return;

        const names = stops.length > 0 ? [...stops] : [from, to];

        if (names.length === 1 && from !== to) names.push(to);
        if (names[0] !== from) names.unshift(from);
        if (names[names.length - 1] !== to) names.push(to);

        const points = buildStopPoints(names);

        map = L.map(mapElement.current, {
          zoomControl: true,
          scrollWheelZoom: true,
        });

        L.tileLayer(
          "https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}",
          {
            maxZoom: 19,
            attribution:
              "Tiles &copy; Esri — Sources: Esri, HERE, Garmin, OpenStreetMap contributors",
          }
        ).addTo(map);

        const coordinateString = points
          .map((point) => `${point.coords[1]},${point.coords[0]}`)
          .join(";");

        const url =
          "https://router.project-osrm.org/route/v1/driving/" +
          `${coordinateString}?overview=full&geometries=geojson&steps=false`;

        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(
            "The road-routing service is unavailable. Please refresh and try again."
          );
        }

        const data: RouteResponse = await response.json();

        if (
          data.code !== "Ok" ||
          !data.routes?.[0]?.geometry?.coordinates
        ) {
          throw new Error(data.message || "No road route was found.");
        }

        if (cancelled) return;

        const route = data.routes[0];

        const roadCoordinates: [number, number][] =
          route.geometry!.coordinates.map(([longitude, latitude]) => [
            latitude,
            longitude,
          ]);

        routeCoordinates.current = roadCoordinates;

        const line = L.polyline(roadCoordinates, {
          color: "#2563eb",
          weight: 5,
          opacity: 0.9,
        }).addTo(map);

        // Create a separate marker for the simulated bus.
        const busIcon = L.divIcon({
          className: "",
          html: `<div style="
            width:42px;height:42px;border-radius:50%;
            display:flex;align-items:center;justify-content:center;
            background:#047857;border:3px solid white;
            box-shadow:0 3px 10px #0005;font-size:23px;
          ">🚌</div>`,
          iconSize: [42, 42],
          iconAnchor: [21, 21],
        });

        busMarker.current = L.marker(roadCoordinates[0], {
          icon: busIcon,
          zIndexOffset: 1000,
        }).addTo(map);

        const busPopup = document.createElement("div");
        const busTitle = document.createElement("strong");
        busTitle.textContent = "BusKhoj simulated bus";
        busPopup.appendChild(busTitle);

        const busDescription = document.createElement("p");
        busDescription.textContent =
          "This position is simulated, not live GPS.";
        busPopup.appendChild(busDescription);

        busMarker.current.bindPopup(busPopup);

        const departure = parseDepartureTime(departureTime);
        const timings: StopTiming[] = [];

        let elapsedSeconds = 0;
        let elapsedDistance = 0;

        points.forEach((point, index) => {
          if (index > 0) {
            const leg = route.legs?.[index - 1];

            if (leg) {
              elapsedSeconds += leg.duration;
              elapsedDistance += leg.distance;
            }

            if (index < points.length - 1) {
              elapsedSeconds += 5 * 60;
            }
          }

          timings.push({
            name: point.name,
            arrival: new Date(
              departure.getTime() + elapsedSeconds * 1000
            ),
            distanceKm: elapsedDistance / 1000,
            approximate: point.approximate,
            isCurrent: false,
          });
        });

        const now = new Date();
        let expectedStopIndex = -1;

        timings.forEach((timing, index) => {
          if (timing.arrival.getTime() <= now.getTime()) {
            expectedStopIndex = index;
          }
        });

        setStopTimings(
          timings.map((timing, index) => ({
            ...timing,
            isCurrent:
              index === expectedStopIndex &&
              expectedStopIndex < timings.length - 1,
          }))
        );

        const drivingMinutes = (route.duration || 0) / 60;
        const stopoverMinutes = Math.max(0, points.length - 2) * 5;

        setDistanceKm((route.distance || 0) / 1000);
        setDurationMinutes(drivingMinutes);
        setJourneyMinutes(drivingMinutes + stopoverMinutes);

        points.forEach((point, index) => {
          const icon = L.divIcon({
            className: "",
            html: `<div style="
              width:32px;height:32px;border:3px solid white;
              border-radius:50%;
              background:${point.approximate ? "#d97706" : "#dc2626"};
              box-shadow:0 2px 7px #0005;
              display:flex;align-items:center;justify-content:center;
              color:white;font-weight:800;font-size:12px;
            ">${index + 1}</div>`,
            iconSize: [32, 32],
            iconAnchor: [16, 16],
          });

          const status =
            index === 0
              ? "Starting point"
              : index === points.length - 1
                ? "Destination"
                : "Intermediate stop";

          const popup = document.createElement("div");
          const title = document.createElement("strong");
          title.textContent = point.name;
          popup.appendChild(title);

          const statusText = document.createElement("p");
          statusText.textContent = status;
          popup.appendChild(statusText);

          const arrivalText = document.createElement("p");
          arrivalText.textContent =
            `Estimated arrival: ${formatTime(timings[index].arrival)}`;
          popup.appendChild(arrivalText);

          if (point.approximate) {
            const note = document.createElement("em");
            note.textContent = "Estimated coordinates";
            popup.appendChild(note);
          }

          L.marker(point.coords, { icon })
            .addTo(map)
            .bindPopup(popup);
        });

        map.fitBounds(line.getBounds(), { padding: [45, 45] });

        observer = new ResizeObserver(() => {
          if (!cancelled && map) map.invalidateSize();
        });

        observer.observe(mapElement.current);
        setLoading(false);
      } catch (err) {
        console.error("BusKhoj map error:", err);

        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Unable to load the route."
          );
          setLoading(false);
        }
      }
    }

    setupMap();

    return () => {
      cancelled = true;
      observer?.disconnect();

      if (trackingInterval.current) {
        clearInterval(trackingInterval.current);
        trackingInterval.current = null;
      }

      busMarker.current = null;
      routeCoordinates.current = [];

      if (map) map.remove();
    };
  }, [from, to, stops, departureTime]);

  // Move the bus marker whenever the simulation progress changes.
  useEffect(() => {
    if (!busMarker.current || routeCoordinates.current.length === 0) return;

    const position = pointAlongRoute(routeCoordinates.current, progress);
    busMarker.current.setLatLng(position);
  }, [progress]);

  // Simulated trip: the entire route takes approximately 120 seconds.
  useEffect(() => {
    if (!tracking) {
      if (trackingInterval.current) {
        clearInterval(trackingInterval.current);
        trackingInterval.current = null;
      }
      return;
    }

    trackingInterval.current = setInterval(() => {
      setProgress((current) => {
        const next = Math.min(1, current + 1 / 120);

        if (next >= 1) {
          setTracking(false);
        }

        return next;
      });
    }, 1000);

    return () => {
      if (trackingInterval.current) {
        clearInterval(trackingInterval.current);
        trackingInterval.current = null;
      }
    };
  }, [tracking]);

  const finalStop = stopTimings[stopTimings.length - 1];
  const intermediateStops = stopTimings.slice(1, -1);

  const travelledKm = distanceKm * progress;

  const nextStopIndex = stopTimings.findIndex(
    (stop, index) =>
      index > 0 && stop.distanceKm >= travelledKm
  );

  const currentStop =
    nextStopIndex > 0 ? stopTimings[nextStopIndex - 1] : stopTimings[0];

  const nextStop =
    nextStopIndex >= 0 ? stopTimings[nextStopIndex] : undefined;

  const remainingMinutes = journeyMinutes * (1 - progress);

  const simulatedArrival = new Date(
    Date.now() + remainingMinutes * 60 * 1000
  );

  return (
    <section className="w-full space-y-4">
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Route Details
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              {from} <span aria-hidden="true">→</span> {to}
            </p>
          </div>

          <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-900">
            Estimated route
          </span>
        </div>

        {departureTime && (
          <div className="mt-4 rounded-xl bg-blue-50 p-3 text-sm text-blue-900">
            Selected departure: <strong>{departureTime}</strong>
          </div>
        )}

        {loading && (
          <p className="mt-4 rounded-lg bg-blue-50 p-3 text-sm text-blue-800">
            Calculating road route, distance and estimated timings…
          </p>
        )}

        {error && (
          <p className="mt-4 rounded-lg bg-amber-50 p-3 text-sm text-amber-900">
            {error}
          </p>
        )}

        {!loading && !error && (
          <>
            <div className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
              <div className="rounded-xl bg-blue-50 p-3">
                <p className="text-xs text-blue-700">Road distance</p>
                <p className="mt-1 text-xl font-black text-blue-950">
                  {distanceKm.toFixed(1)} km
                </p>
              </div>

              <div className="rounded-xl bg-slate-100 p-3">
                <p className="text-xs text-slate-600">Driving time</p>
                <p className="mt-1 text-xl font-black text-slate-900">
                  {formatDuration(durationMinutes)}
                </p>
              </div>

              <div className="rounded-xl bg-indigo-50 p-3">
                <p className="text-xs text-indigo-700">Journey estimate</p>
                <p className="mt-1 text-xl font-black text-indigo-950">
                  {formatDuration(journeyMinutes)}
                </p>
              </div>

              <div className="rounded-xl bg-emerald-50 p-3">
                <p className="text-xs text-emerald-700">
                  Intermediate stops
                </p>
                <p className="mt-1 text-xl font-black text-emerald-950">
                  {intermediateStops.length}
                </p>
              </div>
            </div>

            <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-emerald-800">
                    Bus tracking simulation
                  </p>
                  <p className="mt-1 text-lg font-black text-emerald-950">
                    {Math.round(progress * 100)}% of route
                  </p>
                </div>

                <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-emerald-800">
                  Demo only · Not live GPS
                </span>
              </div>

              <div
                className="mt-3 h-2.5 overflow-hidden rounded-full bg-emerald-100"
                role="progressbar"
                aria-label="Simulated journey progress"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={Math.round(progress * 100)}
              >
                <div
                  className="h-full rounded-full bg-emerald-600 transition-all duration-700"
                  style={{ width: `${progress * 100}%` }}
                />
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="rounded-lg bg-white p-3">
                  <p className="text-xs text-slate-500">Estimated current area</p>
                  <p className="mt-1 font-bold text-slate-900">
                    {progress >= 1 ? to : currentStop?.name ?? from}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    Approx. {travelledKm.toFixed(1)} km travelled
                  </p>
                </div>

                <div className="rounded-lg bg-white p-3">
                  <p className="text-xs text-slate-500">Next stop</p>
                  <p className="mt-1 font-bold text-slate-900">
                    {progress >= 1 ? "Journey completed" : nextStop?.name ?? to}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    {progress >= 1
                      ? "Simulation finished"
                      : `Approx. ${formatDuration(
                          journeyMinutes *
                            Math.max(
                              0,
                              (nextStop?.distanceKm ?? distanceKm) /
                                Math.max(distanceKm, 1) -
                                progress
                            ) *
                            120
                        )} in this simulation`}
                  </p>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => {
                    if (progress >= 1) setProgress(0);
                    setTracking(true);
                  }}
                  disabled={tracking}
                  className="rounded-xl bg-emerald-700 px-5 py-2.5 text-sm font-bold text-white hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {progress >= 1 ? "Restart simulation" : "▶ Start tracking"}
                </button>

                <button
                  type="button"
                  onClick={() => setTracking(false)}
                  disabled={!tracking}
                  className="rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Ⅱ Pause
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setTracking(false);
                    setProgress(0);
                  }}
                  className="rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50"
                >
                  Reset
                </button>
              </div>

              <p className="mt-3 text-xs leading-5 text-emerald-900">
                The bus moves along the mapped road for demonstration.
                Its movement and arrival estimates are simulated and do
                not represent a real bus's location or schedule.
              </p>
            </div>

            {finalStop && (
              <div className="mt-4 rounded-xl border border-slate-200 p-4">
                <p className="text-sm text-slate-600">
                  Scheduled estimate at {to}
                </p>
                <p className="mt-1 text-2xl font-black text-slate-900">
                  {formatTime(finalStop.arrival)}
                </p>
                <p className="text-sm text-slate-500">
                  {formatDate(finalStop.arrival)}
                </p>
                <p className="mt-2 text-xs text-slate-500">
                  This is the route timetable estimate, not a live arrival prediction.
                </p>
              </div>
            )}
          </>
        )}

        <div
          ref={mapElement}
          className="relative z-0 mt-4 h-[360px] w-full overflow-hidden rounded-xl bg-slate-100 sm:h-[440px]"
        />

        {!loading && !error && (
          <div className="mt-4">
            <h3 className="font-bold text-slate-900">Route stops</h3>
            <p className="mt-1 text-sm text-slate-500">
              {stopTimings.map((stop) => stop.name).join(" → ")}
            </p>
          </div>
        )}

        <p className="mt-4 text-xs leading-5 text-slate-500">
          Distance and driving duration come from a road-routing service.
          The journey estimate adds five minutes per intermediate stop.
          Stops and schedules are illustrative, not verified bus-service
          information. Traffic, road conditions and actual stops may differ.
          The moving bus is simulated and this page does not receive live GPS positions.
        </p>
      </div>

      
      {!loading && !error && (
        <a
          href={`/book?from=${encodeURIComponent(
            from
          )}&to=${encodeURIComponent(to)}&time=${encodeURIComponent(
            departureTime || "10:00 AM"
          )}`}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-700 px-5 py-3.5 font-bold text-white shadow-sm transition hover:bg-blue-800"
        >
          <span aria-hidden="true">🎟️</span>
          Book Ticket — Demo
        </a>
      )}


      {!loading && !error && (
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
          <h3 className="text-lg font-bold text-slate-900">
            Stop-by-stop timetable
          </h3>
          <p className="mb-4 mt-1 text-sm text-slate-500">
            Estimated arrival times for the selected departure
          </p>

          <ol className="space-y-0">
            {stopTimings.map((stop, index) => (
              <li key={`${index}-${stop.name}`} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <span
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white ${
                      stop.isCurrent ? "bg-emerald-600" : "bg-blue-700"
                    }`}
                  >
                    {index + 1}
                  </span>

                  {index < stopTimings.length - 1 && (
                    <span className="my-1 min-h-8 w-0.5 flex-1 bg-blue-200" />
                  )}
                </div>

                <div className="flex flex-1 flex-wrap items-start justify-between gap-3 pb-5">
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-900">
                      {stop.name}
                    </p>

                    <p className="text-xs text-slate-500">
                      {index === 0
                        ? "Starting point"
                        : index === stopTimings.length - 1
                          ? "Destination"
                          : "Intermediate stop"}
                    </p>

                    {stop.isCurrent && (
                      <p className="mt-1 text-xs font-semibold text-emerald-700">
                        Expected to be near this stop by schedule
                      </p>
                    )}

                    {stop.approximate && (
                      <p className="mt-1 text-xs text-amber-700">
                        Stop coordinates are estimated
                      </p>
                    )}

                    {index > 0 && (
                      <p className="mt-1 text-xs text-slate-500">
                        {stop.distanceKm.toFixed(1)} km from start
                      </p>
                    )}
                  </div>

                  <div className="text-right">
                    <p className="font-bold text-slate-900">
                      {formatTime(stop.arrival)}
                    </p>
                    <p className="text-xs text-slate-500">
                      {formatDate(stop.arrival)}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>
      )}
    </section>
  );
}
