import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BreakingNewsTicker from "@/components/BreakingNewsTicker";
import CategorySection from "@/components/CategorySection";
import Sidebar from "@/components/Sidebar";
import NewsCard from "@/components/NewsCard";
import SEO from "@/components/SEO";
import { mockNewsData, getFeaturedNews } from "@/data/mockNews";

const Index = () => {
  const featuredNews = getFeaturedNews().slice(0, 3);

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="रामपुर की ताज़ा खबरें"
        description="रामपुर न्यूज़ - रामपुर जिले और उत्तर प्रदेश की ताज़ा, विश्वसनीय खबरें। राजनीति, अपराध, शिक्षा, खेल, मनोरंजन और स्थानीय समाचार।"
        canonical="/"
        ogType="website"
      />

      <Header />
      <BreakingNewsTicker />

      <main className="container py-6">
        {/* Featured Hero Section */}
        <section className="mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Main Featured */}
            <div className="lg:col-span-2">
              {featuredNews[0] && (
                <NewsCard article={featuredNews[0]} variant="featured" />
              )}
            </div>
            {/* Side Featured */}
            <div className="space-y-4">
              {featuredNews.slice(1, 3).map((article) => (
                <NewsCard key={article.id} article={article} variant="horizontal" />
              ))}
            </div>
          </div>
        </section>

        {/* Main Content with Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-8 space-y-8">
            {/* Rampur News */}
            <CategorySection
              title="रामपुर"
              articles={mockNewsData.rampur || []}
              viewAllLink="/rampur"
              variant="featured"
            />

            {/* UP News */}
            <CategorySection
              title="उत्तर प्रदेश"
              articles={mockNewsData.up || []}
              viewAllLink="/up"
              variant="default"
            />

            {/* National News */}
            <CategorySection
              title="देश"
              articles={mockNewsData.national || []}
              viewAllLink="/national"
              variant="default"
            />

            {/* Politics */}
            <CategorySection
              title="राजनीति"
              articles={mockNewsData.politics || []}
              viewAllLink="/politics"
              variant="default"
            />

            {/* Crime */}
            <CategorySection
              title="अपराध"
              articles={mockNewsData.crime || []}
              viewAllLink="/crime"
              variant="default"
            />

            {/* Education & Jobs */}
            <CategorySection
              title="शिक्षा और नौकरियां"
              articles={mockNewsData["education-jobs"] || []}
              viewAllLink="/education-jobs"
              variant="default"
            />

            {/* Business */}
            <CategorySection
              title="व्यापार"
              articles={mockNewsData.business || []}
              viewAllLink="/business"
              variant="default"
            />

            {/* Entertainment */}
            <CategorySection
              title="मनोरंजन"
              articles={mockNewsData.entertainment || []}
              viewAllLink="/entertainment"
              variant="default"
            />

            {/* Sports */}
            <CategorySection
              title="खेल"
              articles={mockNewsData.sports || []}
              viewAllLink="/sports"
              variant="default"
            />

            {/* Health */}
            <CategorySection
              title="स्वास्थ्य"
              articles={mockNewsData.health || []}
              viewAllLink="/health"
              variant="default"
            />

            {/* Religion & Culture */}
            <CategorySection
              title="धर्म और संस्कृति"
              articles={mockNewsData["religion-culture"] || []}
              viewAllLink="/religion-culture"
              variant="default"
            />

            {/* Food & Lifestyle */}
            <CategorySection
              title="खान-पान और लाइफस्टाइल"
              articles={mockNewsData["food-lifestyle"] || []}
              viewAllLink="/food-lifestyle"
              variant="default"
            />

            {/* Nearby */}
            <CategorySection
              title="आस-पास"
              articles={mockNewsData.nearby || []}
              viewAllLink="/nearby"
              variant="default"
            />
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-24">
              <Sidebar />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
