
"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

function BookingForm() {
  const searchParams = useSearchParams();

  const from = searchParams.get("from") || "Patna";
  const to = searchParams.get("to") || "Muzaffarpur";
  const departureTime = searchParams.get("time") || "10:00 AM";

  const [today, setToday] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [journeyDate, setJourneyDate] = useState("");
  const [passengers, setPassengers] = useState("1");
  const [error, setError] = useState("");
  const [booking, setBooking] = useState<{
    reference: string;
    name: string;
    phone: string;
    date: string;
    passengers: number;
    fare: number;
  } | null>(null);

  const farePerPassenger = 150;
  const totalFare = farePerPassenger * Number(passengers);

  // Calculate today's date only after the component mounts.
  // This prevents server/browser hydration mismatches.
  useEffect(() => {
    const getLocalDate = () => {
      const date = new Date();
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");

      return `${year}-${month}-${day}`;
    };

    setToday(getLocalDate());
  }, []);

  function handleBooking(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const cleanName = name.trim();
    const cleanPhone = phone.replace(/\D/g, "");
    const passengerCount = Number(passengers);

    if (cleanName.length < 2) {
      setError("Please enter your full name.");
      return;
    }

    if (!/^\d{10}$/.test(cleanPhone)) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }

    if (!journeyDate) {
      setError("Please select your journey date.");
      return;
    }

    const selectedDate = new Date(`${journeyDate}T00:00:00`);
    const currentDate = new Date();

    currentDate.setHours(0, 0, 0, 0);

    if (Number.isNaN(selectedDate.getTime()) || selectedDate < currentDate) {
      setError("Journey date cannot be earlier than today.");
      return;
    }

    if (
      !Number.isInteger(passengerCount) ||
      passengerCount < 1 ||
      passengerCount > 6
    ) {
      setError("You can book between 1 and 6 passengers.");
      return;
    }

    // Demo only: no real ticket, payment, or seat reservation is created.
    const reference = `DEMO${Date.now().toString().slice(-8)}`;

    setBooking({
      reference,
      name: cleanName,
      phone: cleanPhone,
      date: journeyDate,
      passengers: passengerCount,
      fare: passengerCount * farePerPassenger,
    });
  }

  if (booking) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-10 text-slate-900">
        <div className="mx-auto max-w-xl">
          <a href="/" className="text-xl font-black">
            🚌 BusKhoj <span className="text-blue-700">Bihar</span>
          </a>

          <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-3xl">
                ✓
              </div>

              <h1 className="mt-4 text-2xl font-black">
                Demo booking created!
              </h1>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                Your details have been accepted for this demonstration.
                This is not a real bus ticket.
              </p>
            </div>

            <div className="mt-7 rounded-2xl border border-dashed border-blue-300 bg-blue-50 p-4">
              <p className="text-sm text-slate-600">Demo reference number</p>
              <p className="mt-1 break-all text-xl font-black text-blue-800">
                {booking.reference}
              </p>
            </div>

            <div className="mt-6 space-y-4">
              <div className="flex justify-between gap-4">
                <span className="text-slate-500">Passenger</span>
                <span className="text-right font-bold">{booking.name}</span>
              </div>

              <div className="flex justify-between gap-4">
                <span className="text-slate-500">Mobile</span>
                <span className="font-bold">{booking.phone}</span>
              </div>

              <div className="flex justify-between gap-4">
                <span className="text-slate-500">Route</span>
                <span className="text-right font-bold">
                  {from} → {to}
                </span>
              </div>

              <div className="flex justify-between gap-4">
                <span className="text-slate-500">Departure</span>
                <span className="font-bold">{departureTime}</span>
              </div>

              <div className="flex justify-between gap-4">
                <span className="text-slate-500">Journey date</span>
                <span className="font-bold">{booking.date}</span>
              </div>

              <div className="flex justify-between gap-4">
                <span className="text-slate-500">Passengers</span>
                <span className="font-bold">{booking.passengers}</span>
              </div>

              <div className="flex justify-between gap-4 border-t pt-4">
                <span className="font-bold">Demo fare</span>
                <span className="text-xl font-black text-blue-800">
                  ₹{booking.fare}
                </span>
              </div>
            </div>

            <p className="mt-5 rounded-xl bg-amber-50 p-3 text-sm leading-5 text-amber-800">
              Demo only: no payment was taken, no seat was reserved, and this
              reference is not valid for travel. Booking details are not
              saved to a database.
            </p>

            <a
              href="/"
              className="mt-6 flex w-full items-center justify-center rounded-xl bg-blue-700 px-5 py-3.5 font-bold text-white transition hover:bg-blue-800"
            >
              Back to Home
            </a>

            <button
              type="button"
              onClick={() => setBooking(null)}
              className="mt-3 w-full rounded-xl border border-slate-300 px-5 py-3 font-bold hover:bg-slate-50"
            >
              Make another demo booking
            </button>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 text-slate-900 sm:py-12">
      <div className="mx-auto max-w-2xl">
        <header className="flex items-center justify-between gap-4">
          <a href="/" className="text-xl font-black">
            🚌 BusKhoj <span className="text-blue-700">Bihar</span>
          </a>

          <a
            href="/track"
            className="text-sm font-bold text-blue-700 hover:underline"
          >
            ← Back to routes
          </a>
        </header>

        <section className="mt-6 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="bg-gradient-to-r from-blue-950 to-blue-700 p-6 text-white sm:p-8">
            <p className="text-sm font-bold uppercase tracking-widest text-blue-200">
              BusKhoj Bihar
            </p>

            <h1 className="mt-2 text-3xl font-black sm:text-4xl">
              Book your journey
            </h1>

            <p className="mt-3 text-sm leading-6 text-blue-100">
              Enter passenger details to try our demo booking experience.
            </p>
          </div>

          <div className="p-5 sm:p-8">
            <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-blue-700">
                Selected journey
              </p>

              <div className="mt-3 flex items-center gap-3">
                <div className="min-w-0 flex-1">
                  <p className="text-lg font-black">{from}</p>
                  <p className="mt-1 text-xs text-slate-500">Departure</p>
                </div>

                <span className="text-xl text-blue-700">→</span>

                <div className="min-w-0 flex-1 text-right">
                  <p className="text-lg font-black">{to}</p>
                  <p className="mt-1 text-xs text-slate-500">Destination</p>
                </div>
              </div>

              <div className="mt-4 border-t border-blue-100 pt-3 text-sm">
                <span className="text-slate-600">Departure time: </span>
                <strong>{departureTime}</strong>
              </div>
            </div>

            <div className="mt-5 rounded-xl bg-amber-50 p-3 text-sm leading-5 text-amber-800">
              <strong>Demo booking:</strong> ₹150 per passenger is an example
              fare only. No actual ticket or payment is provided.
            </div>

            <form onSubmit={handleBooking} className="mt-6 space-y-5">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-bold text-slate-700"
                >
                  Passenger full name
                </label>

                <input
                  id="name"
                  type="text"
                  autoComplete="name"
                  required
                  minLength={2}
                  maxLength={100}
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Enter your full name"
                  className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-bold text-slate-700"
                >
                  Mobile number
                </label>

                <input
                  id="phone"
                  type="tel"
                  inputMode="numeric"
                  autoComplete="tel-national"
                  required
                  maxLength={10}
                  pattern="[0-9]{10}"
                  value={phone}
                  onChange={(event) =>
                    setPhone(event.target.value.replace(/\D/g, "").slice(0, 10))
                  }
                  placeholder="10-digit mobile number"
                  className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="date"
                    className="block text-sm font-bold text-slate-700"
                  >
                    Journey date
                  </label>

                  <input
                    id="date"
                    type="date"
                    required
                    min={today || undefined}
                    value={journeyDate}
                    onChange={(event) => setJourneyDate(event.target.value)}
                    className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-3 text-slate-900 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label
                    htmlFor="passengers"
                    className="block text-sm font-bold text-slate-700"
                  >
                    Number of passengers
                  </label>

                  <select
                    id="passengers"
                    required
                    value={passengers}
                    onChange={(event) => setPassengers(event.target.value)}
                    className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-3 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                  >
                    {[1, 2, 3, 4, 5, 6].map((count) => (
                      <option key={count} value={String(count)}>
                        {count} {count === 1 ? "passenger" : "passengers"}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 p-4">
                <div className="flex justify-between gap-4 text-sm">
                  <span className="text-slate-600">Demo fare per passenger</span>
                  <span className="font-bold">₹150</span>
                </div>

                <div className="mt-3 flex justify-between gap-4 border-t pt-3">
                  <span className="font-bold">Total demo fare</span>
                  <span className="text-xl font-black text-blue-800">
                    ₹{totalFare}
                  </span>
                </div>
              </div>

              {error && (
                <p
                  role="alert"
                  className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm font-medium text-red-700"
                >
                  {error}
                </p>
              )}

              <button
                type="submit"
                className="w-full rounded-xl bg-blue-700 px-5 py-4 font-bold text-white shadow-sm transition hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Confirm Demo Booking →
              </button>

              <p className="text-center text-xs leading-5 text-slate-500">
                Demo only. This form does not process payments, reserve seats,
                or save bookings to a database.
              </p>
            </form>
          </div>
        </section>

        <p className="mt-5 text-center text-sm text-slate-500">
          BusKhoj Bihar · Routes and booking demonstration
        </p>
      </div>
    </main>
  );
}

export default function BookPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-slate-50">
          <p className="font-semibold text-slate-600">
            Loading booking page...
          </p>
        </main>
      }
    >
      <BookingForm />
    </Suspense>
  );
}
