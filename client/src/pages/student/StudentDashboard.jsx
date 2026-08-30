import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { complaintService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import StatusBadge from '../../components/StatusBadge';
import PriorityBadge from '../../components/PriorityBadge';
import StatsCard from '../../components/StatsCard';
import ProfilePhotoGallery from '../../components/ProfilePhotoGallery';
import {
  PlusCircle,
  Search,
  Filter,
  Inbox,
  Clock,
  CheckCircle2,
  AlertTriangle,
  MapPin,
  Calendar,
  ChevronRight,
  RefreshCw,
  Loader2,
  User,
  Mail,
  Briefcase,
  Save,
  Image,
  Grid3x3,
} from 'lucide-react';

const CATEGORIES = [
  'All',
  'Classroom',
  'Lab',
  'Hostel',
  'Wi-Fi',
  'Cleanliness',
  'Infrastructure',
  'Transportation',
  'Other',
];

const STATUSES = [
  'All',
  'Submitted',
  'Under Review',
  'Assigned',
  'In Progress',
  'Resolved',
  'Closed',
];

export const StudentDashboard = () => {
  const { user, updateUserProfile } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    department: user?.department || '',
    avatarUrl: user?.avatarUrl || '',
    password: '',
  });
  const [profileMessage, setProfileMessage] = useState('');
  const [profileError, setProfileError] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);
  const [galleryOpen, setGalleryOpen] = useState(false);

  const fetchComplaints = async (isManualRefresh = false) => {
    if (isManualRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const res = await complaintService.getMyComplaints();
      if (res.data.success) {
        setComplaints(res.data.complaints || []);
      }
    } catch (err) {
      console.error('Failed to load complaints:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  useEffect(() => {
    setProfileForm({
      name: user?.name || '',
      email: user?.email || '',
      department: user?.department || '',
      avatarUrl: user?.avatarUrl || '',
      password: '',
    });
  }, [user]);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setProfileMessage('');
    setProfileError('');
    setSavingProfile(true);

    const payload = {
      name: profileForm.name,
      email: profileForm.email,
      department: profileForm.department,
      avatarUrl: profileForm.avatarUrl,
    };

    if (profileForm.password.trim()) {
      payload.password = profileForm.password.trim();
    }

    const result = await updateUserProfile(payload);
    setSavingProfile(false);

    if (result.success) {
      setProfileMessage('Profile updated successfully.');
      setProfileForm((prev) => ({ ...prev, password: '' }));
    } else {
      setProfileError(result.message || 'Unable to update profile.');
    }
  };

  const filteredComplaints = complaints.filter((item) => {
    const matchesStatus =
      selectedStatus === 'All' || item.status === selectedStatus;
    const matchesCategory =
      selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch =
      search.trim() === '' ||
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.description.toLowerCase().includes(search.toLowerCase()) ||
      item.location.toLowerCase().includes(search.toLowerCase());

    return matchesStatus && matchesCategory && matchesSearch;
  });

  const totalCount = complaints.length;
  const inProgressCount = complaints.filter((c) =>
    ['Under Review', 'Assigned', 'In Progress'].includes(c.status)
  ).length;
  const resolvedCount = complaints.filter((c) =>
    ['Resolved', 'Closed'].includes(c.status)
  ).length;
  const submittedCount = complaints.filter((c) => c.status === 'Submitted')
    .length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <ProfilePhotoGallery
        isOpen={galleryOpen}
        onClose={() => setGalleryOpen(false)}
        onSelectPhoto={(photoUrl) => {
          setProfileForm({ ...profileForm, avatarUrl: photoUrl });
          setGalleryOpen(false);
        }}
        currentPhotoUrl={profileForm.avatarUrl}
      />
      {/* Welcome Banner */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl mb-8 relative overflow-hidden border border-brand-200 dark:border-brand-500/20 bg-gradient-to-r from-white via-sky-50/50 to-brand-50/60 dark:from-slate-900 dark:via-slate-900/90 dark:to-brand-950/40 shadow-sm">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
              Student Grievance Dashboard
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1 tracking-tight">
              Welcome, {user?.name}
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-xl">
              Track your campus infrastructure, hostel, lab, and service
              complaints in real-time.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => fetchComplaints(true)}
              disabled={refreshing}
              className="p-3 bg-white dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-2xl border border-slate-200 dark:border-slate-700/80 transition-all shadow-sm"
              title="Refresh complaints"
            >
              <RefreshCw
                className={`w-5 h-5 ${refreshing ? 'animate-spin text-brand-600 dark:text-brand-400' : ''}`}
              />
            </button>
            <Link
              to="/student/complaint/new"
              className="px-5 py-3 bg-gradient-to-r from-brand-600 to-sky-500 hover:from-brand-500 hover:to-sky-400 text-white font-semibold rounded-2xl shadow-glow-brand transition-all flex items-center space-x-2 text-sm"
            >
              <PlusCircle className="w-5 h-5" />
              <span>Lodge New Complaint</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Profile Card */}
      <div className="glass-card p-5 rounded-2xl mb-8 border border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
              My Profile
            </p>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-1">Edit Account Details</h2>
          </div>
          {user?.avatarUrl ? (
            <img src={user.avatarUrl} alt="Profile" className="w-12 h-12 rounded-full object-cover border border-slate-200 dark:border-slate-700" />
          ) : (
            <div className="w-12 h-12 rounded-full bg-brand-100 dark:bg-brand-500/20 flex items-center justify-center text-brand-700 dark:text-brand-300 font-bold">
              {user?.name?.charAt(0) || 'U'}
            </div>
          )}
        </div>

        <form onSubmit={handleProfileUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">Full Name</label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                value={profileForm.name}
                onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl pl-10 pr-3 py-2.5 text-sm text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                value={profileForm.email}
                onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl pl-10 pr-3 py-2.5 text-sm text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">Department</label>
            <div className="relative">
              <Briefcase className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                value={profileForm.department}
                onChange={(e) => setProfileForm({ ...profileForm, department: e.target.value })}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl pl-10 pr-3 py-2.5 text-sm text-slate-900 dark:text-white"
                placeholder="Computer Science"
              />
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">Profile Photo</label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setGalleryOpen(true)}
                className="flex-1 bg-gradient-to-r from-brand-500 to-sky-500 hover:from-brand-600 hover:to-sky-600 text-white font-semibold py-2.5 px-4 rounded-xl transition-all flex items-center justify-center gap-2 text-sm"
              >
                <Grid3x3 className="w-4 h-4" />
                Browse Gallery
              </button>
              <div className="flex-1 relative">
                <Image className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  value={profileForm.avatarUrl}
                  onChange={(e) => setProfileForm({ ...profileForm, avatarUrl: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl pl-10 pr-3 py-2.5 text-sm text-slate-900 dark:text-white"
                  placeholder="Or paste URL"
                />
              </div>
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">New Password (optional)</label>
            <input
              type="password"
              value={profileForm.password}
              onChange={(e) => setProfileForm({ ...profileForm, password: e.target.value })}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-sm text-slate-900 dark:text-white"
              placeholder="Leave blank to keep current password"
            />
          </div>

          <div className="md:col-span-2 flex items-center justify-end gap-3 pt-2">
            {profileMessage && (
              <p className="text-sm text-emerald-600 dark:text-emerald-400">{profileMessage}</p>
            )}
            {profileError && (
              <p className="text-sm text-rose-600 dark:text-rose-400">{profileError}</p>
            )}
            <button
              type="submit"
              disabled={savingProfile}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-sm font-semibold"
            >
              <Save className="w-4 h-4" />
              {savingProfile ? 'Saving...' : 'Save Profile'}
            </button>
          </div>
        </form>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatsCard
          title="Total Complaints"
          value={totalCount}
          icon={Inbox}
          color="blue"
          subtitle="All tickets filed by you"
        />
        <StatsCard
          title="Pending Review"
          value={submittedCount}
          icon={Clock}
          color="amber"
          subtitle="Awaiting admin triage"
        />
        <StatsCard
          title="In Progress"
          value={inProgressCount}
          icon={AlertTriangle}
          color="purple"
          subtitle="Assigned & being resolved"
        />
        <StatsCard
          title="Resolved & Closed"
          value={resolvedCount}
          icon={CheckCircle2}
          color="emerald"
          subtitle="Successfully fixed"
        />
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-card p-4 sm:p-5 rounded-2xl mb-6 border border-slate-200 dark:border-slate-800 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title, description, or location..."
              className="w-full bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all"
            />
          </div>

          {/* Category Dropdown */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-slate-500 dark:text-slate-400" />
              <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">Category:</span>
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-brand-500 shadow-sm"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Status Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 text-xs">
          <span className="text-slate-500 dark:text-slate-400 font-medium whitespace-nowrap">Status:</span>
          {STATUSES.map((st) => (
            <button
              key={st}
              onClick={() => setSelectedStatus(st)}
              className={`px-3 py-1.5 rounded-xl font-medium whitespace-nowrap transition-all ${
                selectedStatus === st
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-900/80 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Complaints List */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center space-y-3">
          <Loader2 className="w-8 h-8 text-brand-600 dark:text-brand-400 animate-spin" />
          <p className="text-sm text-slate-600 dark:text-slate-400">Loading your complaints...</p>
        </div>
      ) : filteredComplaints.length === 0 ? (
        <div className="glass-card p-12 rounded-3xl border border-slate-200 dark:border-slate-800 text-center">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-center justify-center mx-auto text-slate-500 dark:text-slate-400 mb-4">
            <Inbox className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">No complaints found</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-sm mx-auto">
            {search || selectedStatus !== 'All' || selectedCategory !== 'All'
              ? 'No tickets match your filter criteria. Try adjusting the search filters.'
              : "You haven't lodged any complaints yet. If you are experiencing any campus issues, submit one now."}
          </p>
          <div className="mt-6">
            <Link
              to="/student/complaint/new"
              className="inline-flex items-center space-x-2 px-5 py-2.5 bg-brand-600 hover:bg-brand-500 text-white text-sm font-semibold rounded-xl transition-all shadow-glow-brand"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Submit First Complaint</span>
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-3.5">
          {filteredComplaints.map((item) => (
            <Link
              key={item._id}
              to={`/student/complaint/${item._id}`}
              className="block glass-card p-5 rounded-2xl border border-slate-200 dark:border-slate-800/90 hover:border-brand-300 dark:hover:border-brand-500/40 hover:bg-slate-50/50 dark:hover:bg-slate-900/60 transition-all duration-200 group"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                      {item.category}
                    </span>
                    <PriorityBadge priority={item.priority} size="sm" />
                    <StatusBadge status={item.status} size="sm" />
                  </div>

                  <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-300 transition-colors line-clamp-1">
                    {item.title}
                  </h3>

                  <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
                    {item.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400 pt-1">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {item.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      {new Date(item.createdAt).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                    {item.assignedTo && item.assignedTo !== 'Unassigned' && (
                      <span className="text-brand-600 dark:text-brand-400 font-semibold">
                        Assigned: {item.assignedTo}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-end sm:pl-4">
                  <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800/80 group-hover:bg-brand-600 group-hover:text-white text-slate-400 flex items-center justify-center transition-all">
                    <ChevronRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;
