import { Truck, Leaf, Clock, ShieldCheck } from "lucide-react";

const FEATURES = [
  {
    icon: Truck,
    title: "Free Delivery",
    subtitle: "On all orders over Tk 1,000",
  },
  {
    icon: Leaf,
    title: "100% Fresh Organic",
    subtitle: "Direct from verified local farms",
  },
  {
    icon: Clock,
    title: "2-Hour Express",
    subtitle: "Quick door delivery in your area",
  },
  {
    icon: ShieldCheck,
    title: "Safe & Secure",
    subtitle: "100% safe payment & bKash support",
  },
];

export default function FeaturesBar() {
  return (
    <section aria-label="Store Benefits" className="w-full">
      <div className="w-full bg-white rounded-2xl sm:rounded-3xl border border-zinc-200/80 p-4 sm:p-6 lg:p-7 shadow-2xs">
        <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 divide-y xs:divide-y-0 divide-zinc-100">
          {FEATURES.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className={`flex items-center gap-3.5 sm:gap-4 ${
                  idx !== 0 ? "pt-3.5 xs:pt-0 lg:pl-6" : ""
                } ${idx > 0 && idx % 2 === 1 ? "xs:pl-4" : ""}`}
              >
                <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-[#ecf7e6] text-[#74B83E] flex items-center justify-center shrink-0 shadow-2xs transition-transform hover:scale-105">
                  <Icon className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.2]" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-xs sm:text-sm font-extrabold text-zinc-900 tracking-tight truncate">
                    {item.title}
                  </h3>
                  <p className="text-[11px] sm:text-xs text-zinc-500 font-medium truncate mt-0.5">
                    {item.subtitle}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

