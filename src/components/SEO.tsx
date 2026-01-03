import { Helmet } from "react-helmet-async";

interface SEOProps {
  title: string;
  description: string;
  canonical?: string;
  ogImage?: string;
  ogType?: "website" | "article";
  article?: {
    publishedTime?: string;
    modifiedTime?: string;
    author?: string;
    section?: string;
  };
}

const SEO = ({
  title,
  description,
  canonical,
  ogImage = "https://rampurnews.com/og-image.jpg",
  ogType = "website",
  article,
}: SEOProps) => {
  const siteName = "रामपुर न्यूज़ | Rampur News";
  const fullTitle = `${title} | ${siteName}`;
  const siteUrl = "https://rampurnews.com";
  const canonicalUrl = canonical ? `${siteUrl}${canonical}` : siteUrl;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />
      <meta name="robots" content="index, follow" />
      <meta name="googlebot" content="index, follow" />
      
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
      <meta name="news_keywords" content="रामपुर, उत्तर प्रदेश, हिंदी समाचार, ताज़ा खबरें" />
      <meta name="google-site-verification" content="YOUR_VERIFICATION_CODE" />
    </Helmet>
  );
};

export default SEO;
