
"use client";

import { useState } from "react";

const stops = [
  { name: "Patna Bus Stand", time: "08:00 AM", status: "Departed" },
  { name: "Hajipur", time: "08:40 AM", status: "Departed" },
  { name: "Lalganj", time: "09:15 AM", status: "Next stop" },
  { name: "Vaishali", time: "09:45 AM", status: "Upcoming" },
  { name: "Muzaffarpur", time: "10:30 AM", status: "Destination" },
];

export default function Home() {
  const [from, setFrom] = useState("Patna");
  const [to, setTo] = useState("Muzaffarpur");
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  function searchBus() {
    setLoading(true);
    setSearched(false);
    window.setTimeout(() => {
      setLoading(false);
      setSearched(true);
    }, 1200);
  }

  return (
    <main className="min-h-screen bg-[#f5f8fc] text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
          <a href="/" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-700 text-2xl text-white">🚌</div>
            <div>
              <h1 className="text-xl font-black tracking-tight">BusKhoj <span className="text-blue-700">Bihar</span></h1>
              <p className="text-xs text-slate-500">Your journey, made simpler.</p>
            </div>
          </a>
          <span className="hidden rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-800 sm:inline-block">Explore Bihar by bus</span>
        </div>
      </header>

      <section className="relative overflow-hidden bg-gradient-to-br from-blue-950 via-blue-800 to-blue-600 text-white">
        <div className="mx-auto grid max-w-7xl items-center gap-8 px-5 py-14 md:grid-cols-2 md:py-20">
          <div>
            <span className="rounded-full border border-white/25 bg-white/10 px-3 py-1.5 text-xs font-semibold tracking-wide">BIHAR BUS ROUTES, IN ONE PLACE</span>
            <h2 className="mt-6 max-w-xl text-4xl font-black leading-tight sm:text-5xl">Find your bus.<br />Know your route.</h2>
            <p className="mt-5 max-w-lg leading-7 text-blue-100">Discover bus routes and stops across Bihar. Plan your journey with a simpler way to explore your options.</p>
            <div className="mt-7 flex flex-wrap gap-3 text-sm text-blue-50">
              <span>✓ Route discovery</span><span>✓ Stop-by-stop details</span><span>✓ Simple journey planning</span>
            </div>
          </div>
          <div className="relative mx-auto flex w-full max-w-md items-center justify-center">
            <div className="absolute h-64 w-64 rounded-full bg-cyan-300/20 blur-3xl" />
            <div className="relative w-full rounded-3xl border border-white/20 bg-white/10 p-8 text-center shadow-2xl backdrop-blur">
              <div className="bus-bounce text-8xl" aria-label="Bus illustration">🚌</div>
              <p className="mt-4 text-lg font-bold">Every route starts somewhere.</p>
              <p className="mt-2 text-sm text-blue-100">Your next Bihar journey starts here.</p>
              <div className="mt-6 flex justify-center gap-2">
                <span className="h-2 w-2 rounded-full bg-white/60" />
                <span className="h-2 w-2 rounded-full bg-white" />
                <span className="h-2 w-2 rounded-full bg-white/60" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 mx-auto -mt-7 max-w-6xl px-5">
        <div className="rounded-3xl bg-white p-5 shadow-xl shadow-slate-200/70 sm:p-8">
          <div className="mb-6">
            <h3 className="text-xl font-extrabold">Where do you want to go?</h3>
            <p className="mt-1 text-sm text-slate-500">Enter your starting point and destination.</p>
          </div>
          <div className="grid gap-4 md:grid-cols-[1fr_auto_1fr_auto] md:items-end">
            <label className="block text-sm font-semibold text-slate-700">From
              <input value={from} onChange={(e) => setFrom(e.target.value)} placeholder="Starting city" className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100" />
            </label>
            <button onClick={() => { setFrom(to); setTo(from); }} className="rounded-xl border border-slate-200 px-4 py-3 text-xl hover:bg-slate-50" aria-label="Swap cities">⇄</button>
            <label className="block text-sm font-semibold text-slate-700">To
              <input value={to} onChange={(e) => setTo(e.target.value)} placeholder="Destination city" className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100" />
            </label>
            <button onClick={searchBus} disabled={loading || !from.trim() || !to.trim()} className="rounded-xl bg-blue-700 px-6 py-3.5 font-bold text-white transition hover:bg-blue-800 disabled:opacity-60">
              {loading ? "Finding..." : "Search buses →"}
            </button>
          </div>
          {loading && <div className="mt-7 rounded-2xl bg-blue-50 p-5 text-center text-blue-800"><div className="bus-bounce text-4xl">🚌</div><p className="mt-2 font-semibold">Looking for your route...</p></div>}
          {searched && <div className="mt-6 rounded-2xl border border-blue-100 bg-blue-50 p-5"><h4 className="font-bold text-blue-950">Route search preview</h4><p className="mt-2 text-sm text-slate-700">{from.trim()} → {to.trim()}</p><p className="mt-2 text-sm text-slate-500">This is a demo preview. Verified bus services and live arrival times are not connected yet.</p></div>}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-14">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div><p className="text-sm font-bold uppercase tracking-widest text-blue-700">Plan with confidence</p><h3 className="mt-2 text-3xl font-black">Your journey, at a glance</h3></div>
          <span className="text-sm text-slate-500">Built for Bihar travellers</span>
        </div>
        <div className="mt-7 grid gap-5 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-6"><div className="text-3xl">🗺️</div><h4 className="mt-4 font-extrabold">Explore routes</h4><p className="mt-2 text-sm leading-6 text-slate-500">Find a simpler way to explore connections between cities.</p></div>
          <div className="rounded-2xl border border-slate-200 bg-white p-6"><div className="text-3xl">📍</div><h4 className="mt-4 font-extrabold">View every stop</h4><p className="mt-2 text-sm leading-6 text-slate-500">Understand the order of stops along a journey.</p></div>
          <div className="rounded-2xl border border-slate-200 bg-white p-6"><div className="text-3xl">⏱️</div><h4 className="mt-4 font-extrabold">Plan your time</h4><p className="mt-2 text-sm leading-6 text-slate-500">Arrival estimates can be added when reliable schedule data is available.</p></div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-16">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div><p className="text-sm font-bold text-blue-700">SAMPLE JOURNEY</p><h3 className="mt-1 text-2xl font-black">Patna → Muzaffarpur</h3></div>
            <span className="rounded-full bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-800">Illustrative demo data</span>
          </div>
          <p className="mt-2 text-sm text-slate-500">Example stop sequence for demonstrating the interface. Not a verified bus timetable.</p>
          <div className="mt-8">
            {stops.map((stop, i) => (
              <div key={stop.name} className="flex gap-4">
                <div className="flex w-6 flex-col items-center">
                  <div className={`z-10 h-4 w-4 rounded-full border-4 ${i === 2 ? "border-blue-600 bg-white" : i === 4 ? "border-emerald-500 bg-emerald-100" : "border-slate-300 bg-white"}`} />
                  {i < stops.length - 1 && <div className="min-h-12 w-0.5 flex-1 bg-slate-200" />}
                </div>
                <div className="flex flex-1 items-start justify-between gap-3 pb-7">
                  <div><p className="font-bold">{stop.name}</p><p className="mt-1 text-sm text-slate-500">{stop.status}</p></div>
                  <span className="whitespace-nowrap text-sm font-semibold text-slate-600">{stop.time}</span>
                </div>
              </div>
            ))}
          </div>
          <p className="rounded-xl bg-slate-50 p-4 text-xs leading-5 text-slate-500">Live GPS tracking and verified bus schedules are not available in this prototype yet. Times above are examples only.</p>
        </div>
      </section>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-5 py-7 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-bold text-slate-800">🚌 BusKhoj Bihar</p>
          <p>Discover routes. Plan smarter. Travel Bihar.</p>
          <p>Prototype · Live tracking coming later</p>
        </div>
      </footer>

      <style jsx global>{`
        @keyframes busBounce {
          0%, 100% { transform: translateX(-5px) rotate(-1deg); }
          50% { transform: translateX(5px) rotate(1deg); }
        }
        .bus-bounce { display: inline-block; animation: busBounce 1.1s ease-in-out infinite; }
      `}</style>
    </main>
  );
}
