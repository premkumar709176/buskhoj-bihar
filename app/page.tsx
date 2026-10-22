
"use client";

import { useState } from "react";
import { buses, cities, findBusesByCities } from "./busData";

type Bus = (typeof buses)[number];

export default function Home() {
  const [from, setFrom] = useState("Patna");
  const [to, setTo] = useState("Muzaffarpur");
  const [busNumber, setBusNumber] = useState("");
  const [busResult, setBusResult] = useState<Bus | null>(null);
  const [citySearched, setCitySearched] = useState(false);
  const [selectedTimes, setSelectedTimes] = useState<Record<string, string>>({});
  const [message, setMessage] = useState("");

  const matchingBuses = citySearched ? findBusesByCities(from, to) : [];

  function openTrack(bus: Bus, time: string) {
    if (!time) {
      setMessage("Please select a departure time first.");
      return;
    }

    const params = new URLSearchParams({
      from: bus.from,
      to: bus.to,
      bus: bus.number,
      time,
    });

    window.location.href = `/track?${params.toString()}`;
  }

  function searchCities() {
    setMessage("");
    setBusResult(null);

    if (from === to) {
      setCitySearched(false);
      setMessage("Please select two different cities.");
      return;
    }

    setCitySearched(true);
    setSelectedTimes({});
    document.getElementById("search-results")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  function searchBusNumber(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");

    const result = buses.find(
      (bus) => bus.number.toLowerCase() === busNumber.trim().toLowerCase()
    );

    setCitySearched(false);

    if (!result) {
      setBusResult(null);
      setMessage("Bus number not found. Try a number such as BKH101.");
      return;
    }

    setBusResult(result);
    setSelectedTimes({});
    document.getElementById("search-results")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
          <a href="/" className="flex items-center gap-3">
            <span className="rounded-2xl bg-blue-700 p-2 text-2xl">🚌</span>
            <span>
              <strong className="block text-xl font-black">
                BusKhoj <span className="text-blue-700">Bihar</span>
              </strong>
              <span className="text-xs text-slate-500">
                Your journey, made simpler.
              </span>
            </span>
          </a>
          <span className="hidden rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-800 sm:block">
            Explore Bihar by bus
          </span>
        </div>
      </header>

      <section className="bg-gradient-to-br from-blue-950 via-blue-800 to-blue-600 text-white">
        <div className="mx-auto grid max-w-7xl items-center gap-8 px-5 py-14 md:grid-cols-2 md:py-20">
          <div>
            <span className="rounded-full border border-white/25 bg-white/10 px-3 py-2 text-xs font-bold">
              BIHAR BUS ROUTES, IN ONE PLACE
            </span>
            <h1 className="mt-6 text-4xl font-black leading-tight sm:text-5xl">
              Find your bus.
              <br />
              Know your route.
            </h1>
            <p className="mt-5 max-w-lg leading-7 text-blue-100">
              Search by city or bus number, choose your departure time, and
              explore the listed stops across Bihar.
            </p>
          </div>
          <div className="rounded-3xl border border-white/20 bg-white/10 p-8 text-center">
            <div className="bus-motion text-8xl">🚌</div>
            <p className="mt-4 text-xl font-bold">
              Your next journey starts here.
            </p>
            <p className="mt-2 text-sm text-blue-100">
              Route information in one place
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto -mt-7 max-w-6xl px-5">
        <div className="rounded-3xl bg-white p-5 shadow-xl sm:p-8">
          <h2 className="text-xl font-black">Search by cities</h2>
          <p className="mt-1 text-sm text-slate-500">
            Choose your starting point and destination.
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-[1fr_auto_1fr_auto] md:items-end">
            <label className="text-sm font-bold">
              From
              <select
                value={from}
                onChange={(event) => setFrom(event.target.value)}
                className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 font-normal"
              >
                {cities.map((city) => (
                  <option key={city}>{city}</option>
                ))}
              </select>
            </label>

            <button
              type="button"
              onClick={() => {
                setFrom(to);
                setTo(from);
                setCitySearched(false);
                setMessage("");
              }}
              aria-label="Swap cities"
              className="rounded-xl border border-slate-200 px-4 py-3 text-xl hover:bg-slate-50"
            >
              ⇄
            </button>

            <label className="text-sm font-bold">
              To
              <select
                value={to}
                onChange={(event) => setTo(event.target.value)}
                className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 font-normal"
              >
                {cities.map((city) => (
                  <option key={city}>{city}</option>
                ))}
              </select>
            </label>

            <button
              type="button"
              onClick={searchCities}
              className="rounded-xl bg-blue-700 px-6 py-3.5 font-bold text-white hover:bg-blue-800"
            >
              Search routes →
            </button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 pt-8">
        <div className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-8">
          <h2 className="text-xl font-black">Search by bus number</h2>
          <p className="mt-1 text-sm text-slate-500">
            Enter a BusKhoj ID, such as BKH101.
          </p>
          <form
            onSubmit={searchBusNumber}
            className="mt-5 flex flex-col gap-3 sm:flex-row"
          >
            <input
              value={busNumber}
              onChange={(event) => setBusNumber(event.target.value)}
              placeholder="Enter bus number (BKH101–BKH138)"
              className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 outline-none focus:border-blue-500"
            />
            <button
              type="submit"
              className="rounded-xl bg-blue-700 px-6 py-3.5 font-bold text-white hover:bg-blue-800"
            >
              Find bus →
            </button>
          </form>
        </div>
      </section>

      <section
        id="search-results"
        className="mx-auto max-w-6xl scroll-mt-6 px-5 py-8"
      >
        {message && (
          <p className="mb-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
            {message}
          </p>
        )}

        {busResult && (
          <div className="rounded-3xl border border-blue-200 bg-white p-5 shadow-sm sm:p-7">
            <span className="text-sm font-bold text-blue-700">
              {busResult.number}
            </span>
            <h2 className="mt-1 text-2xl font-black">
              {busResult.from} → {busResult.to}
            </h2>
            <p className="mt-1 text-sm text-slate-500">{busResult.name}</p>
            <p className="mt-3 text-xs font-bold text-amber-700">
              DEMO SCHEDULE — NOT VERIFIED
            </p>

            <h3 className="mt-5 font-extrabold">Choose departure time</h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {busResult.departures.map((time) => (
                <button
                  key={time}
                  type="button"
                  onClick={() =>
                    setSelectedTimes((previous) => ({
                      ...previous,
                      [busResult.number]: time,
                    }))
                  }
                  aria-pressed={selectedTimes[busResult.number] === time}
                  className={`rounded-full border px-4 py-2.5 text-sm font-semibold ${
                    selectedTimes[busResult.number] === time
                      ? "border-blue-700 bg-blue-700 text-white"
                      : "border-slate-200 bg-white text-slate-700 hover:border-blue-500"
                  }`}
                >
                  {time}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() =>
                openTrack(busResult, selectedTimes[busResult.number] ?? "")
              }
              className="mt-5 rounded-xl bg-blue-700 px-5 py-3 font-bold text-white hover:bg-blue-800"
            >
              View stops & map →
            </button>
          </div>
        )}

        {citySearched && (
          <div className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-7">
            <h2 className="text-2xl font-black">
              {from} → {to}
            </h2>

            {matchingBuses.length === 0 ? (
              <p className="mt-4 rounded-xl bg-amber-50 p-4 text-sm text-amber-900">
                No direct route is currently listed for this exact city pair
                in the demo database. More routes can be added later.
              </p>
            ) : (
              <>
                <p className="mt-2 text-sm text-slate-500">
                  {matchingBuses.length} listed demo route(s)
                </p>
                <div className="mt-5 grid gap-4">
                  {matchingBuses.map((bus) => (
                    <article
                      key={bus.number}
                      className="rounded-2xl border border-slate-200 p-5"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-bold text-blue-700">
                            {bus.number}
                          </p>
                          <h3 className="mt-1 text-lg font-black">
                            {bus.from} → {bus.to}
                          </h3>
                        </div>
                        <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-800">
                          DEMO
                        </span>
                      </div>

                      <h4 className="mt-4 text-sm font-bold">
                        Choose departure time
                      </h4>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {bus.departures.map((time) => (
                          <button
                            key={time}
                            type="button"
                            onClick={() =>
                              setSelectedTimes((previous) => ({
                                ...previous,
                                [bus.number]: time,
                              }))
                            }
                            aria-pressed={selectedTimes[bus.number] === time}
                            className={`rounded-full border px-3 py-2 text-sm ${
                              selectedTimes[bus.number] === time
                                ? "border-blue-700 bg-blue-700 text-white"
                                : "border-slate-200 bg-slate-50 hover:border-blue-500"
                            }`}
                          >
                            {time}
                          </button>
                        ))}
                      </div>

                      <h4 className="mt-4 text-sm font-bold">Listed stops</h4>
                      <p className="mt-2 text-sm leading-6 text-slate-600">
                        {bus.stops.join(" → ")}
                      </p>

                      <button
                        type="button"
                        onClick={() =>
                          openTrack(bus, selectedTimes[bus.number] ?? "")
                        }
                        className="mt-4 rounded-xl bg-blue-700 px-4 py-2.5 text-sm font-bold text-white hover:bg-blue-800"
                      >
                        View stops & map →
                      </button>
                    </article>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {(busResult || citySearched) && (
          <p className="mt-4 text-xs leading-5 text-slate-500">
            All bus IDs, departure times, and stops shown here are illustrative
            prototype data. They are not confirmed operating services.
          </p>
        )}
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-14">
        <h2 className="text-3xl font-black">Plan your journey</h2>
        <div className="mt-6 grid gap-5 sm:grid-cols-3">
          {[
            ["🗺️", "Explore routes", "Search using your starting city and destination."],
            ["📍", "View stops", "See the stops listed for each demo route."],
            ["🚌", "Search bus IDs", "Find bus details using a BKH number."],
          ].map(([icon, title, description]) => (
            <div
              key={title}
              className="rounded-2xl border border-slate-200 bg-white p-6"
            >
              <span className="text-3xl">{icon}</span>
              <h3 className="mt-4 font-extrabold">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                {description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t bg-white px-5 py-7 text-center text-sm text-slate-500">
        <strong className="text-slate-800">BusKhoj Bihar</strong>
        <p className="mt-2">Discover routes. Plan smarter. Travel Bihar.</p>
        <p className="mt-2 text-xs">
          Prototype · Demo schedules · No live GPS tracking connected
        </p>
      </footer>

      <style jsx global>{`
        @keyframes busMotion {
          0%, 100% { transform: translateX(-6px) rotate(-1deg); }
          50% { transform: translateX(6px) rotate(1deg); }
        }
        .bus-motion {
          display: inline-block;
          animation: busMotion 1s ease-in-out infinite;
        }
      `}</style>
    </main>
  );
}
