import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Clock, Share2, User } from "lucide-react";
import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Sidebar from "@/components/Sidebar";
import ShareButtons from "@/components/ShareButtons";
import NewsCard from "@/components/NewsCard";
import { Button } from "@/components/ui/button";
import { mockNewsData, getRelativeTimeHindi, formatDateHindi, NewsArticle } from "@/data/mockNews";

// Valid news categories
const validCategories = [
  "rampur", "up", "national", "politics", "crime", 
  "education-jobs", "business", "entertainment", "sports", 
  "health", "religion-culture", "food-lifestyle", "nearby"
];

const getCategoryHindi = (category: string): string => {
  const categoryMap: Record<string, string> = {
    "rampur": "रामपुर",
    "up": "उत्तर प्रदेश",
    "national": "देश",
    "politics": "राजनीति",
    "crime": "अपराध",
    "education-jobs": "शिक्षा और नौकरियां",
    "business": "व्यापार",
    "entertainment": "मनोरंजन",
    "sports": "खेल",
    "health": "स्वास्थ्य",
    "religion-culture": "धर्म-संस्कृति",
    "food-lifestyle": "खान-पान और जीवनशैली",
    "nearby": "आस-पास"
  };
  return categoryMap[category] || category;
};

const NewsDetail = () => {
  const { category, slug } = useParams<{ category: string; slug: string }>();

  // Validate category
  if (!category || !validCategories.includes(category)) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center py-16">
            <h1 className="text-2xl font-bold text-foreground mb-4">पेज नहीं मिला</h1>
            <p className="text-muted-foreground mb-6">यह पेज मौजूद नहीं है।</p>
            <Link to="/">
              <Button>
                <ArrowLeft className="mr-2 h-4 w-4" />
                होम पर जाएं
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Find the article
  const categoryNews = mockNewsData[category] || [];
  const article = categoryNews.find((a) => a.slug === slug);

  if (!article) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center py-16">
            <h1 className="text-2xl font-bold text-foreground mb-4">खबर नहीं मिली</h1>
            <p className="text-muted-foreground mb-6">यह खबर मौजूद नहीं है या हटा दी गई है।</p>
            <Link to={`/${category}`}>
              <Button>
                <ArrowLeft className="mr-2 h-4 w-4" />
                {getCategoryHindi(category)} पर वापस जाएं
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Get related news from same category
  const relatedNews = categoryNews
    .filter((a) => a.id !== article.id)
    .slice(0, 4);

  const articleUrl = `${window.location.origin}/${category}/${slug}`;

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{article.title} | रामपुर न्यूज़</title>
        <meta name="description" content={article.excerpt} />
        <meta property="og:title" content={article.title} />
        <meta property="og:description" content={article.excerpt} />
        <meta property="og:image" content={article.image} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={articleUrl} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={article.title} />
        <meta name="twitter:description" content={article.excerpt} />
        <meta name="twitter:image" content={article.image} />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "NewsArticle",
            "headline": article.title,
            "description": article.excerpt,
            "image": article.image,
            "author": {
              "@type": "Person",
              "name": article.author
            },
            "datePublished": article.publishedDate,
            "publisher": {
              "@type": "Organization",
              "name": "रामपुर न्यूज़",
              "logo": {
                "@type": "ImageObject",
                "url": `${window.location.origin}/favicon.ico`
              }
            }
          })}
        </script>
      </Helmet>

      <Header />

      <main className="container mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link to="/" className="hover:text-primary">होम</Link>
          <span>/</span>
          <Link to={`/${category}`} className="hover:text-primary">
            {getCategoryHindi(category)}
          </Link>
          <span>/</span>
          <span className="text-foreground line-clamp-1">{article.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <article className="lg:col-span-2">
            {/* Category & Breaking Badge */}
            <div className="flex items-center gap-3 mb-4">
              <Link 
                to={`/${category}`}
                className="text-sm font-semibold text-primary hover:underline"
              >
                {article.categoryHindi}
              </Link>
              {article.isBreaking && (
                <span className="live-badge">ब्रेकिंग</span>
              )}
            </div>

            {/* Title */}
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-4 leading-tight">
              {article.title}
            </h1>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6 pb-6 border-b border-border">
              <span className="flex items-center gap-1">
                <User size={14} />
                {article.author}
              </span>
              <span className="flex items-center gap-1">
                <Clock size={14} />
                {formatDateHindi(article.publishedDate)}
              </span>
              {article.readTime && (
                <span>पढ़ने का समय: {article.readTime}</span>
              )}
            </div>

            {/* Featured Image */}
            <div className="rounded-lg overflow-hidden mb-6">
              <img
                src={article.image}
                alt={article.title}
                className="w-full h-auto object-cover"
              />
            </div>

            {/* Share Buttons */}
            <div className="flex items-center gap-4 mb-6">
              <span className="flex items-center gap-2 text-sm font-medium text-foreground">
                <Share2 size={16} />
                शेयर करें:
              </span>
              <ShareButtons url={articleUrl} title={article.title} />
            </div>

            {/* Article Content */}
            <div className="prose prose-lg max-w-none text-foreground">
              <p className="text-lg font-medium leading-relaxed mb-6">
                {article.excerpt}
              </p>
              {article.content ? (
                <div dangerouslySetInnerHTML={{ __html: article.content }} />
              ) : (
                <>
                  <p>
                    {article.excerpt} यह खबर {getCategoryHindi(category)} श्रेणी से संबंधित है और इसमें विस्तृत जानकारी दी गई है।
                  </p>
                  <p>
                    स्थानीय प्रशासन और संबंधित अधिकारियों ने इस मामले पर अपनी प्रतिक्रिया दी है। आगे की जानकारी के लिए हमारे साथ जुड़े रहें।
                  </p>
                  <p>
                    इस खबर से जुड़े किसी भी अपडेट के लिए रामपुर न्यूज़ को फॉलो करें। हम आपको हर खबर से अवगत कराते रहेंगे।
                  </p>
                </>
              )}
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mt-8 pt-6 border-t border-border">
              <span className="text-sm font-medium text-foreground">टैग:</span>
              <Link 
                to={`/${category}`}
                className="px-3 py-1 bg-muted text-muted-foreground text-sm rounded-full hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                {article.categoryHindi}
              </Link>
              <span className="px-3 py-1 bg-muted text-muted-foreground text-sm rounded-full">
                रामपुर न्यूज़
              </span>
            </div>

            {/* Related News */}
            {relatedNews.length > 0 && (
              <section className="mt-10 pt-8 border-t border-border">
                <h2 className="text-xl font-bold text-foreground mb-6">
                  संबंधित खबरें
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {relatedNews.map((news) => (
                    <NewsCard key={news.id} article={news} variant="horizontal" />
                  ))}
                </div>
              </section>
            )}
          </article>

          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <Sidebar />
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default NewsDetail;
