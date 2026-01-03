import { Helmet } from "react-helmet-async";

interface ArticleData {
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  section?: string;
}

interface NewsArticleSchema {
  headline: string;
  description: string;
  image?: string;
  datePublished?: string;
  dateModified?: string;
  author?: string;
  section?: string;
}

interface SEOProps {
  title: string;
  description: string;
  canonical?: string;
  ogImage?: string;
  ogType?: "website" | "article";
  article?: ArticleData;
  newsArticle?: NewsArticleSchema;
  isHomepage?: boolean;
}

const SEO = ({
  title,
  description,
  canonical,
  ogImage = "https://rampurnews.com/og-image.jpg",
  ogType = "website",
  article,
  newsArticle,
  isHomepage = false,
}: SEOProps) => {
  const siteName = "रामपुर न्यूज़ | Rampur News";
  const fullTitle = `${title} | ${siteName}`;
  const siteUrl = "https://rampurnews.com";
  const canonicalUrl = canonical ? `${siteUrl}${canonical}` : siteUrl;

  // Website Schema (for homepage)
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteName,
    url: siteUrl,
    description: "रामपुर न्यूज़ - रामपुर जिले और उत्तर प्रदेश की ताज़ा, विश्वसनीय खबरें।",
    inLanguage: "hi-IN",
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteUrl}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
    publisher: {
      "@type": "Organization",
      name: siteName,
      url: siteUrl,
      logo: {
        "@type": "ImageObject",
        url: `${siteUrl}/logo.png`,
        width: 600,
        height: 60,
      },
    },
  };

  // News Media Organization Schema
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "NewsMediaOrganization",
    name: siteName,
    url: siteUrl,
    logo: {
      "@type": "ImageObject",
      url: `${siteUrl}/logo.png`,
      width: 600,
      height: 60,
    },
    sameAs: [
      "https://facebook.com/RampurNews",
      "https://twitter.com/RampurNews",
      "https://instagram.com/RampurNews",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+91-XXXXXXXXXX",
      contactType: "customer service",
      areaServed: "IN",
      availableLanguage: "Hindi",
    },
  };

  // NewsArticle Schema
  const newsArticleSchema = newsArticle
    ? {
        "@context": "https://schema.org",
        "@type": "NewsArticle",
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": canonicalUrl,
        },
        headline: newsArticle.headline,
        description: newsArticle.description,
        image: newsArticle.image || ogImage,
        datePublished: newsArticle.datePublished || new Date().toISOString(),
        dateModified: newsArticle.dateModified || newsArticle.datePublished || new Date().toISOString(),
        author: {
          "@type": "Person",
          name: newsArticle.author || "रामपुर न्यूज़ संवाददाता",
        },
        publisher: {
          "@type": "Organization",
          name: siteName,
          logo: {
            "@type": "ImageObject",
            url: `${siteUrl}/logo.png`,
            width: 600,
            height: 60,
          },
        },
        articleSection: newsArticle.section || "समाचार",
        inLanguage: "hi-IN",
      }
    : null;

  // BreadcrumbList Schema for category pages
  const breadcrumbSchema = !isHomepage
    ? {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "होम",
            item: siteUrl,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: title,
            item: canonicalUrl,
          },
        ],
      }
    : null;

  // CollectionPage Schema for category pages
  const collectionPageSchema = !isHomepage && !newsArticle
    ? {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: fullTitle,
        description: description,
        url: canonicalUrl,
        inLanguage: "hi-IN",
        isPartOf: {
          "@type": "WebSite",
          name: siteName,
          url: siteUrl,
        },
      }
    : null;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      <meta name="googlebot" content="index, follow" />
      <meta name="googlebot-news" content="index, follow" />
      
      {/* Language */}
      <html lang="hi" />
      <meta httpEquiv="content-language" content="hi-IN" />
      
      {/* Open Graph */}
      <meta property="og:site_name" content={siteName} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:locale" content="hi_IN" />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@RampurNews" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      
      {/* Article specific meta (for news articles) */}
      {article && (
        <>
          <meta property="article:published_time" content={article.publishedTime} />
          {article.modifiedTime && (
            <meta property="article:modified_time" content={article.modifiedTime} />
          )}
          {article.author && (
            <meta property="article:author" content={article.author} />
          )}
          {article.section && (
            <meta property="article:section" content={article.section} />
          )}
        </>
      )}
      
      {/* Google News */}
      <meta name="news_keywords" content="रामपुर, उत्तर प्रदेश, हिंदी समाचार, ताज़ा खबरें, Rampur News" />
      <meta name="google-site-verification" content="YOUR_VERIFICATION_CODE" />
      
      {/* JSON-LD Structured Data */}
      {isHomepage && (
        <script type="application/ld+json">
          {JSON.stringify(websiteSchema)}
        </script>
      )}
      
      <script type="application/ld+json">
        {JSON.stringify(organizationSchema)}
      </script>
      
      {newsArticleSchema && (
        <script type="application/ld+json">
          {JSON.stringify(newsArticleSchema)}
        </script>
      )}
      
      {breadcrumbSchema && (
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbSchema)}
        </script>
      )}
      
      {collectionPageSchema && (
        <script type="application/ld+json">
          {JSON.stringify(collectionPageSchema)}
        </script>
      )}
    </Helmet>
  );
};

export default SEO;
