"use client";

import { useState } from "react";
import { Mail, MapPin, Navigation, Phone, CheckCircle2 } from "lucide-react";

const contactCards = [
  { title: "Phone", icon: Phone, content: <><p><strong>Toll-free:</strong> 0803 - 080 - 3081</p><p><strong>Fax :</strong> 0000 - 123 - 456789</p></> },
  { title: "Email", icon: Mail, content: <><a href="mailto:mail@example.com">mail@example.com</a><a className="block" href="mailto:support@example.com">support@example.com</a></> },
  { title: "Address", icon: Navigation, content: <><p>No: 58 A, East Madison Street,</p><p>Baltimore, MD, USA 4508</p></> },
];

export default function ContactPage() {
  const [sent, setSent] = useState(false);
  function handleSubmit(event: React.FormEvent<HTMLFormElement>) { event.preventDefault(); setSent(true); }
  return (
    <main className="flex-1 bg-white pb-20">
      <section aria-label="Map location" className="mx-auto max-w-[1360px] px-0 sm:px-8">
        <div className="relative h-[300px] overflow-hidden sm:h-[400px] md:h-[460px] lg:h-[540px]">
          <iframe title="Map of Melbourne CBD" src="https://maps.google.com/maps?q=Melbourne%20CBD%2C%20Australia&z=13&output=embed" className="absolute inset-0 h-full w-full border-0 grayscale-[.15]" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
        </div>
      </section>

      <section className="mx-auto mt-14 max-w-[1180px] px-5 sm:mt-16 sm:px-8">
        <div className="grid gap-5 md:grid-cols-3 md:gap-7">
          {contactCards.map(({ title, icon: Icon, content }) => (
            <article key={title} className="min-h-[234px] rounded-[5px] border border-zinc-200 bg-white p-6 sm:p-7">
              <div className="flex h-[50px] w-[50px] items-center justify-center rounded-[5px] bg-[#83c945] text-white"><Icon className="h-5 w-5" fill={title === "Email" ? "currentColor" : "none"} /></div>
              <h2 className="mt-7 font-lemonada text-xl font-medium italic text-zinc-950">{title}</h2>
              <div className="mt-4 space-y-1 text-[15px] leading-6 text-zinc-900">{content}</div>
            </article>
          ))}
        </div>

        <form onSubmit={handleSubmit} onChange={() => setSent(false)} className="mt-16 sm:mt-[76px]">
          <div className="grid gap-4 md:grid-cols-2 md:gap-5 lg:grid-cols-3 lg:gap-8">
            <input aria-label="Name" name="name" placeholder="Name" required className="h-[51px] w-full rounded-full border border-zinc-200 px-7 text-[15px] outline-none transition placeholder:text-zinc-400 focus:border-[#83c945] focus:ring-2 focus:ring-[#83c945]/15" />
            <input aria-label="Email" name="email" type="email" placeholder="Email *" required className="h-[51px] w-full rounded-full border border-zinc-200 px-7 text-[15px] outline-none transition placeholder:text-zinc-400 focus:border-[#83c945] focus:ring-2 focus:ring-[#83c945]/15" />
            <input aria-label="Phone number" name="phone" type="tel" placeholder="Phone number" className="h-[51px] w-full rounded-full border border-zinc-200 px-7 text-[15px] outline-none transition placeholder:text-zinc-400 focus:border-[#83c945] focus:ring-2 focus:ring-[#83c945]/15" />
          </div>
          <textarea aria-label="Comment" name="comment" placeholder="Comment" required className="mt-8 min-h-[240px] w-full resize-y rounded-2xl border border-zinc-200 px-7 py-6 text-[15px] outline-none transition placeholder:text-zinc-400 focus:border-[#83c945] focus:ring-2 focus:ring-[#83c945]/15 sm:min-h-[300px]" />
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <button type="submit" className="min-w-[97px] rounded-full bg-[#83c945] px-7 py-3 text-[15px] text-white transition hover:bg-[#70b638]">Send</button>
            {sent && <p role="status" className="inline-flex items-center gap-2 text-sm text-[#54892f]"><CheckCircle2 className="h-4 w-4"/>Thanks, your message is ready.</p>}
          </div>
        </form>
      </section>
    </main>
  );
}
