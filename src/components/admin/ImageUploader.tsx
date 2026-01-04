import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, X, Image as ImageIcon, Link } from 'lucide-react';
import { toast } from 'sonner';

interface ImageUploaderProps {
  value?: string | string[];
  onChange: (value: string | string[]) => void;
  multiple?: boolean;
  label?: string;
  maxImages?: number;
}

const ImageUploader = ({
  value,
  onChange,
  multiple = false,
  label = 'इमेज अपलोड करें',
  maxImages = 10,
}: ImageUploaderProps) => {
  const [dragActive, setDragActive] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const images = Array.isArray(value) ? value : value ? [value] : [];
  
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };
  
  const handleFiles = (files: FileList) => {
    const newImages: string[] = [];
    
    Array.from(files).forEach((file) => {
      if (!file.type.startsWith('image/')) {
        toast.error('केवल इमेज फाइलें अपलोड करें');
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        toast.error('फाइल 5MB से छोटी होनी चाहिए');
        return;
      }
      
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result as string;
        newImages.push(base64);
        
        if (newImages.length === files.length) {
          updateImages(newImages);
        }
      };
      reader.readAsDataURL(file);
    });
  };
  
  const updateImages = (newImages: string[]) => {
    if (multiple) {
      const combined = [...images, ...newImages].slice(0, maxImages);
      onChange(combined);
    } else {
      onChange(newImages[0]);
    }
  };
  
  const handleAddUrl = () => {
    if (!urlInput.trim()) return;
    
    if (!urlInput.startsWith('http://') && !urlInput.startsWith('https://')) {
      toast.error('कृपया वैध URL दर्ज करें');
      return;
    }
    
    if (multiple) {
      onChange([...images, urlInput].slice(0, maxImages));
    } else {
      onChange(urlInput);
    }
    
    setUrlInput('');
    setShowUrlInput(false);
    toast.success('इमेज URL जोड़ी गई');
  };
  
  const handleRemove = (index: number) => {
    if (multiple) {
      const newImages = images.filter((_, i) => i !== index);
      onChange(newImages);
    } else {
      onChange('');
    }
  };
  
  return (
    <div className="space-y-3">
      <Label>{label}</Label>
      
      {/* Image Preview Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
          {images.map((img, index) => (
            <div key={index} className="relative aspect-square group">
              <img
                src={img}
                alt={`Upload ${index + 1}`}
                className="w-full h-full object-cover rounded-lg border"
              />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => handleRemove(index)}
              >
                <X size={14} />
              </Button>
            </div>
          ))}
        </div>
      )}
      
      {/* Upload Area */}
      {(multiple ? images.length < maxImages : images.length === 0) && (
        <div
          className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
            dragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple={multiple}
            onChange={handleChange}
            className="hidden"
          />
          
          <div className="flex flex-col items-center gap-2">
            <div className="p-3 bg-muted rounded-full">
              <Upload size={24} className="text-muted-foreground" />
            </div>
            <div>
              <p className="font-medium">इमेज यहां खींचें और छोड़ें</p>
              <p className="text-sm text-muted-foreground">या</p>
            </div>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => inputRef.current?.click()}
              >
                <ImageIcon size={16} className="mr-2" />
                फाइल चुनें
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowUrlInput(!showUrlInput)}
              >
                <Link size={16} className="mr-2" />
                URL से जोड़ें
              </Button>
            </div>
          </div>
        </div>
      )}
      
      {/* URL Input */}
      {showUrlInput && (
        <div className="flex gap-2">
          <Input
            type="url"
            placeholder="https://example.com/image.jpg"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
          />
          <Button type="button" onClick={handleAddUrl}>
            जोड़ें
          </Button>
        </div>
      )}
      
      <p className="text-xs text-muted-foreground">
        अधिकतम साइज: 5MB | फॉर्मेट: JPG, PNG, GIF, WebP
        {multiple && ` | अधिकतम ${maxImages} इमेज`}
      </p>
    </div>
  );
};

export default ImageUploader;
