import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  Save, 
  Calendar, 
  MapPin, 
  Image as ImageIcon, 
  Tag as TagIcon, 
  ArrowLeft,
  Sparkles,
  Upload,
  X,
  Type
} from 'lucide-react';
import api from '../services/api';
import { MOODS } from '../components/MoodBadge';

export default function DiaryEditorPage() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('edit');

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [memoryDate, setMemoryDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [mood, setMood] = useState('Neutral');
  const [categoryId, setCategoryId] = useState('');
  const [locationName, setLocationName] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [imageUrls, setImageUrls] = useState([]);
  const [imageUrlInput, setImageUrlInput] = useState('');

  const [categories, setCategories] = useState([]);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [loading, setLoading] = useState(!!editId);
  const [fontStyle, setFontStyle] = useState('serif');

  useEffect(() => {
    // Load categories
    api.get('/categories')
      .then((res) => {
        setCategories(res.data.data || []);
      })
      .catch((err) => console.error('Failed to load categories', err));

    // If edit mode, load existing memory
    if (editId) {
      api.get(`/memories/${editId}`)
        .then((res) => {
          const m = res.data.data;
          setTitle(m.title || '');
          setContent(m.content || '');
          setMemoryDate(m.memoryDate || '');
          setMood(m.mood || 'Neutral');
          setCategoryId(m.categoryId || '');
          setLocationName(m.locationName || '');
          setLatitude(m.latitude ? String(m.latitude) : '');
          setLongitude(m.longitude ? String(m.longitude) : '');
          setTags((m.tags || []).map((t) => t.name));
          setImageUrls((m.images || []).map((i) => i.imageUrl));
        })
        .catch(() => {
          alert('Could not load memory for editing');
          navigate('/dashboard');
        })
        .finally(() => setLoading(false));
    }
  }, [editId, navigate]);

  const handleAddTag = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const val = tagInput.trim().replace(/^#/, '');
      if (val && !tags.includes(val)) {
        setTags([...tags, val]);
        setTagInput('');
      }
    }
  };

  const handleRemoveTag = (tagName) => {
    setTags(tags.filter((t) => t !== tagName));
  };

  const handleAddImageUrl = (e) => {
    e.preventDefault();
    if (imageUrlInput.trim() && !imageUrls.includes(imageUrlInput.trim())) {
      setImageUrls([...imageUrls, imageUrlInput.trim()]);
      setImageUrlInput('');
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('Photo must be smaller than 5MB');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    setUploadingImage(true);
    try {
      const res = await api.post('/memories/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const uploadedUrl = res.data.data.imageUrl;
      setImageUrls([...imageUrls, uploadedUrl]);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to upload photo');
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleRemoveImage = (index) => {
    setImageUrls(imageUrls.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      alert('Please provide both a title and content for your memory.');
      return;
    }

    setSaving(true);
    const payload = {
      title: title.trim(),
      content: content.trim(),
      memoryDate,
      mood,
      categoryId: categoryId || null,
      locationName: locationName.trim() || null,
      latitude: latitude ? parseFloat(latitude) : null,
      longitude: longitude ? parseFloat(longitude) : null,
      tags,
      imageUrls,
    };

    try {
      if (editId) {
        await api.put(`/memories/${editId}`, payload);
      } else {
        await api.post('/memories', payload);
      }
      navigate('/dashboard');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save memory');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-diary-muted">
        Loading memory editor...
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      {/* Top Header Controls */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-diary-border">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center space-x-1.5 text-xs font-semibold text-diary-muted hover:text-diary-ink transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <div className="flex items-center space-x-3">
          {/* Font switcher */}
          <div className="hidden sm:flex items-center bg-white rounded-xl border border-diary-border p-1 text-xs">
            <button
              type="button"
              onClick={() => setFontStyle('serif')}
              className={`px-2.5 py-1 rounded-lg transition-colors font-serif ${
                fontStyle === 'serif' ? 'bg-amber-100 text-amber-900 font-bold' : 'text-diary-muted'
              }`}
            >
              Serif
            </button>
            <button
              type="button"
              onClick={() => setFontStyle('sans')}
              className={`px-2.5 py-1 rounded-lg transition-colors font-sans ${
                fontStyle === 'sans' ? 'bg-amber-100 text-amber-900 font-bold' : 'text-diary-muted'
              }`}
            >
              Sans
            </button>
            <button
              type="button"
              onClick={() => setFontStyle('handwriting')}
              className={`px-2.5 py-1 rounded-lg transition-colors font-handwriting text-base ${
                fontStyle === 'handwriting' ? 'bg-amber-100 text-amber-900 font-bold' : 'text-diary-muted'
              }`}
            >
              Hand
            </button>
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={saving}
            className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-amber-800 text-white font-semibold text-xs sm:text-sm hover:bg-amber-900 shadow-diary transition-all disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : editId ? 'Update Memory' : 'Save Memory'}</span>
          </button>
        </div>
      </div>

      {/* Main Paper Diary Sheet */}
      <div className="bg-white rounded-3xl border border-diary-border shadow-diary-lg p-6 sm:p-10 paper-texture relative overflow-hidden">
        <div className="absolute top-0 left-0 bottom-0 w-3 bg-amber-800/80" />

        {/* Date, Mood, Category Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 pb-6 border-b border-diary-border/80 pl-2">
          {/* Date Picker */}
          <div>
            <label className="block text-xs font-semibold text-diary-muted uppercase tracking-wider mb-1.5">
              Memory Date
            </label>
            <div className="relative">
              <Calendar className="w-4 h-4 text-amber-800 absolute left-3 top-3 pointer-events-none" />
              <input
                type="date"
                required
                value={memoryDate}
                onChange={(e) => setMemoryDate(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-diary-border bg-parchment-50/50 text-xs font-medium text-diary-ink focus:outline-none focus:ring-1 focus:ring-amber-800"
              />
            </div>
          </div>

          {/* Mood Selector */}
          <div>
            <label className="block text-xs font-semibold text-diary-muted uppercase tracking-wider mb-1.5">
              How did you feel?
            </label>
            <select
              value={mood}
              onChange={(e) => setMood(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-diary-border bg-parchment-50/50 text-xs font-medium text-diary-ink focus:outline-none focus:ring-1 focus:ring-amber-800"
            >
              {MOODS.map((m) => (
                <option key={m.name} value={m.name}>
                  {m.emoji} {m.name}
                </option>
              ))}
            </select>
          </div>

          {/* Category Selector */}
          <div>
            <label className="block text-xs font-semibold text-diary-muted uppercase tracking-wider mb-1.5">
              Category
            </label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-diary-border bg-parchment-50/50 text-xs font-medium text-diary-ink focus:outline-none focus:ring-1 focus:ring-amber-800"
            >
              <option value="">None / General</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Title Input */}
        <div className="mb-6 pl-2">
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Give your memory a title..."
            className="w-full font-serif font-bold text-2xl sm:text-3xl text-diary-ink placeholder:text-diary-muted/40 focus:outline-none bg-transparent border-b border-transparent focus:border-diary-border/80 pb-2 transition-all"
          />
        </div>

        {/* Content Area (Lined paper look) */}
        <div className="mb-6 pl-2">
          <textarea
            required
            rows={12}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your thoughts freely... What happened today? How did you feel? What will you remember?"
            className={`w-full bg-transparent text-base sm:text-lg text-diary-ink placeholder:text-diary-muted/40 focus:outline-none paper-line resize-y ${
              fontStyle === 'serif'
                ? 'font-serif'
                : fontStyle === 'handwriting'
                ? 'font-handwriting text-2xl'
                : 'font-sans'
            }`}
          />
        </div>

        {/* Metadata Details (Location, Tags, Images) */}
        <div className="pt-6 border-t border-diary-border/80 space-y-5 pl-2 text-xs">
          {/* Location row */}
          <div>
            <label className="block text-xs font-semibold text-diary-muted uppercase tracking-wider mb-1.5 flex items-center space-x-1">
              <MapPin className="w-3.5 h-3.5 text-amber-800" />
              <span>Location (Optional)</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input
                type="text"
                value={locationName}
                onChange={(e) => setLocationName(e.target.value)}
                placeholder="e.g. Dhaka University Campus, Cox's Bazar..."
                className="sm:col-span-1 px-3 py-2 rounded-xl border border-diary-border bg-parchment-50/50 text-xs text-diary-ink focus:outline-none focus:ring-1 focus:ring-amber-800"
              />
              <input
                type="number"
                step="any"
                value={latitude}
                onChange={(e) => setLatitude(e.target.value)}
                placeholder="Latitude (e.g. 21.4272)"
                className="px-3 py-2 rounded-xl border border-diary-border bg-parchment-50/50 text-xs text-diary-ink focus:outline-none focus:ring-1 focus:ring-amber-800"
              />
              <input
                type="number"
                step="any"
                value={longitude}
                onChange={(e) => setLongitude(e.target.value)}
                placeholder="Longitude (e.g. 92.0058)"
                className="px-3 py-2 rounded-xl border border-diary-border bg-parchment-50/50 text-xs text-diary-ink focus:outline-none focus:ring-1 focus:ring-amber-800"
              />
            </div>
          </div>

          {/* Tags row */}
          <div>
            <label className="block text-xs font-semibold text-diary-muted uppercase tracking-wider mb-1.5 flex items-center space-x-1">
              <TagIcon className="w-3.5 h-3.5 text-amber-800" />
              <span>Tags (Press Enter to add)</span>
            </label>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-parchment-200 text-diary-ink border border-diary-border text-xs font-medium"
                >
                  <span>#{tag}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="hover:text-rose-600 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleAddTag}
              placeholder="Type tag name and press Enter..."
              className="w-full px-3 py-2 rounded-xl border border-diary-border bg-parchment-50/50 text-xs text-diary-ink focus:outline-none focus:ring-1 focus:ring-amber-800"
            />
          </div>

          {/* Photos: Upload from Device or Paste URL */}
          <div>
            <label className="block text-xs font-semibold text-diary-muted uppercase tracking-wider mb-1.5 flex items-center space-x-1">
              <ImageIcon className="w-3.5 h-3.5 text-amber-800" />
              <span>Photos & Memories</span>
            </label>

            <div className="flex flex-col sm:flex-row gap-2 mb-3">
              {/* Direct file upload input */}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept="image/*"
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingImage}
                className="inline-flex items-center justify-center space-x-1.5 px-4 py-2 rounded-xl bg-amber-800 text-white font-medium text-xs hover:bg-amber-900 transition-colors shrink-0 shadow-xs disabled:opacity-50"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>{uploadingImage ? 'Uploading...' : 'Upload Image'}</span>
              </button>

              {/* URL fallback */}
              <div className="flex flex-1 space-x-2">
                <input
                  type="url"
                  value={imageUrlInput}
                  onChange={(e) => setImageUrlInput(e.target.value)}
                  placeholder="Or paste image URL (https://...)"
                  className="flex-1 px-3 py-2 rounded-xl border border-diary-border bg-parchment-50/50 text-xs text-diary-ink focus:outline-none focus:ring-1 focus:ring-amber-800"
                />
                <button
                  type="button"
                  onClick={handleAddImageUrl}
                  className="px-3.5 py-2 rounded-xl bg-parchment-200 hover:bg-parchment-300 border border-diary-border text-xs font-semibold text-diary-ink transition-colors"
                >
                  Add
                </button>
              </div>
            </div>

            {/* Uploaded Image Previews */}
            {imageUrls.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                {imageUrls.map((url, idx) => (
                  <div key={idx} className="relative rounded-xl overflow-hidden border border-diary-border group h-24 bg-parchment-100 shadow-xs">
                    <img src={url} alt="Attached" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      className="absolute top-1 right-1 p-1 bg-black/60 rounded-full text-white hover:bg-rose-600 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
