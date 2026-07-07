import React, { useState, useRef } from 'react';
import { Upload, Loader2, MoveUp, MoveDown, Trash2 } from 'lucide-react';
import { resolveProductImage } from '../../lib/imageResolver';

interface AdminImageUploaderProps {
  images: string[];
  onChange: (images: string[]) => void;
  category: string;
}

export default function AdminImageUploader({ images = [], onChange, category }: AdminImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    if (!category) {
      alert('Please set a category for the product before uploading images.');
      return;
    }

    const files = Array.from(e.target.files);
    const formData = new FormData();
    files.forEach(file => formData.append('file', file));
    formData.append('category', category);
    formData.append('type', 'product');

    setUploading(true);
    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      
      if (data.success) {
        const newUrls = data.data.map((file: any) => file.url);
        onChange([...images, ...newUrls]);
      } else {
        alert(data.error || 'Upload failed');
      }
    } catch (error) {
      console.error(error);
      alert('Upload failed');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const moveUp = (idx: number) => {
    if (idx === 0) return;
    const newImages = [...images];
    [newImages[idx - 1], newImages[idx]] = [newImages[idx], newImages[idx - 1]];
    onChange(newImages);
  };

  const moveDown = (idx: number) => {
    if (idx === images.length - 1) return;
    const newImages = [...images];
    [newImages[idx + 1], newImages[idx]] = [newImages[idx], newImages[idx + 1]];
    onChange(newImages);
  };

  const makePrimary = (idx: number) => {
    if (idx === 0) return;
    const newImages = [...images];
    const item = newImages.splice(idx, 1)[0];
    newImages.unshift(item);
    onChange(newImages);
  };

  const remove = (idx: number) => {
    if (window.confirm('Remove this image from the product? (This will not delete the file from storage)')) {
      const newImages = images.filter((_, i) => i !== idx);
      onChange(newImages);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <label className="text-[10px] uppercase tracking-[0.3em] font-black text-brand-gold">Image Assets</label>
        
        <div>
          <input 
            type="file" 
            multiple 
            accept="image/jpeg,image/png,image/webp" 
            className="hidden" 
            ref={fileInputRef}
            onChange={handleFileChange}
          />
          <button 
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="text-[10px] font-bold bg-[#5d463c] hover:bg-[#4c3931] text-[#efe7e5] py-2 px-4 rounded-full uppercase tracking-widest flex items-center space-x-2 transition-colors disabled:opacity-50 cursor-pointer shadow-sm"
          >
            {uploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
            <span>Upload Images</span>
          </button>
        </div>
      </div>
      
      <p className="text-[10px] text-brand-text/50 uppercase tracking-widest mt-0">
        Requires Category to be set. PNG, JPG, WEBP up to 5MB. Will automatically convert to optimized WEBP.
      </p>

      {images.length === 0 && !uploading && (
        <div className="border-2 border-dashed border-brand-text/20 dark:border-white/20 rounded-3xl p-12 text-center text-brand-text/50 dark:text-white/50">
          No images added yet. Click upload to select files.
        </div>
      )}

      {images.length > 0 && (
        <div className="grid grid-cols-1 gap-4">
          {images.map((img: string, idx: number) => (
            <div key={idx} className="flex items-center space-x-4 p-4 bg-slate-50 dark:bg-white/5 rounded-2xl group border border-brand-text/10 hover:border-[#5d463c]/20 transition-all shadow-sm">
              <div className="w-24 h-24 rounded-2xl bg-white flex items-center justify-center overflow-hidden border border-slate-200 shrink-0 shadow-inner">
                <img 
                  src={resolveProductImage(img)} 
                  className="w-full h-full object-contain p-1 transition-transform duration-500 group-hover:scale-125" 
                  alt="Product" 
                />
              </div>
              
              <div className="flex-1 overflow-hidden">
                <p className="text-[12px] font-medium truncate text-brand-text dark:text-white" title={img}>{img}</p>
                <div className="flex items-center space-x-2 mt-1">
                  {idx === 0 ? (
                    <span className="text-[9px] uppercase tracking-widest font-bold bg-[#5d463c] text-[#efe7e5] px-2 py-0.5 rounded-full">Primary</span>
                  ) : (
                    <button type="button" onClick={() => makePrimary(idx)} className="text-[9px] uppercase tracking-widest font-bold text-brand-text/50 hover:text-[#5d463c] transition-colors cursor-pointer">Make Primary</button>
                  )}
                </div>
              </div>
              
              <div className="flex items-center space-x-1">
                <button type="button" onClick={() => moveUp(idx)} disabled={idx === 0} className="p-2 text-brand-text/40 hover:text-[#5d463c] transition-colors disabled:opacity-20 cursor-pointer"><MoveUp size={14} /></button>
                <button type="button" onClick={() => moveDown(idx)} disabled={idx === images.length - 1} className="p-2 text-brand-text/40 hover:text-[#5d463c] transition-colors disabled:opacity-20 cursor-pointer"><MoveDown size={14} /></button>
                <button type="button" onClick={() => remove(idx)} className="p-2 text-brand-text/40 hover:text-red-500 transition-colors cursor-pointer"><Trash2 size={14} /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
