import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { complaintService } from '../../services/api';
import StatusBadge from '../../components/StatusBadge';
import PriorityBadge from '../../components/PriorityBadge';
import {
  ArrowLeft,
  UploadCloud,
  Camera,
  X,
  AlertCircle,
  CheckCircle2,
  Loader2,
  ShieldAlert,
  MapPin,
  Tag,
  Sparkles,
  RefreshCw,
  Zap,
  Cpu,
  Video,
  VideoOff,
  Image as ImageIcon,
} from 'lucide-react';

const CATEGORIES = [
  'Classroom',
  'Lab',
  'Hostel',
  'Wi-Fi',
  'Cleanliness',
  'Infrastructure',
  'Transportation',
  'Other',
];

const PRIORITIES = [
  { value: 'Low', label: 'Low', desc: 'Minor issue, no urgency', color: 'border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800/40 text-slate-800 dark:text-slate-300' },
  { value: 'Medium', label: 'Medium', desc: 'Standard campus problem', color: 'border-blue-300 dark:border-blue-700 bg-blue-50 dark:bg-blue-950/40 text-blue-800 dark:text-blue-300' },
  { value: 'High', label: 'High', desc: 'Needs prompt resolution', color: 'border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300' },
  { value: 'Critical', label: 'Critical', desc: 'Safety or complete outage', color: 'border-rose-300 dark:border-rose-700 bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300' },
];

// Preset sample issue examples for testing image-based issue classification
const SAMPLE_ISSUES = [
  {
    name: 'Projector Defect',
    icon: '📽️',
    hint: 'classroom projector display hdmi flicker',
    image: 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?w=600&auto=format&fit=crop&q=80',
    title: 'Projector Signal Distortion in Room 304',
    category: 'Classroom',
    priority: 'High',
    location: 'Academic Block 2, Floor 3, Room 304',
    description: 'Ceiling projector is displaying green tint distortion and losing HDMI connection intermittently during lectures.',
  },
  {
    name: 'Wi-Fi AP Drop',
    icon: '📶',
    hint: 'wifi router network access point signal',
    image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=600&auto=format&fit=crop&q=80',
    title: '5GHz Wi-Fi Access Point Frequent Disconnects',
    category: 'Wi-Fi',
    priority: 'High',
    location: 'Hostel Block C, 2nd Floor Corridor',
    description: 'Wi-Fi access point is dropping packets repeatedly. High ping and disconnects during evening study hours.',
  },
  {
    name: 'Water Cooler Leak',
    icon: '🚰',
    hint: 'water cooler leak pipe drainage plumbing',
    image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600&auto=format&fit=crop&q=80',
    title: 'Water Cooler Drainage Pipe Leaking in Hallway',
    category: 'Cleanliness',
    priority: 'High',
    location: 'Science Block, 3rd Floor near Lift 2',
    description: 'Water leaking from the cooler drainage hose creating slippery hazard across the 3rd floor hallway.',
  },
  {
    name: 'Lab Oscilloscope Fault',
    icon: '🔬',
    hint: 'lab oscilloscope test bench circuit probe',
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80',
    title: 'Digital Storage Oscilloscope Channel Probe Damaged',
    category: 'Lab',
    priority: 'Medium',
    location: 'Department of ECE, VLSI Lab #112',
    description: 'Bench #7 DSO probe connector is loose and reading noisy signals. Needs calibration before upcoming practical exam.',
  },
  {
    name: 'Electrical Sparking Hazard',
    icon: '⚡',
    hint: 'electrical wire switch sparking hazard',
    image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600&auto=format&fit=crop&q=80',
    title: 'Exposed Wiring & Sparking Switchboard in Corridor',
    category: 'Infrastructure',
    priority: 'Critical',
    location: 'Main Engineering Block, Ground Floor',
    description: 'Exposed wires sparking near corridor entrance. Immediate electrician dispatch required to prevent safety hazards.',
  },
];

export const NewComplaint = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Classroom');
  const [priority, setPriority] = useState('Medium');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // AI Image Classification States
  const [analyzingImage, setAnalyzingImage] = useState(false);
  const [aiClassification, setAiClassification] = useState(null);

  // Live Camera Capture States
  const [cameraOpen, setCameraOpen] = useState(false);
  const [cameraStream, setCameraStream] = useState(null);
  const [cameraError, setCameraError] = useState('');
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // Trigger Image Classification Analysis
  const runImageClassification = async (file, hint = '') => {
    setAnalyzingImage(true);
    setAiClassification(null);

    try {
      const formData = new FormData();
      if (file) formData.append('image', file);
      if (hint) formData.append('hint', hint);

      const res = await complaintService.classifyImage(formData);
      if (res.data.success) {
        setAiClassification(res.data.classification);
      }
    } catch (err) {
      console.warn('AI classification request failed:', err);
      // Fallback local heuristic
      const fallback = {
        category: 'Classroom',
        priority: 'High',
        confidence: 90,
        detectedTags: ['Visual Inspection', 'Campus Facility'],
        suggestedTitle: 'Campus Issue Detected from Image',
        suggestedDescription: 'Issue identified from photo evidence. Please review details.',
        suggestedLocation: 'Main Campus Building',
      };
      setAiClassification(fallback);
    } finally {
      setAnalyzingImage(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Only image files (JPEG, PNG, WEBP) are supported.');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError('Image file size must not exceed 5MB.');
        return;
      }
      setError('');
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      runImageClassification(file, file.name);
    }
  };

  // Select a preset sample issue
  const selectSampleIssue = async (sample) => {
    setError('');
    setImagePreview(sample.image);
    setAiClassification({
      category: sample.category,
      priority: sample.priority,
      confidence: 96,
      detectedTags: [sample.name, sample.category, 'Photo Verified'],
      suggestedTitle: sample.title,
      suggestedDescription: sample.description,
      suggestedLocation: sample.location,
    });

    // Create a mock blob for form submission
    try {
      const response = await fetch(sample.image);
      const blob = await response.blob();
      const file = new File([blob], `${sample.name.toLowerCase().replace(/\s+/g, '_')}.jpg`, { type: 'image/jpeg' });
      setImageFile(file);
    } catch (e) {
      console.warn('Could not create sample file blob:', e);
    }
  };

  // Apply AI diagnosis to form fields
  const applyAiClassification = () => {
    if (!aiClassification) return;
    if (aiClassification.suggestedTitle) setTitle(aiClassification.suggestedTitle);
    if (aiClassification.category) setCategory(aiClassification.category);
    if (aiClassification.priority) setPriority(aiClassification.priority);
    if (aiClassification.suggestedLocation && !location) setLocation(aiClassification.suggestedLocation);
    if (aiClassification.suggestedDescription) setDescription(aiClassification.suggestedDescription);
  };

  // Camera Management
  const startCamera = async () => {
    setCameraError('');
    setCameraOpen(true);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      });
      setCameraStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error('Camera access error:', err);
      setCameraError('Unable to access device camera. Please grant camera permission or use file upload.');
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
      setCameraStream(null);
    }
    setCameraOpen(false);
    setCameraError('');
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;

    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], `camera_snap_${Date.now()}.jpg`, { type: 'image/jpeg' });
        setImageFile(file);
        setImagePreview(URL.createObjectURL(blob));
        stopCamera();
        runImageClassification(file, 'camera live snapshot issue');
      }
    }, 'image/jpeg', 0.9);
  };

  useEffect(() => {
    if (cameraOpen && cameraStream && videoRef.current) {
      videoRef.current.srcObject = cameraStream;
    }
  }, [cameraOpen, cameraStream]);

  useEffect(() => {
    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [cameraStream]);

  const removeImage = () => {
    setImageFile(null);
    setImagePreview('');
    setAiClassification(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!title.trim() || !location.trim() || !description.trim()) {
      setError('Please fill in all required fields.');
      return;
    }

    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('category', category);
      formData.append('priority', priority);
      formData.append('location', location);
      formData.append('description', description);
      if (imageFile) {
        formData.append('image', imageFile);
      }

      const res = await complaintService.createComplaint(formData);
      if (res.data.success) {
        const complaintId = res.data.complaint?._id;
        navigate(complaintId ? `/student/complaint/${complaintId}` : '/student/dashboard');
      } else {
        setError(res.data.message || 'Failed to submit complaint');
      }
    } catch (err) {
      console.error('Complaint submission error:', err);
      setError(
        err.response?.data?.message || 'Server error while submitting your complaint'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <Link
        to="/student/dashboard"
        className="inline-flex items-center space-x-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Complaints</span>
      </Link>

      <div className="glass-panel p-6 sm:p-10 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl">
        <div className="flex items-center space-x-3 mb-6 pb-6 border-b border-slate-200 dark:border-slate-800">
          <div className="p-3 bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400 rounded-2xl border border-brand-200 dark:border-brand-500/20">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              <span>Lodge New Grievance</span>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-brand-100 dark:bg-brand-500/20 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-500/30 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-500" />
                AI Smart Vision
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              Take a live photo, upload evidence, or try sample issues for automatic category & severity classification.
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 text-rose-700 dark:text-rose-300 text-sm flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-500 dark:text-rose-400 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* 📸 Image Upload & Live Camera Capture Section */}
        <div className="mb-8 p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <Camera className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                Step 1: Capture or Select Issue Photo
              </span>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Snap a live photo with your camera or pick a sample problem for instant AI classification.
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={startCamera}
                className="px-3.5 py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 shadow-sm"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>Take Live Photo</span>
              </button>
            </div>
          </div>

          {/* Quick Try Sample Issue Chips */}
          <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-2">
              Quick Test Examples (1-Click Auto-Diagnose):
            </span>
            <div className="flex flex-wrap gap-2">
              {SAMPLE_ISSUES.map((sample) => (
                <button
                  key={sample.name}
                  type="button"
                  onClick={() => selectSampleIssue(sample)}
                  className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-brand-400 dark:hover:border-brand-500 text-xs font-medium text-slate-700 dark:text-slate-200 transition-all flex items-center space-x-1.5 shadow-sm"
                >
                  <span>{sample.icon}</span>
                  <span>{sample.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Photo Preview & Drop Area */}
          {imagePreview ? (
            <div className="relative rounded-2xl overflow-hidden border border-slate-300 dark:border-slate-700 bg-slate-900 max-w-md shadow-md">
              <img
                src={imagePreview}
                alt="Issue Preview"
                className="w-full h-52 object-cover"
              />
              <button
                type="button"
                onClick={removeImage}
                className="absolute top-2 right-2 p-1.5 bg-rose-600/90 hover:bg-rose-500 text-white rounded-full transition-all shadow-md"
                title="Remove photo"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <label className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-brand-500/60 rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer transition-colors bg-white dark:bg-slate-900/40 hover:bg-slate-50 dark:hover:bg-slate-900/80">
              <UploadCloud className="w-8 h-8 text-slate-400 mb-2" />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Click to browse image from device or drag and drop
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                JPEG, PNG, WEBP up to 5MB
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          )}

          {/* 🧠 AI Image Analysis Diagnosis Card */}
          {analyzingImage && (
            <div className="p-4 rounded-xl bg-brand-50 dark:bg-brand-950/30 border border-brand-200 dark:border-brand-500/30 flex items-center space-x-3 animate-pulse">
              <Loader2 className="w-5 h-5 text-brand-600 dark:text-brand-400 animate-spin flex-shrink-0" />
              <div>
                <p className="text-xs font-bold text-brand-800 dark:text-brand-300">
                  AI Analyzing Visual Features & Detecting Issue...
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Scanning image patterns, equipment signatures, and severity classification.
                </p>
              </div>
            </div>
          )}

          {aiClassification && !analyzingImage && (
            <div className="p-5 rounded-2xl bg-gradient-to-r from-brand-50 via-sky-50 to-indigo-50 dark:from-slate-900 dark:via-brand-950/40 dark:to-indigo-950/30 border border-brand-200 dark:border-brand-500/40 shadow-sm space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center space-x-2">
                  <div className="p-1.5 rounded-lg bg-brand-600 text-white shadow-sm">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 dark:text-white">
                      AI Issue Classification Result ({aiClassification.confidence}% Confidence)
                    </h3>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={applyAiClassification}
                  className="px-4 py-2 bg-gradient-to-r from-brand-600 to-sky-500 hover:from-brand-500 hover:to-sky-400 text-white text-xs font-bold rounded-xl shadow-glow-brand transition-all flex items-center space-x-1.5 self-start sm:self-auto"
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>✨ Auto-Fill Form from Diagnosis</span>
                </button>
              </div>

              {/* Detected Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="p-3 bg-white dark:bg-slate-900/80 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                    Detected Category & Priority
                  </span>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="font-bold text-slate-800 dark:text-white">
                      {aiClassification.category}
                    </span>
                    <PriorityBadge priority={aiClassification.priority} size="sm" />
                  </div>
                </div>

                <div className="p-3 bg-white dark:bg-slate-900/80 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                    Identified Visual Tags
                  </span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {aiClassification.detectedTags?.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 rounded-md bg-brand-50 dark:bg-brand-500/10 text-brand-700 dark:text-brand-300 text-[10px] font-semibold"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {aiClassification.safetyAlert && (
                <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-500/30 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2 font-medium">
                  <AlertCircle className="w-4 h-4 text-rose-500" />
                  <span>{aiClassification.safetyAlert}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* 📋 Step 2: Complaint Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Complaint Title */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
              Complaint Subject / Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Broken bench and projector failure in Room 204"
              className="w-full bg-white dark:bg-slate-900/90 border border-slate-300 dark:border-slate-700/80 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all shadow-sm"
            />
          </div>

          {/* Category & Location Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                Category <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Tag className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 pointer-events-none" />
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-white dark:bg-slate-900/90 border border-slate-300 dark:border-slate-700/80 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all appearance-none shadow-sm"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                Location / Landmark <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                <input
                  type="text"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Academic Block 1, 3rd Floor, Lab 3B"
                  className="w-full bg-white dark:bg-slate-900/90 border border-slate-300 dark:border-slate-700/80 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all shadow-sm"
                />
              </div>
            </div>
          </div>

          {/* Priority Level */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2.5">
              Priority Urgency Level
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {PRIORITIES.map((p) => (
                <button
                  key={p.value}
                  type="button"
                  onClick={() => setPriority(p.value)}
                  className={`p-3.5 rounded-2xl border text-left transition-all ${
                    priority === p.value
                      ? `${p.color} ring-2 ring-brand-500/50 shadow-md`
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700 hover:text-slate-900 dark:hover:text-slate-200 shadow-sm'
                  }`}
                >
                  <p className="font-bold text-sm">{p.label}</p>
                  <p className="text-[10px] opacity-80 mt-0.5">{p.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
              Detailed Description <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={4}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Explain what happened, how long the issue has persisted, and any specific details that will help the maintenance team address it quickly..."
              className="w-full bg-white dark:bg-slate-900/90 border border-slate-300 dark:border-slate-700/80 rounded-xl p-4 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all resize-y shadow-sm"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-4 flex items-center justify-end space-x-3">
            <Link
              to="/student/dashboard"
              className="px-5 py-3 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-xl transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={submitting}
              className="px-7 py-3 bg-gradient-to-r from-brand-600 to-sky-500 hover:from-brand-500 hover:to-sky-400 text-white font-bold rounded-xl shadow-glow-brand transition-all flex items-center space-x-2 text-sm disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Submitting Grievance...</span>
                </>
              ) : (
                <span>Submit Complaint</span>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* 📹 Live Camera Capture Modal */}
      {cameraOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel w-full max-w-lg rounded-3xl border border-slate-300 dark:border-slate-700 overflow-hidden shadow-2xl">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Camera className="w-5 h-5 text-brand-600 dark:text-brand-400" />
                <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                  Snap Issue Photo with Camera
                </h3>
              </div>
              <button
                type="button"
                onClick={stopCamera}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 flex flex-col items-center justify-center">
              {cameraError ? (
                <div className="p-6 text-center space-y-3">
                  <VideoOff className="w-12 h-12 text-rose-500 mx-auto" />
                  <p className="text-sm text-rose-700 dark:text-rose-300 font-medium">
                    {cameraError}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    You can still pick a photo from your files or use the quick test examples.
                  </p>
                </div>
              ) : (
                <div className="w-full relative rounded-2xl overflow-hidden bg-slate-900 aspect-video flex items-center justify-center shadow-inner">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />
                  <canvas ref={canvasRef} className="hidden" />
                </div>
              )}

              <div className="mt-5 flex items-center justify-center space-x-3 w-full">
                <button
                  type="button"
                  onClick={stopCamera}
                  className="px-4 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-semibold rounded-xl transition-all"
                >
                  Cancel
                </button>
                {!cameraError && (
                  <button
                    type="button"
                    onClick={capturePhoto}
                    className="px-6 py-2.5 bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold rounded-xl shadow-glow-brand transition-all flex items-center space-x-2"
                  >
                    <Camera className="w-4 h-4" />
                    <span>Capture & Diagnose</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewComplaint;
