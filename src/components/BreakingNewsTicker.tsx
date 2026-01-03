import { Zap } from "lucide-react";
import { getBreakingNews } from "@/data/mockNews";

const BreakingNewsTicker = () => {
  const breakingNews = getBreakingNews();

  if (breakingNews.length === 0) return null;

  return (
    <div className="bg-primary text-primary-foreground py-2 overflow-hidden">
      <div className="container flex items-center gap-3">
        <div className="flex items-center gap-2 flex-shrink-0 px-3 py-1 bg-news-red-dark rounded">
          <Zap size={16} className="animate-pulse" />
          <span className="font-bold text-sm whitespace-nowrap">ब्रेकिंग न्यूज़</span>
        </div>
        <div className="breaking-ticker flex-1">
          <div className="breaking-ticker-content">
            {breakingNews.map((news, index) => (
              <span key={news.id} className="inline-block">
                {news.title}
                {index < breakingNews.length - 1 && (
                  <span className="mx-4 text-primary-foreground/50">•</span>
                )}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BreakingNewsTicker;
