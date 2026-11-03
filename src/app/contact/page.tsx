"use client";

import { useState } from "react";
import {
  ArrowUpRight,
  CheckCircle2,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";

const contactDetails = [
  {
    title: "Call our team",
    detail: "0803 - 080 - 3081",
    note: "Toll-free support",
    href: "tel:08030803081",
    icon: Phone,
  },
  {
    title: "Email us",
    detail: "mail@example.com",
    note: "We typically reply within one business day",
    href: "mailto:mail@example.com",
    icon: Mail,
  },
  {
    title: "Visit us",
    detail: "58 A, East Madison Street",
    note: "Baltimore, MD, USA 4508",
    href: "https://maps.google.com/?q=58+A+East+Madison+Street+Baltimore+MD+USA+4508",
    icon: MapPin,
  },
];

const inputClassName =
  "h-12 w-full rounded-xl border border-zinc-200 bg-white px-4 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 hover:border-zinc-300 focus:border-[#74b83e] focus:ring-4 focus:ring-[#74b83e]/10";

export default function ContactPage() {
  const [sent, setSent] = useState(false);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSent(true);
  }

  return (
    <main className="flex-1 bg-[#f7f9f4]">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
        <header className="mb-8 text-center sm:mb-10">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#639f33]">
            Get in touch
          </p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-zinc-900 sm:text-4xl">
            Contact information
          </h1>
          <p className="mt-2 text-sm leading-6 text-zinc-500">
            Choose whichever way works best for you.
          </p>
        </header>

        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:gap-8">
          <section aria-labelledby="contact-info-heading" className="space-y-5">
            <div className="grid gap-3 md:grid-cols-3 lg:grid-cols-1">
              {contactDetails.map(({ title, detail, note, href, icon: Icon }) => (
                <a
                  key={title}
                  href={href}
                  target={title === "Visit us" ? "_blank" : undefined}
                  rel={title === "Visit us" ? "noreferrer" : undefined}
                  className="group flex min-w-0 items-start gap-3 rounded-2xl border border-zinc-200/80 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-[#b8d99e] hover:shadow-md sm:gap-4 sm:p-5"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#eff8e9] text-[#639f33] transition group-hover:bg-[#74b83e] group-hover:text-white">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-xs font-semibold uppercase tracking-wide text-zinc-400">
                      {title}
                    </span>
                    <span className="mt-1 block break-words text-sm font-bold text-zinc-900">
                      {detail}
                    </span>
                    <span className="mt-1 block text-xs leading-5 text-zinc-500">
                      {note}
                    </span>
                  </span>
                  <ArrowUpRight className="mt-1 h-4 w-4 shrink-0 text-zinc-300 transition group-hover:text-[#639f33]" />
                </a>
              ))}
            </div>

            <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white p-2 shadow-sm">
              <iframe
                title="Map of Baltimore, Maryland"
                src="https://maps.google.com/maps?q=Baltimore%2C%20Maryland%2C%20USA&z=12&output=embed"
                className="h-48 w-full rounded-xl border-0 sm:h-56"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </section>

          <section
            aria-labelledby="contact-form-heading"
            className="rounded-3xl border border-zinc-200/80 bg-white p-5 shadow-sm sm:p-8 lg:p-10"
          >
            <div className="mb-7">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#639f33]">
                Send us a message
              </p>
              <h2
                id="contact-form-heading"
                className="mt-2 text-2xl font-extrabold tracking-tight text-zinc-900 sm:text-3xl"
              >
                How can we help?
              </h2>
              <p className="mt-2 text-sm leading-6 text-zinc-500">
                Fill out the form and we&apos;ll get back to you as soon as we can.
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              onChange={() => setSent(false)}
              className="space-y-5"
            >
              <div className="grid gap-5 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-zinc-700">
                    Your name
                  </span>
                  <input
                    aria-label="Name"
                    name="name"
                    placeholder="e.g. Alex Morgan"
                    required
                    className={inputClassName}
                  />
                </label>
                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-zinc-700">
                    Email address
                  </span>
                  <input
                    aria-label="Email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    required
                    className={inputClassName}
                  />
                </label>
              </div>

              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-zinc-700">
                  Phone number <span className="font-normal text-zinc-400">(optional)</span>
                </span>
                <input
                  aria-label="Phone number"
                  name="phone"
                  type="tel"
                  placeholder="Your phone number"
                  className={inputClassName}
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-zinc-700">
                  Your message
                </span>
                <textarea
                  aria-label="Message"
                  name="comment"
                  placeholder="Tell us how we can help..."
                  required
                  className="min-h-36 w-full resize-y rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 hover:border-zinc-300 focus:border-[#74b83e] focus:ring-4 focus:ring-[#74b83e]/10 sm:min-h-44"
                />
              </label>

              <div className="flex flex-col items-start gap-3 pt-1 sm:flex-row sm:items-center">
                <button
                  type="submit"
                  className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#74b83e] px-6 text-sm font-bold text-white shadow-sm transition hover:bg-[#639f33] focus:outline-none focus:ring-4 focus:ring-[#74b83e]/20 sm:w-auto"
                >
                  Send message
                  <ArrowUpRight className="h-4 w-4" />
                </button>
                {sent && (
                  <p
                    role="status"
                    className="inline-flex items-center gap-2 text-sm font-medium text-[#54892f]"
                  >
                    <CheckCircle2 className="h-4 w-4 shrink-0" />
                    Thanks, your message is ready.
                  </p>
                )}
              </div>
            </form>
          </section>
        </div>
      </div>
    </main>
  );
}
