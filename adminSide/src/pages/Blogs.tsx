import React, { useState, useEffect, useRef } from 'react';
import { 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Eye, 
  Loader2, 
  FileText, 
  Upload,
  Clock, 
  Sparkles,
  ArrowLeft,
  Link as LinkIcon,
  Minus,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Quote,
  Send,
  Image as ImageIcon,
  Sliders,
  Key,
  Lock,
  UserCheck
} from 'lucide-react';

interface BlogPost {
  _id?: string;
  title: string;
  slug: string;
  category: string;
  tags: string[];
  excerpt: string;
  content: string | any;
  image: string;
  date: string;
  readTime: string;
  author: string;
  isPublished: boolean;
  createdAt?: string;
}

interface BlogAccessUser {
  _id?: string;
  email: string;
  username: string;
  name: string;
  isActive: boolean;
  role: string;
}

const CATEGORIES_LIST = [
  "Digital Marketing",
  "GOLD DAILY WEAR",
  "DIAMOND RINGS",
  "BRIDAL STYLING",
  "GOLD INVESTMENT",
  "GOLD EXCHANGE",
  "STYLING PENDANTS",
  "TRENDING JEWELLERY"
];

const TEXT_COLORS = [
  { label: 'Black', value: '#12100e' },
  { label: 'Brown', value: '#5d463c' },
  { label: 'Gold', value: '#C5A880' },
  { label: 'Dark Gray', value: '#4b5563' },
  { label: 'Blue', value: '#2563eb' },
  { label: 'Red', value: '#ef4444' },
  { label: 'Orange', value: '#f97316' },
  { label: 'Green', value: '#10b981' }
];

const HIGHLIGHT_COLORS = [
  { label: 'None', value: 'transparent' },
  { label: 'Gold Cream', value: '#fcf8f2' },
  { label: 'Yellow', value: '#fef08a' },
  { label: 'Green', value: '#bbf7d0' },
  { label: 'Blue', value: '#bfdbfe' },
  { label: 'Pink', value: '#fbcfe8' }
];

interface BlogsProps {
  userRole?: string;
}

export default function Blogs({ userRole }: BlogsProps) {
  const isWriter = userRole === 'blog_writer' || localStorage.getItem('userRole') === 'blog_writer';

  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterCategory, setFilterCategory] = useState<string>('All');

  // View Mode: 'list' (Dashboard) | 'editor' (Create/Edit Form)
  const [viewMode, setViewMode] = useState<'list' | 'editor'>('list');
  // Editor Tab: 'ms-word' (MS Word Editor) | 'preview' (Reader Preview)
  const [editorTab, setEditorTab] = useState<'ms-word' | 'preview'>('ms-word');

  // Currently Editing Blog Object
  const [editingBlog, setEditingBlog] = useState<BlogPost | null>(null);
  const [saving, setSaving] = useState<boolean>(false);
  const [uploadingImage, setUploadingImage] = useState<boolean>(false);

  // Form Fields
  const [formTitle, setFormTitle] = useState('');
  const [formExcerpt, setFormExcerpt] = useState('');
  const [formSlug, setFormSlug] = useState('');
  const [formCategory, setFormCategory] = useState('GOLD DAILY WEAR');
  const [formStatus, setFormStatus] = useState('Published (Public)');
  const [formTags, setFormTags] = useState('Gold, Daily Wear, Jewellery');
  const [formImage, setFormImage] = useState('https://images.unsplash.com/photo-1588444837495-c6cfeb53f32d?auto=format&fit=crop&q=80&w=1200');
  const [formReadTime, setFormReadTime] = useState('5 min read');
  const [formAuthor, setFormAuthor] = useState('Zoniraz Team');

  // Access Credentials Management Modal State
  const [showAccessModal, setShowAccessModal] = useState<boolean>(false);
  const [writerEmail, setWriterEmail] = useState('');
  const [writerUsername, setWriterUsername] = useState('');
  const [writerPassword, setWriterPassword] = useState('');
  const [writerName, setWriterName] = useState('Blog Writer');
  const [savingAccess, setSavingAccess] = useState<boolean>(false);
  const [existingWriters, setExistingWriters] = useState<BlogAccessUser[]>([]);

  // Rich Text Editor Ref & State
  const editorRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fontFamily, setFontFamily] = useState('Inter');
  const [fontSize, setFontSize] = useState('16px');
  const [htmlContent, setHtmlContent] = useState('');

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/blogs');
      const data = await res.json();
      if (data.success) {
        setBlogs(data.data || []);
      }
    } catch (error) {
      console.error('API Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBlogAccessList = async () => {
    try {
      const res = await fetch('/api/admin/blogs/access');
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setExistingWriters(data.data);
        if (data.data.length > 0) {
          const first = data.data[0];
          setWriterEmail(first.email || '');
          setWriterUsername(first.username || '');
          setWriterName(first.name || 'Blog Writer');
        }
      }
    } catch (err) {
      console.error('Error fetching blog access:', err);
    }
  };

  useEffect(() => {
    fetchBlogs();
    fetchBlogAccessList();
  }, []);

  // Synchronize HTML content to contentEditable area when switching to editor view
  useEffect(() => {
    if (viewMode === 'editor' && editorTab === 'ms-word' && editorRef.current) {
      if (editorRef.current.innerHTML !== htmlContent) {
        editorRef.current.innerHTML = htmlContent || '';
      }
    }
  }, [viewMode, editorTab]);

  const handleOpenCreate = () => {
    setEditingBlog(null);
    setFormTitle('');
    setFormExcerpt('');
    setFormSlug('');
    setFormCategory('GOLD DAILY WEAR');
    setFormStatus('Published (Public)');
    setFormTags('Gold, Daily Wear, Jewellery');
    setFormImage('https://images.unsplash.com/photo-1588444837495-c6cfeb53f32d?auto=format&fit=crop&q=80&w=1200');
    setFormReadTime('5 min read');
    setFormAuthor('Zoniraz Team');
    setHtmlContent('<p>Write your engaging blog post here...</p>');
    setEditorTab('ms-word');
    setViewMode('editor');
  };

  const handleOpenEdit = (blog: BlogPost) => {
    setEditingBlog(blog);
    setFormTitle(blog.title);
    setFormExcerpt(blog.excerpt || '');
    setFormSlug(blog.slug || '');
    setFormCategory(blog.category || 'GOLD DAILY WEAR');
    setFormStatus(blog.isPublished ? 'Published (Public)' : 'Draft (Private)');
    setFormTags(Array.isArray(blog.tags) ? blog.tags.join(', ') : blog.tags || '');
    setFormImage(blog.image || 'https://images.unsplash.com/photo-1588444837495-c6cfeb53f32d?auto=format&fit=crop&q=80&w=1200');
    setFormReadTime(blog.readTime || '5 min read');
    setFormAuthor(blog.author || 'Zoniraz Team');

    // Convert content object/array or string into HTML
    let initialHtml = '';
    if (typeof blog.content === 'string') {
      initialHtml = blog.content;
    } else if (Array.isArray(blog.content)) {
      initialHtml = blog.content.map((block: any) => {
        if (block.type === 'intro') return `<div class="blog-intro" style="padding:16px; background:#f8fafc; border-left:4px solid #5d463c; margin-bottom:16px;">${block.text}</div>`;
        if (block.type === 'heading') return `<h2 style="font-size:22px; font-weight:bold; color:#5d463c; margin-top:20px; margin-bottom:10px;">${block.text}</h2>`;
        if (block.type === 'tip') return `<blockquote style="padding:12px; background:#fcf8f2; border-left:4px solid #C5A880; margin:16px 0;"><strong>Pro Tip:</strong> ${block.text}</blockquote>`;
        return `<p style="margin-bottom:12px; line-height:1.7;">${block.text}</p>`;
      }).join('');
    }
    setHtmlContent(initialHtml || '<p>Write your engaging blog post here...</p>');
    setEditorTab('ms-word');
    setViewMode('editor');
  };

  const handleTitleChange = (val: string) => {
    setFormTitle(val);
    if (!editingBlog) {
      const generatedSlug = val.toLowerCase().trim().replace(/[\s\W-]+/g, '-');
      setFormSlug(generatedSlug);
    }
  };

  // ── Executive Rich Text Formatting Commands ─────────────────────────────
  const execCommand = (command: string, value: string | undefined = undefined) => {
    if (!editorRef.current) return;
    editorRef.current.focus();
    document.execCommand(command, false, value);
    setHtmlContent(editorRef.current.innerHTML);
  };

  const handleApplyFontFamily = (family: string) => {
    setFontFamily(family);
    execCommand('fontName', family);
  };

  const handleApplyFontSize = (sizeStr: string) => {
    setFontSize(sizeStr);
    let sizeVal = '3';
    if (sizeStr === '12px') sizeVal = '1';
    if (sizeStr === '14px') sizeVal = '2';
    if (sizeStr === '16px') sizeVal = '3';
    if (sizeStr === '18px') sizeVal = '4';
    if (sizeStr === '24px') sizeVal = '5';
    if (sizeStr === '32px') sizeVal = '6';
    execCommand('fontSize', sizeVal);
  };

  const handleApplyBlock = (tag: string) => {
    execCommand('formatBlock', tag);
  };

  const handleInsertLink = () => {
    const url = prompt('Enter Destination URL:', 'https://');
    if (url) {
      execCommand('createLink', url);
    }
  };

  const handleInsertInlineImage = () => {
    const url = prompt('Enter Image URL to insert into article:', 'https://images.unsplash.com/');
    if (url) {
      execCommand('insertImage', url);
    }
  };

  const handleHeaderImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('file', file);
    formData.append('category', formCategory || 'blogs');

    setUploadingImage(true);
    try {
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (data.success && data.data && data.data.length > 0) {
        setFormImage(data.data[0].url);
      } else {
        alert(data.error || 'Failed to upload header image.');
      }
    } catch (err) {
      console.error(err);
      alert('Upload failed.');
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSaveArticle = async () => {
    if (!formTitle.trim()) {
      alert('Please enter an Article Title');
      return;
    }

    setSaving(true);
    const currentEditorContent = editorRef.current ? editorRef.current.innerHTML : htmlContent;
    const isPub = formStatus === 'Published (Public)';
    const parsedTags = formTags.split(',').map(t => t.trim()).filter(Boolean);

    const payload = {
      title: formTitle,
      slug: formSlug || formTitle.toLowerCase().trim().replace(/[\s\W-]+/g, '-'),
      category: formCategory,
      tags: parsedTags,
      excerpt: formExcerpt,
      content: currentEditorContent,
      image: formImage,
      readTime: formReadTime,
      author: formAuthor,
      isPublished: isPub
    };

    try {
      const url = editingBlog ? `/api/admin/blogs/${editingBlog._id}` : '/api/admin/blogs';
      const method = editingBlog ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (data.success) {
        alert(editingBlog ? 'Article updated successfully! Sitemap auto-regenerated.' : 'Article published! Sitemap auto-regenerated.');
        setViewMode('list');
        fetchBlogs();
      } else {
        alert(data.message || 'Failed to publish article.');
      }
    } catch (err) {
      console.error(err);
      alert('Error occurred while saving article.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteBlog = async (id: string, title: string) => {
    if (!window.confirm(`Permanently delete "${title}"? This will update the sitemap.`)) return;
    try {
      const res = await fetch(`/api/admin/blogs/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        fetchBlogs();
      } else {
        alert(data.message || 'Failed to delete blog.');
      }
    } catch (err) {
      console.error(err);
      alert('Failed to delete blog.');
    }
  };

  const handleSaveBlogWriterAccess = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!writerEmail.trim() || !writerPassword.trim()) {
      alert('Please enter both Username/Email and Password for the Blog Writer account.');
      return;
    }

    setSavingAccess(true);
    try {
      const res = await fetch('/api/admin/blogs/access', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: writerEmail,
          username: writerUsername || writerEmail.split('@')[0],
          password: writerPassword,
          name: writerName || 'Blog Writer',
          isActive: true
        })
      });

      const data = await res.json();
      if (data.success) {
        alert(`Blog Writer access credentials configured successfully!\n\nUsername/Email: ${writerEmail}\nPassword: ${writerPassword}`);
        setShowAccessModal(false);
        setWriterPassword('');
        fetchBlogAccessList();
      } else {
        alert(data.message || 'Failed to set credentials.');
      }
    } catch (err) {
      console.error(err);
      alert('Failed to update blog access credentials.');
    } finally {
      setSavingAccess(false);
    }
  };

  const filteredBlogs = blogs.filter(b => {
    const matchesSearch = b.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          b.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = filterCategory === 'All' || b.category.toUpperCase() === filterCategory.toUpperCase();
    return matchesSearch && matchesCat;
  });

  return (
    <div className="min-h-screen bg-[#efe7e5] text-[#12100e] font-sans p-2 md:p-6 antialiased">
      
      {/* ── EDITOR VIEW (Zoniraz Warm Theme Matching Original Admin) ───────── */}
      {viewMode === 'editor' ? (
        <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-300">
          
          {/* Top Control Header Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 bg-white/90 backdrop-blur-md p-4 rounded-3xl border border-slate-200/80 shadow-sm">
            <div className="flex items-center space-x-3">
              <button 
                onClick={() => setViewMode('list')}
                className="p-2.5 bg-[#efe7e5] hover:bg-slate-200 text-[#5d463c] rounded-2xl transition-colors cursor-pointer"
                title="Back to Journal List"
              >
                <ArrowLeft size={18} />
              </button>

              {/* View Switcher Pills */}
              <div className="flex items-center bg-[#efe7e5] p-1 rounded-2xl">
                <button
                  type="button"
                  onClick={() => setEditorTab('ms-word')}
                  className={`flex items-center space-x-2 px-5 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                    editorTab === 'ms-word' 
                      ? 'bg-[#5d463c] text-[#efe7e5] shadow-sm' 
                      : 'text-[#5d463c]/70 hover:text-[#5d463c]'
                  }`}
                >
                  <Edit3 size={14} />
                  <span>MS Word Editor</span>
                </button>
                <button
                  type="button"
                  onClick={() => setEditorTab('preview')}
                  className={`flex items-center space-x-2 px-5 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                    editorTab === 'preview' 
                      ? 'bg-[#5d463c] text-[#efe7e5] shadow-sm' 
                      : 'text-[#5d463c]/70 hover:text-[#5d463c]'
                  }`}
                >
                  <Eye size={14} />
                  <span>Reader Preview</span>
                </button>
              </div>
            </div>

            {/* Primary Action Button */}
            <button
              onClick={handleSaveArticle}
              disabled={saving}
              className="px-8 py-3 bg-[#5d463c] hover:bg-[#4c3931] text-[#efe7e5] font-bold text-xs uppercase tracking-widest rounded-2xl shadow-md flex items-center space-x-2 transition-all cursor-pointer disabled:opacity-50"
            >
              {saving ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
              <span>{editingBlog ? 'Update Article' : 'Publish Article'}</span>
            </button>
          </div>

          {/* READER PREVIEW MODE */}
          {editorTab === 'preview' ? (
            <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm max-w-4xl mx-auto space-y-8 border border-slate-200/80">
              <div className="space-y-4">
                <span className="px-3.5 py-1 bg-[#efe7e5] text-[#5d463c] rounded-full text-[10px] font-black uppercase tracking-widest border border-[#5d463c]/20">
                  {formCategory}
                </span>
                <h1 className="text-3xl md:text-5xl font-serif font-bold text-[#12100e] leading-tight">
                  {formTitle || 'Untitled Blog Article'}
                </h1>
                {formExcerpt && (
                  <p className="text-lg text-slate-600 font-serif italic leading-relaxed border-l-4 border-[#5d463c] pl-4 py-1">
                    {formExcerpt}
                  </p>
                )}
                <div className="flex items-center space-x-4 text-xs text-slate-400 border-b border-slate-100 pb-6 pt-2">
                  <span>✍️ {formAuthor}</span>
                  <span>•</span>
                  <span>⏱️ {formReadTime}</span>
                  <span>•</span>
                  <span>📅 {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                </div>
              </div>

              {formImage && (
                <div className="w-full h-80 md:h-[420px] rounded-3xl overflow-hidden shadow-md">
                  <img src={formImage} alt={formTitle} className="w-full h-full object-cover" />
                </div>
              )}

              <div 
                className="prose prose-stone max-w-none text-slate-800 leading-relaxed font-sans text-base"
                dangerouslySetInnerHTML={{ __html: editorRef.current ? editorRef.current.innerHTML : htmlContent }}
              />
            </div>
          ) : (
            /* MS WORD EDITOR FORM MODE */
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Left 2 Columns: Title/Summary + MS Word Editor */}
              <div className="lg:col-span-2 space-y-6">
                
                {/* Article Header Details Card */}
                <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200/80 shadow-sm space-y-5">
                  <div>
                    <label className="block text-[10px] uppercase tracking-[0.2em] font-black text-[#5d463c] mb-2">
                      Article Title *
                    </label>
                    <input 
                      type="text" 
                      value={formTitle}
                      onChange={(e) => handleTitleChange(e.target.value)}
                      placeholder="Enter powerful blog title here..."
                      className="w-full bg-[#f8fafc] border border-slate-200 rounded-2xl px-5 py-4 text-base md:text-lg font-serif font-bold text-[#12100e] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#5d463c]/40 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase tracking-[0.2em] font-black text-[#5d463c] mb-2">
                      Subheading / Brief Summary
                    </label>
                    <input 
                      type="text" 
                      value={formExcerpt}
                      onChange={(e) => setFormExcerpt(e.target.value)}
                      placeholder="Brief excerpt or sub-headline..."
                      className="w-full bg-[#f8fafc] border border-slate-200 rounded-2xl px-5 py-3.5 text-xs md:text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#5d463c]/40 transition-all"
                    />
                  </div>
                </div>

                {/* MS Word Style Content Editor Card */}
                <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200/80 shadow-sm space-y-5">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                    <div className="flex items-center space-x-2">
                      <Sparkles size={16} className="text-[#5d463c]" />
                      <span className="text-[11px] uppercase tracking-[0.2em] font-black text-[#5d463c]">
                        MS Word Style Content Editor
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={handleInsertInlineImage}
                      className="text-[10px] uppercase tracking-wider font-bold text-[#efe7e5] bg-[#5d463c] hover:bg-[#4c3931] px-3.5 py-2 rounded-xl transition-colors flex items-center space-x-1.5 cursor-pointer shadow-sm"
                    >
                      <Upload size={13} />
                      <span>Insert Image into Article</span>
                    </button>
                  </div>

                  {/* Rich MS Word Style Toolbar */}
                  <div className="bg-[#f8fafc] p-3 rounded-2xl border border-slate-200/80 space-y-3">
                    
                    {/* Row 1: Font Family, Size, Typography Blocks */}
                    <div className="flex flex-wrap items-center gap-2 border-b border-slate-200/60 pb-3">
                      
                      {/* Font Family Dropdown */}
                      <select 
                        value={fontFamily}
                        onChange={(e) => handleApplyFontFamily(e.target.value)}
                        className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-700 outline-none cursor-pointer"
                      >
                        <option value="Inter">Default (Inter)</option>
                        <option value="Playfair Display">Playfair Display</option>
                        <option value="Montserrat">Montserrat</option>
                        <option value="Georgia">Georgia</option>
                        <option value="Roboto">Roboto</option>
                        <option value="Courier New">Courier New</option>
                      </select>

                      {/* Font Size Dropdown */}
                      <select 
                        value={fontSize}
                        onChange={(e) => handleApplyFontSize(e.target.value)}
                        className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-700 outline-none cursor-pointer"
                      >
                        <option value="12px">12px (Small)</option>
                        <option value="14px">14px (Regular)</option>
                        <option value="16px">16px (Medium)</option>
                        <option value="18px">18px (Large)</option>
                        <option value="24px">24px (Title)</option>
                        <option value="32px">32px (Headline)</option>
                      </select>

                      <div className="h-4 w-px bg-slate-300 mx-1"></div>

                      {/* Paragraph & Headings Quick Blocks */}
                      <button type="button" onClick={() => handleApplyBlock('P')} className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-xs font-black text-slate-700 cursor-pointer">P</button>
                      <button type="button" onClick={() => handleApplyBlock('H1')} className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-xs font-black text-[#5d463c] cursor-pointer">H1</button>
                      <button type="button" onClick={() => handleApplyBlock('H2')} className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-xs font-black text-[#5d463c] cursor-pointer">H2</button>
                      <button type="button" onClick={() => handleApplyBlock('H3')} className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-xs font-black text-[#5d463c] cursor-pointer">H3</button>
                      <button type="button" onClick={() => handleApplyBlock('BLOCKQUOTE')} className="p-1.5 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-slate-700 cursor-pointer" title="Blockquote"><Quote size={13} /></button>
                    </div>

                    {/* Row 2: B, I, U, S, Alignments, Lists, Link, Colors */}
                    <div className="flex flex-wrap items-center gap-2">
                      
                      {/* B, I, U, S */}
                      <button type="button" onClick={() => execCommand('bold')} className="w-8 h-8 font-black bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-xs text-slate-800 flex items-center justify-center cursor-pointer">B</button>
                      <button type="button" onClick={() => execCommand('italic')} className="w-8 h-8 italic font-serif bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-xs text-slate-800 flex items-center justify-center cursor-pointer">I</button>
                      <button type="button" onClick={() => execCommand('underline')} className="w-8 h-8 underline bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-xs text-slate-800 flex items-center justify-center cursor-pointer">U</button>
                      <button type="button" onClick={() => execCommand('strikeThrough')} className="w-8 h-8 line-through bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-xs text-slate-800 flex items-center justify-center cursor-pointer">S</button>

                      <div className="h-4 w-px bg-slate-300 mx-1"></div>

                      {/* Alignments */}
                      <button type="button" onClick={() => execCommand('justifyLeft')} className="p-2 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-slate-700 cursor-pointer" title="Align Left"><AlignLeft size={13} /></button>
                      <button type="button" onClick={() => execCommand('justifyCenter')} className="p-2 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-slate-700 cursor-pointer" title="Align Center"><AlignCenter size={13} /></button>
                      <button type="button" onClick={() => execCommand('justifyRight')} className="p-2 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-slate-700 cursor-pointer" title="Align Right"><AlignRight size={13} /></button>
                      <button type="button" onClick={() => execCommand('justifyFull')} className="p-2 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-slate-700 cursor-pointer" title="Justify"><AlignJustify size={13} /></button>

                      <div className="h-4 w-px bg-slate-300 mx-1"></div>

                      {/* Lists & Link */}
                      <button type="button" onClick={() => execCommand('insertUnorderedList')} className="p-2 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-slate-700 cursor-pointer" title="Bullet List"><List size={13} /></button>
                      <button type="button" onClick={() => execCommand('insertOrderedList')} className="p-2 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-slate-700 cursor-pointer" title="Numbered List"><ListOrdered size={13} /></button>
                      <button type="button" onClick={handleInsertLink} className="p-2 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-slate-700 cursor-pointer" title="Insert Link"><LinkIcon size={13} /></button>
                      <button type="button" onClick={() => execCommand('insertHorizontalRule')} className="p-2 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-slate-700 cursor-pointer" title="Horizontal Line"><Minus size={13} /></button>
                    </div>

                    {/* Row 3: Color Palette Picker */}
                    <div className="flex flex-wrap items-center gap-4 pt-1 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      <div className="flex items-center space-x-1.5">
                        <span>Text:</span>
                        {TEXT_COLORS.map(c => (
                          <button
                            key={c.value}
                            type="button"
                            onClick={() => execCommand('foreColor', c.value)}
                            className="w-4 h-4 rounded-full border border-slate-300 hover:scale-125 transition-transform cursor-pointer"
                            style={{ backgroundColor: c.value }}
                            title={`Text: ${c.label}`}
                          />
                        ))}
                      </div>

                      <div className="flex items-center space-x-1.5">
                        <span>Highlight:</span>
                        {HIGHLIGHT_COLORS.map(h => (
                          <button
                            key={h.value}
                            type="button"
                            onClick={() => execCommand('hiliteColor', h.value)}
                            className="w-4 h-4 rounded-full border border-slate-300 hover:scale-125 transition-transform cursor-pointer"
                            style={{ backgroundColor: h.value }}
                            title={`Highlight: ${h.label}`}
                          />
                        ))}
                      </div>
                    </div>

                  </div>

                  {/* Rich Editable Content Workspace */}
                  <div 
                    ref={editorRef}
                    contentEditable
                    onInput={(e) => setHtmlContent(e.currentTarget.innerHTML)}
                    className="w-full min-h-[360px] max-h-[600px] overflow-y-auto bg-white border border-slate-200 rounded-2xl p-6 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#5d463c]/30 leading-relaxed"
                    style={{ fontFamily }}
                  />
                </div>

              </div>

              {/* Right Column: Cover Image & Publishing Settings */}
              <div className="space-y-6">
                
                {/* Cover Feature Image Card */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
                  <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
                    <ImageIcon size={16} className="text-[#5d463c]" />
                    <span className="text-[11px] uppercase tracking-[0.2em] font-black text-[#5d463c]">
                      Cover Feature Image
                    </span>
                  </div>

                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleHeaderImageUpload}
                    accept="image/jpeg,image/png,image/webp" 
                    className="hidden" 
                  />

                  {/* Upload Dropzone */}
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-[#5d463c]/30 hover:border-[#5d463c] bg-[#efe7e5]/30 rounded-2xl p-6 text-center cursor-pointer transition-all space-y-3"
                  >
                    {uploadingImage ? (
                      <div className="py-6 flex flex-col items-center">
                        <Loader2 className="animate-spin text-[#5d463c]" size={28} />
                        <span className="text-xs font-bold text-slate-500 mt-2">Uploading image...</span>
                      </div>
                    ) : formImage ? (
                      <div className="space-y-3">
                        <div className="w-full h-40 rounded-xl overflow-hidden shadow-inner border border-slate-200">
                          <img src={formImage} alt="Cover Preview" className="w-full h-full object-cover" />
                        </div>
                        <button 
                          type="button" 
                          className="px-4 py-2 bg-[#efe7e5] text-[#5d463c] hover:bg-slate-200 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                        >
                          Change Header Image
                        </button>
                      </div>
                    ) : (
                      <div className="py-4 space-y-2">
                        <Upload size={32} className="mx-auto text-[#5d463c]" />
                        <div>
                          <p className="text-xs font-bold text-slate-700">Upload Header Image</p>
                          <p className="text-[10px] text-slate-400">JPEG or PNG up to 5MB</p>
                        </div>
                        <button 
                          type="button" 
                          className="px-5 py-2 bg-[#5d463c] text-[#efe7e5] rounded-xl text-xs font-bold uppercase tracking-wider shadow-sm cursor-pointer"
                        >
                          Choose File
                        </button>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-[9px] uppercase tracking-widest font-bold text-slate-400 mb-1">Image URL (Optional Direct Link)</label>
                    <input 
                      type="text" 
                      value={formImage}
                      onChange={(e) => setFormImage(e.target.value)}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full bg-[#f8fafc] border border-slate-200 rounded-xl p-2.5 text-xs text-slate-700"
                    />
                  </div>
                </div>

                {/* Publishing Settings Card */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-5">
                  <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
                    <Sliders size={16} className="text-[#5d463c]" />
                    <span className="text-[11px] uppercase tracking-[0.2em] font-black text-[#5d463c]">
                      Publishing Settings
                    </span>
                  </div>

                  {/* Category Dropdown */}
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest font-black text-slate-400 mb-2">Category</label>
                    <select 
                      value={formCategory}
                      onChange={(e) => setFormCategory(e.target.value)}
                      className="w-full bg-[#f8fafc] border border-slate-200 rounded-2xl px-4 py-3 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#5d463c]/40 cursor-pointer"
                    >
                      {CATEGORIES_LIST.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  {/* Status Dropdown */}
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest font-black text-slate-400 mb-2">Status</label>
                    <select 
                      value={formStatus}
                      onChange={(e) => setFormStatus(e.target.value)}
                      className="w-full bg-[#f8fafc] border border-slate-200 rounded-2xl px-4 py-3 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#5d463c]/40 cursor-pointer"
                    >
                      <option value="Published (Public)">Published (Public)</option>
                      <option value="Draft (Private)">Draft (Private)</option>
                      <option value="Archived">Archived</option>
                    </select>
                  </div>

                  {/* Tags */}
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest font-black text-slate-400 mb-2">Tags (Comma Separated)</label>
                    <input 
                      type="text" 
                      value={formTags}
                      onChange={(e) => setFormTags(e.target.value)}
                      placeholder="Marketing, Growth, Tips"
                      className="w-full bg-[#f8fafc] border border-slate-200 rounded-2xl px-4 py-3 text-xs font-bold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#5d463c]/40"
                    />
                  </div>

                  {/* Metadata Row */}
                  <div className="grid grid-cols-2 gap-3 pt-1 border-t border-slate-100">
                    <div>
                      <label className="block text-[9px] uppercase tracking-widest font-bold text-slate-400 mb-1">Read Time</label>
                      <input 
                        type="text" 
                        value={formReadTime}
                        onChange={(e) => setFormReadTime(e.target.value)}
                        className="w-full bg-[#f8fafc] border border-slate-200 rounded-xl p-2 text-xs font-bold text-slate-800"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] uppercase tracking-widest font-bold text-slate-400 mb-1">Author</label>
                      <input 
                        type="text" 
                        value={formAuthor}
                        onChange={(e) => setFormAuthor(e.target.value)}
                        className="w-full bg-[#f8fafc] border border-slate-200 rounded-xl p-2 text-xs font-bold text-slate-800"
                      />
                    </div>
                  </div>

                </div>

              </div>

            </div>
          )}

        </div>
      ) : (
        
        /* ── DASHBOARD LIST VIEW ─────────────────────────────────────────── */
        <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300">
          
          {/* Dashboard Title & Actions */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <span className="text-[10px] uppercase tracking-[0.4em] font-black text-[#5d463c]">
                Journal & Content Studio
              </span>
              <h1 className="text-4xl md:text-5xl font-serif font-bold text-[#12100e] mt-2">
                Blog Articles <span className="text-slate-400 font-normal italic not-serif text-2xl ml-2">({blogs.length})</span>
              </h1>
            </div>
            
            <div className="flex items-center space-x-3">
              {!isWriter && (
                <button 
                  onClick={() => setShowAccessModal(true)}
                  className="px-5 py-4 bg-[#efe7e5] hover:bg-[#e2d8d5] text-[#5d463c] border border-[#5d463c]/30 font-bold text-xs uppercase tracking-[0.15em] rounded-2xl transition-all shadow-sm flex items-center space-x-2 cursor-pointer"
                  title="Configure Username & Password for Blog Writer Access"
                >
                  <Key size={16} />
                  <span>Writer Access Credentials</span>
                </button>
              )}

              <button 
                onClick={handleOpenCreate}

                className="px-8 py-4 bg-[#5d463c] hover:bg-[#4c3931] text-[#efe7e5] font-bold text-xs uppercase tracking-[0.2em] rounded-2xl transition-all shadow-md flex items-center space-x-2 cursor-pointer"
              >
                <Plus size={16} /> <span>Write New Story</span>
              </button>
            </div>
          </div>

          {/* Search Bar & Category Filters */}
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between p-4 bg-white rounded-3xl border border-slate-200/60 shadow-sm">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search blog articles by title, tag, or category..."
                className="w-full bg-[#f8fafc] border-none rounded-2xl py-3 pl-12 pr-6 text-sm text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-[#5d463c]/40"
              />
            </div>
            
            <div className="flex items-center space-x-2 w-full md:w-auto overflow-x-auto">
              <button 
                onClick={() => setFilterCategory('All')} 
                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${filterCategory === 'All' ? 'bg-[#5d463c] text-[#efe7e5]' : 'bg-[#efe7e5] text-[#5d463c] hover:bg-slate-200'}`}
              >
                All
              </button>
              {CATEGORIES_LIST.map((cat) => (
                <button 
                  key={cat} 
                  onClick={() => setFilterCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-colors cursor-pointer ${filterCategory === cat ? 'bg-[#5d463c] text-[#efe7e5]' : 'bg-[#efe7e5] text-[#5d463c] hover:bg-slate-200'}`}
                >
                  {cat.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>

          {/* Blog Table / Card Grid */}
          <div className="bg-white border border-slate-200/80 rounded-3xl overflow-hidden shadow-sm">
            {loading ? (
              <div className="py-20 flex flex-col items-center justify-center space-y-4">
                <Loader2 className="animate-spin text-[#5d463c]" size={36} />
                <span className="text-xs uppercase tracking-[0.2em] text-slate-400 font-bold">Querying blog archive...</span>
              </div>
            ) : filteredBlogs.length === 0 ? (
              <div className="py-20 text-center space-y-4">
                <FileText size={40} className="mx-auto text-slate-300" />
                <span className="text-xs uppercase tracking-widest text-slate-450 font-bold block">No blog articles found</span>
                <button 
                  onClick={handleOpenCreate}
                  className="px-6 py-3 bg-[#5d463c] text-[#efe7e5] rounded-2xl text-xs uppercase tracking-widest font-bold hover:bg-[#4c3931] cursor-pointer shadow-sm"
                >
                  Create First Article
                </button>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {filteredBlogs.map((blog) => (
                  <div 
                    key={blog._id || blog.slug}
                    className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-[#efe7e5]/20 transition-colors"
                  >
                    {/* Left: Cover Thumbnail & Details */}
                    <div className="flex items-center space-x-5 flex-1 min-w-0">
                      <div className="w-24 h-24 rounded-2xl bg-slate-100 border border-slate-200/60 shadow-sm shrink-0 overflow-hidden relative group/img">
                        <img 
                          src={blog.image} 
                          alt={blog.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover/img:scale-110"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center space-x-3 mb-1.5">
                          <span className="text-[9px] uppercase tracking-widest font-black bg-[#efe7e5] text-[#5d463c] border border-[#5d463c]/20 px-3 py-0.5 rounded-full">
                            {blog.category}
                          </span>
                          <span className="text-[10px] text-slate-400 flex items-center gap-1 font-medium">
                            <Clock size={12} /> {blog.readTime || '5 min'}
                          </span>
                        </div>
                        <h3 className="font-serif text-lg font-bold text-[#12100e] truncate">{blog.title}</h3>
                        <p className="text-xs text-slate-500 truncate mt-1">{blog.excerpt}</p>
                        <div className="flex items-center space-x-3 mt-2 text-[10px] text-slate-400 font-mono">
                          <span>/blog/{blog.slug}</span>
                          <span>•</span>
                          <span>{blog.date}</span>
                        </div>
                      </div>
                    </div>

                    {/* Right: Actions & Status */}
                    <div className="flex items-center space-x-3 shrink-0">
                      <span className={`px-3.5 py-1 rounded-full text-[10px] uppercase font-bold tracking-wider ${
                        blog.isPublished ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'
                      }`}>
                        {blog.isPublished ? 'Live' : 'Draft'}
                      </span>

                      <button
                        onClick={() => handleOpenEdit(blog)}
                        className="px-4 py-2.5 bg-[#5d463c] hover:bg-[#4c3931] text-[#efe7e5] rounded-xl text-xs uppercase tracking-widest font-bold transition-all shadow-sm flex items-center space-x-1.5 cursor-pointer"
                      >
                        <Edit3 size={14} />
                        <span>Edit</span>
                      </button>

                      <button
                        onClick={() => handleDeleteBlog(blog._id!, blog.title)}
                        className="p-2.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl transition-all cursor-pointer"
                        title="Delete Article"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      )}

      {/* ── MANAGE WRITER ACCESS CREDENTIALS MODAL ───────────────────────── */}
      {showAccessModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full p-8 space-y-6 shadow-2xl border border-slate-200">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-[#efe7e5] text-[#5d463c] flex items-center justify-center">
                  <Lock size={20} />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-lg text-[#12100e]">Writer Access Credentials</h3>
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider">Set Username & Password for Blog Section Access</p>
                </div>
              </div>
              <button 
                onClick={() => setShowAccessModal(false)}
                className="p-2 text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveBlogWriterAccess} className="space-y-4">
              <div>
                <label className="block text-[10px] uppercase tracking-widest font-black text-slate-500 mb-1">
                  Writer Account Name
                </label>
                <input 
                  type="text" 
                  value={writerName}
                  onChange={(e) => setWriterName(e.target.value)}
                  placeholder="e.g. Lead Blog Writer"
                  className="w-full bg-[#f8fafc] border border-slate-200 rounded-xl p-3 text-xs font-bold text-slate-800"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-widest font-black text-[#5d463c] mb-1">
                  Username / Login Email *
                </label>
                <input 
                  type="text" 
                  value={writerEmail}
                  onChange={(e) => {
                    setWriterEmail(e.target.value);
                    setWriterUsername(e.target.value.split('@')[0]);
                  }}
                  placeholder="e.g. writer@zoniraz.com or blogwriter"
                  className="w-full bg-[#f8fafc] border border-slate-200 rounded-xl p-3 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-[#5d463c]/30 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-widest font-black text-[#5d463c] mb-1">
                  Login Password *
                </label>
                <input 
                  type="text" 
                  value={writerPassword}
                  onChange={(e) => setWriterPassword(e.target.value)}
                  placeholder="Set secret password for writer..."
                  className="w-full bg-[#f8fafc] border border-slate-200 rounded-xl p-3 text-xs font-mono font-bold text-slate-800 focus:ring-2 focus:ring-[#5d463c]/30 outline-none"
                  required
                />
              </div>

              {existingWriters.length > 0 && (
                <div className="p-4 bg-[#efe7e5]/40 rounded-2xl border border-[#5d463c]/20 space-y-1">
                  <span className="text-[9px] uppercase tracking-widest font-black text-[#5d463c] block">Configured Writer Accounts:</span>
                  {existingWriters.map((w) => (
                    <div key={w._id} className="flex items-center justify-between text-xs font-mono text-slate-700">
                      <span>{w.email} ({w.name})</span>
                      <span className="text-[9px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-sans font-bold">Active</span>
                    </div>
                  ))}
                </div>
              )}

              <div className="pt-2 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowAccessModal(false)}
                  className="px-5 py-2.5 bg-slate-100 text-slate-700 font-bold text-xs uppercase tracking-wider rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingAccess}
                  className="px-6 py-2.5 bg-[#5d463c] hover:bg-[#4c3931] text-[#efe7e5] font-bold text-xs uppercase tracking-wider rounded-xl shadow-md cursor-pointer flex items-center space-x-2 disabled:opacity-50"
                >
                  {savingAccess ? <Loader2 size={14} className="animate-spin" /> : <UserCheck size={14} />}
                  <span>Save Credentials</span>
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
