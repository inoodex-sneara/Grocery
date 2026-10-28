import HeroSlider from "@/components/home/HeroSlider";
import PromoBanners from "@/components/home/PromoBanners";
import OurProducts from "@/components/home/OurProducts";

export default function Home() {
  return (
    <div className="flex-1 bg-zinc-50/50 pb-16">
      {/* Full-width Hero Section */}
      <HeroSlider />

      {/* Main Content Container */}
      <div className="w-full max-w-[1680px] mx-auto px-3 sm:px-6 md:px-8 lg:px-10 xl:px-12 pt-8 sm:pt-10 space-y-12 sm:space-y-16">
        {/* 3 Promotional Banners Section */}
        <PromoBanners />

        {/* Our Products Section */}
        <OurProducts />
      </div>
    </div>
  );
}
