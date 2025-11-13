/**
 * Home - Professional Homepage (cal.com style)
 * 
 * Main product page showcasing CGPA Analyzer
 * Clean, minimalist, professional SaaS aesthetic
 * 
 * Sections:
 * 1. Hero with headline and CTA
 * 2. Feature blocks (3-column grid)
 * 3. Product sections (alternating layout)
 * 4. Colleges section (no fake testimonials)
 * 5. Final CTA
 * 6. Footer
 */

import HomeHero from '../../components/home/HomeHero';
import FeatureBlocks from '../../components/home/FeatureBlocks';
import ProductSections from '../../components/home/ProductSections';
import CollegesSection from '../../components/home/CollegesSection';
import CTASection from '../../components/home/CTASection';
import HomeFooter from '../../components/home/HomeFooter';

const Home = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <HomeHero />

      {/* Feature Blocks */}
      <FeatureBlocks />

      {/* Product Feature Sections */}
      <ProductSections />

      {/* Colleges Section */}
      <CollegesSection />

      {/* Call to Action */}
      <CTASection />

      {/* Footer */}
      <HomeFooter />
    </div>
  );
};

export default Home;
