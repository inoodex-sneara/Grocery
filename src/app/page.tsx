import HeroSlider from "@/components/home/HeroSlider";
import PromoBanners from "@/components/home/PromoBanners";
import CategoryProducts from "@/components/home/CategoryProducts";
import OurProducts from "@/components/home/OurProducts";
import KitchenEssentials from "@/components/home/KitchenEssentials";
import SpicesSection from "@/components/home/SpicesSection";
import SpecialProducts from "@/components/home/SpecialProducts";
import CustomerReviews from "@/components/home/CustomerReviews";
import LatestNews from "@/components/home/LatestNews";

export default function Home() {
  return (
    <div className="flex-1 bg-white pb-16">
      {/* Full-width Hero Slider Section */}
      <HeroSlider />

      {/* Main Content Container */}
      <div className="w-full max-w-[1680px] mx-auto px-3 sm:px-6 md:px-8 lg:px-10 xl:px-12 pt-6 sm:pt-8 space-y-10 sm:space-y-14 md:space-y-16">
     

        {/* Shop by Category Section */}
        <CategoryProducts />
         {/* Kitchen Essentials: Chilli, Onion & Garlic */}
        <KitchenEssentials />

        {/* Pure Spices & Chillies: Sukna Morich, Kacha Morich & Jira Gura Packets */}
        <SpicesSection />
           {/* 3 Promotional Banners Section */}
        <PromoBanners />

        {/* Our Products Section with Watercolor Categories */}
        <OurProducts />

       

        {/* Special Products Section (3x3 Grid) */}
        <SpecialProducts />

      
        {/* Latest News Section (Blog Cards) */}
        <LatestNews />
          {/* Customer Review Section */}
        <CustomerReviews />

      </div>
    </div>
  );
}
