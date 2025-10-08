import Footer from "@/components/layout/footer";
import Navbar from "@/components/layout/navbar";
import AboutSection from "@/components/sections/about-section";
import FeaturesSection from "@/components/sections/feature-section";
import HeroCarousel from "@/components/sections/hero-carousel";
import LocationFetcher from "@/components/sections/location-fetch";
import ProductList from "@/components/sections/product-list";

export default function Home() {
  return (
    <section>
      <header>
        <Navbar />
      </header>
      <main>
        <HeroCarousel />
        <LocationFetcher />
        <ProductList />
        <AboutSection />
        <FeaturesSection />
      </main>
      <footer>
        <Footer className="mt-12" />
      </footer>
    </section>
  );
}
