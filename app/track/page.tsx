
"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import RouteMap from "./RouteMap";
import { buses, cities, findBusesByCities } from "../busData";

function TrackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [busNumber, setBusNumber] = useState("");
  const [selectedBusNumber, setSelectedBusNumber] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [searchMessage, setSearchMessage] = useState("");

  useEffect(() => {
    setFrom(searchParams.get("from") || "");
    setTo(searchParams.get("to") || "");

    const bus = searchParams.get("bus") || "";
    setBusNumber(bus);
    setSelectedBusNumber(bus);
    setSelectedTime(searchParams.get("time") || "");
  }, [searchParams]);

  const busByNumber = buses.find(
    (bus) =>
      bus.number.toLowerCase() === selectedBusNumber.toLowerCase()
  );

  const cityMatches =
    from && to && from !== to ? findBusesByCities(from, to) : [];

  const displayedBus =
    busByNumber ||
    cityMatches.find((bus) => bus.number === selectedBusNumber) ||
    (cityMatches.length === 1 ? cityMatches[0] : undefined);

  function searchByNumber() {
    const match = buses.find(
      (bus) =>
        bus.number.toLowerCase() === busNumber.trim().toLowerCase()
    );

    if (!match) {
      setSearchMessage("Bus not found. Try a number such as BKH101.");
      return;
    }

    const time = match.departures?.[0] || "";

    setSearchMessage("");
    setFrom(match.from);
    setTo(match.to);
    setSelectedBusNumber(match.number);
    setSelectedTime(time);

    router.replace(
      `/track?from=${encodeURIComponent(match.from)}&to=${encodeURIComponent(
        match.to
      )}&bus=${encodeURIComponent(match.number)}&time=${encodeURIComponent(time)}`
    );
  }

  function searchByCities() {
    if (!from || !to) {
      setSearchMessage("Please select both cities.");
      return;
    }

    if (from === to) {
      setSearchMessage("Choose two different cities.");
      return;
    }

    const matches = findBusesByCities(from, to);

    if (!matches.length) {
      setSearchMessage("No sample route found for these cities.");
      return;
    }

    setSearchMessage("");
    setSelectedBusNumber(matches[0].number);
    setSelectedTime(matches[0].departures?.[0] || "");
  }

  function openSelectedRoute() {
    if (!displayedBus) {
      setSearchMessage("Please select a route first.");
      return;
    }

    if (!selectedTime) {
      setSearchMessage("Please select a departure time.");
      return;
    }

    router.push(
      `/track?from=${encodeURIComponent(displayedBus.from)}&to=${encodeURIComponent(
        displayedBus.to
      )}&bus=${encodeURIComponent(displayedBus.number)}&time=${encodeURIComponent(
        selectedTime
      )}`
    );
  }

  const departures = displayedBus?.departures || [];

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8">
      <div className="mx-auto max-w-5xl space-y-6">
        <header>
          <button
            onClick={() => router.push("/")}
            className="mb-4 text-sm font-semibold text-blue-700 hover:underline"
          >
            ← Back to home
          </button>

          <h1 className="text-3xl font-black text-slate-900">
            Track Your Bus
          </h1>

          <p className="mt-2 text-slate-600">
            Search for a bus and see its route and estimated stop timings.
          </p>
        </header>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-lg font-bold">Search by bus number</h2>

          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              value={busNumber}
              onChange={(event) => setBusNumber(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") searchByNumber();
              }}
              placeholder="Example: BKH101"
              className="min-w-0 flex-1 rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
            />

            <button
              onClick={searchByNumber}
              className="rounded-xl bg-blue-700 px-5 py-3 font-semibold text-white hover:bg-blue-800"
            >
              Find Bus
            </button>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-lg font-bold">Search by cities</h2>

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="text-sm font-medium text-slate-700">
              Starting city
              <select
                value={from}
                onChange={(event) => {
                  setFrom(event.target.value);
                  setSelectedBusNumber("");
                  setSelectedTime("");
                  setSearchMessage("");
                }}
                className="mt-1 block w-full rounded-xl border border-slate-300 bg-white px-3 py-3"
              >
                <option value="">Select starting city</option>
                {cities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </label>

            <label className="text-sm font-medium text-slate-700">
              Destination city
              <select
                value={to}
                onChange={(event) => {
                  setTo(event.target.value);
                  setSelectedBusNumber("");
                  setSelectedTime("");
                  setSearchMessage("");
                }}
                className="mt-1 block w-full rounded-xl border border-slate-300 bg-white px-3 py-3"
              >
                <option value="">Select destination city</option>
                {cities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <button
            onClick={searchByCities}
            className="mt-4 rounded-xl bg-blue-700 px-5 py-3 font-semibold text-white hover:bg-blue-800"
          >
            Find Routes
          </button>

          {from && to && from !== to && cityMatches.length > 0 && (
            <div className="mt-5 space-y-3">
              <h3 className="font-bold">Available sample routes</h3>

              {cityMatches.map((bus) => (
                <label
                  key={bus.number}
                  className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 ${
                    selectedBusNumber === bus.number
                      ? "border-blue-600 bg-blue-50"
                      : "border-slate-200"
                  }`}
                >
                  <input
                    type="radio"
                    name="selectedBus"
                    checked={selectedBusNumber === bus.number}
                    onChange={() => {
                      setSelectedBusNumber(bus.number);
                      setSelectedTime(bus.departures?.[0] || "");
                      setSearchMessage("");
                    }}
                    className="mt-1"
                  />

                  <span className="flex-1">
                    <span className="block font-bold">{bus.number}</span>
                    <span className="block text-sm text-slate-600">
                      {bus.from} → {bus.to}
                    </span>
                    <span className="mt-1 block text-xs text-amber-700">
                      Sample route — verify actual bus service.
                    </span>
                  </span>
                </label>
              ))}
            </div>
          )}
        </section>

        {displayedBus && (
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-bold">Select departure time</h2>

            <p className="mb-4 mt-1 text-sm text-slate-600">
              {displayedBus.number}: {displayedBus.from} → {displayedBus.to}
            </p>

            {departures.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {departures.map((time: string) => (
                  <button
                    key={time}
                    onClick={() => setSelectedTime(time)}
                    className={`rounded-xl border px-4 py-2 font-semibold ${
                      selectedTime === time
                        ? "border-blue-700 bg-blue-700 text-white"
                        : "border-slate-300 bg-white text-slate-700"
                    }`}
                  >
                    {time}
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-sm text-amber-700">
                No departure times are available for this route.
              </p>
            )}

            <button
              onClick={openSelectedRoute}
              disabled={!selectedTime}
              className="mt-5 rounded-xl bg-emerald-600 px-5 py-3 font-bold text-white hover:bg-emerald-700 disabled:opacity-50"
            >
              View Route & Stop Timings
            </button>
          </section>
        )}

        {searchMessage && (
          <p className="rounded-xl bg-amber-50 p-4 text-sm text-amber-900">
            {searchMessage}
          </p>
        )}

        {displayedBus && selectedTime && (
          <RouteMap
            from={displayedBus.from}
            to={displayedBus.to}
            stops={displayedBus.stops}
            departureTime={selectedTime}
          />
        )}

        <p className="text-xs leading-5 text-slate-500">
          This prototype uses illustrative routes and schedules. Arrival times
          are estimates, not verified timetables or live GPS positions.
        </p>
      </div>
    </main>
  );
}

export default function TrackPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-slate-50 px-4 py-12">
          <div className="mx-auto max-w-5xl rounded-2xl bg-white p-6 shadow-sm">
            Loading bus tracking…
          </div>
        </main>
      }
    >
      <TrackContent />
    </Suspense>
  );
}
