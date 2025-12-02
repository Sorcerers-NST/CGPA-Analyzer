import HomeHero from '../../components/home/HomeHero';
import FeatureBlocks from '../../components/home/FeatureBlocks';
import ProductSections from '../../components/home/ProductSections';
import CollegesSection from '../../components/home/CollegesSection';
import CTASection from '../../components/home/CTASection';
import HomeFooter from '../../components/home/HomeFooter';

const Home = () => {
  return (
    <div className="min-h-screen bg-white">
      <HomeHero />
      <FeatureBlocks />
      <ProductSections />
      <CollegesSection />
      <CTASection />
      <HomeFooter />
    </div>
  );
};

export default Home;
