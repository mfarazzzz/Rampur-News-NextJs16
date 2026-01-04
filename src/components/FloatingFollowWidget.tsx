import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { MessageCircle, Send, X, ChevronUp } from 'lucide-react';

interface FloatingFollowWidgetProps {
  whatsappChannel?: string;
  telegramChannel?: string;
}

const FloatingFollowWidget = ({
  whatsappChannel = 'https://whatsapp.com/channel/your-channel',
  telegramChannel = 'https://t.me/rampurnews',
}: FloatingFollowWidgetProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 300);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  if (!isVisible) return null;
  
  return (
    <div className="fixed bottom-4 left-4 z-50 flex flex-col gap-2">
      {isExpanded && (
        <div className="bg-background rounded-lg shadow-xl border p-4 space-y-3 animate-in slide-in-from-bottom-2">
          <div className="flex items-center justify-between">
            <span className="font-semibold">हमसे जुड़ें</span>
            <Button 
              size="icon" 
              variant="ghost" 
              className="h-6 w-6"
              onClick={() => setIsExpanded(false)}
            >
              <X size={14} />
            </Button>
          </div>
          
          <a
            href={whatsappChannel}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-3 rounded-lg bg-[#25D366] text-white hover:bg-[#20BD5A] transition-colors"
          >
            <MessageCircle size={24} />
            <div>
              <p className="font-medium">WhatsApp चैनल</p>
              <p className="text-xs opacity-90">ताज़ा खबरें पाएं</p>
            </div>
          </a>
          
          <a
            href={telegramChannel}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-3 rounded-lg bg-[#0088cc] text-white hover:bg-[#007AB8] transition-colors"
          >
            <Send size={24} />
            <div>
              <p className="font-medium">Telegram चैनल</p>
              <p className="text-xs opacity-90">अपडेट्स के लिए जुड़ें</p>
            </div>
          </a>
        </div>
      )}
      
      <Button
        onClick={() => setIsExpanded(!isExpanded)}
        className="rounded-full h-14 w-14 bg-primary hover:bg-primary/90 shadow-lg"
      >
        {isExpanded ? (
          <ChevronUp size={24} />
        ) : (
          <MessageCircle size={24} />
        )}
      </Button>
    </div>
  );
};

export default FloatingFollowWidget;
