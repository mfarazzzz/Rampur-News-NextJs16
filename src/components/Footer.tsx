import { Link } from "react-router-dom";
import { Facebook, Twitter, Youtube, Instagram, Mail, Phone, MapPin, Settings, MessageCircle, Send } from "lucide-react";
import { categories } from "@/data/categories";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-news-dark text-primary-foreground mt-12">
      {/* WhatsApp & Telegram CTA Bar */}
      <div className="bg-gradient-to-r from-[#25D366] to-[#0088cc] py-4">
        <div className="container">
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 text-white">
            <span className="font-medium">ताज़ा खबरों के लिए हमसे जुड़ें:</span>
            <div className="flex gap-3">
              <a
                href="https://whatsapp.com/channel/rampurnews"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-full transition-colors"
              >
                <MessageCircle size={18} />
                <span>WhatsApp चैनल</span>
              </a>
              <a
                href="https://t.me/rampurnews"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-full transition-colors"
              >
                <Send size={18} />
                <span>Telegram चैनल</span>
              </a>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Footer */}
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About Section */}
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="bg-primary text-primary-foreground px-2 py-1 rounded">
                <span className="text-xl font-bold">रामपुर</span>
              </div>
              <span className="text-xl font-bold">न्यूज़</span>
            </Link>
            <p className="text-sm text-gray-300 mb-4 leading-relaxed">
              रामपुर न्यूज़ आपके लिए लाता है रामपुर, उत्तर प्रदेश और देश-विदेश की ताज़ा और विश्वसनीय खबरें। हम पत्रकारिता के उच्चतम मानकों का पालन करते हैं।
            </p>
            <div className="flex gap-3">
              <a
                href="https://whatsapp.com/channel/rampurnews"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 flex items-center justify-center bg-[#25D366] hover:bg-[#20BD5A] rounded-full transition-colors"
                aria-label="WhatsApp"
              >
                <MessageCircle size={18} />
              </a>
              <a
                href="https://t.me/rampurnews"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 flex items-center justify-center bg-[#0088cc] hover:bg-[#007AB8] rounded-full transition-colors"
                aria-label="Telegram"
              >
                <Send size={18} />
              </a>
              <a
                href="#"
                className="w-9 h-9 flex items-center justify-center bg-primary/20 hover:bg-primary rounded-full transition-colors"
                aria-label="Facebook"
              >
                <Facebook size={18} />
              </a>
              <a
                href="#"
                className="w-9 h-9 flex items-center justify-center bg-primary/20 hover:bg-primary rounded-full transition-colors"
                aria-label="Twitter"
              >
                <Twitter size={18} />
              </a>
              <a
                href="#"
                className="w-9 h-9 flex items-center justify-center bg-primary/20 hover:bg-primary rounded-full transition-colors"
                aria-label="Youtube"
              >
                <Youtube size={18} />
              </a>
              <a
                href="#"
                className="w-9 h-9 flex items-center justify-center bg-primary/20 hover:bg-primary rounded-full transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={18} />
              </a>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-lg font-bold mb-4 border-b border-primary pb-2">श्रेणियां</h3>
            <ul className="space-y-2">
              {categories.slice(0, 7).map((cat) => (
                <li key={cat.id}>
                  <Link
                    to={cat.path}
                    className="text-sm text-gray-300 hover:text-primary transition-colors"
                  >
                    {cat.titleHindi}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* More Categories */}
          <div>
            <h3 className="text-lg font-bold mb-4 border-b border-primary pb-2">अन्य श्रेणियां</h3>
            <ul className="space-y-2">
              {categories.slice(7).map((cat) => (
                <li key={cat.id}>
                  <Link
                    to={cat.path}
                    className="text-sm text-gray-300 hover:text-primary transition-colors"
                  >
                    {cat.titleHindi}
                  </Link>
                </li>
              ))}
              <li>
                <Link to="/about" className="text-sm text-gray-300 hover:text-primary transition-colors">
                  हमारे बारे में
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-sm text-gray-300 hover:text-primary transition-colors">
                  संपर्क करें
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-sm text-gray-300 hover:text-primary transition-colors">
                  गोपनीयता नीति
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-bold mb-4 border-b border-primary pb-2">संपर्क</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm text-gray-300">
                <MapPin size={18} className="text-primary flex-shrink-0 mt-0.5" />
                <span>रामपुर, उत्तर प्रदेश, भारत - 244901</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-300">
                <Phone size={18} className="text-primary flex-shrink-0" />
                <a href="tel:+911234567890" className="hover:text-primary transition-colors">
                  +91 12345 67890
                </a>
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-300">
                <Mail size={18} className="text-primary flex-shrink-0" />
                <a href="mailto:contact@rampurnews.com" className="hover:text-primary transition-colors">
                  contact@rampurnews.com
                </a>
              </li>
            </ul>

            {/* Newsletter */}
            <div className="mt-6">
              <h4 className="text-sm font-semibold mb-2">न्यूज़लेटर</h4>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="ईमेल दर्ज करें"
                  className="flex-1 px-3 py-2 text-sm bg-white/10 rounded border border-white/20 focus:outline-none focus:border-primary placeholder:text-gray-400"
                />
                <button className="px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded hover:bg-news-red-dark transition-colors">
                  जुड़ें
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="container py-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-400">
            <p>© {currentYear} रामपुर न्यूज़। सर्वाधिकार सुरक्षित।</p>
            <div className="flex gap-4 items-center">
              <Link to="/terms" className="hover:text-primary transition-colors">
                नियम और शर्तें
              </Link>
              <Link to="/privacy" className="hover:text-primary transition-colors">
                गोपनीयता नीति
              </Link>
              <Link to="/disclaimer" className="hover:text-primary transition-colors">
                अस्वीकरण
              </Link>
              <Link to="/admin" className="flex items-center gap-1 hover:text-primary transition-colors">
                <Settings size={14} />
                Admin
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
