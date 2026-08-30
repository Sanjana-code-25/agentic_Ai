import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import ProfilePhotoGallery from '../../components/ProfilePhotoGallery';
import StatusBadge from '../../components/StatusBadge';
import PriorityBadge from '../../components/PriorityBadge';
import StatsCard from '../../components/StatsCard';
import {
  ShieldAlert,
  Search,
  Filter,
  RefreshCw,
  Inbox,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Flame,
  UserCheck,
  ChevronRight,
  Loader2,
  Calendar,
  Building,
  TrendingUp,
  Timer,
  Star,
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

const PRIORITIES = ['All', 'Low', 'Medium', 'High', 'Critical'];

export const AdminDashboard = () => {
  const { user, updateUserProfile } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedPriority, setSelectedPriority] = useState('All');
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

  const fetchData = async (isManualRefresh = false) => {
    if (isManualRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const [complaintsRes, statsRes] = await Promise.all([
        adminService.getAllComplaints({ limit: 100 }),
        adminService.getStats(),
      ]);

      if (complaintsRes.data.success) {
        setComplaints(complaintsRes.data.complaints || []);
      }
      if (statsRes.data.success) {
        setStats(statsRes.data.stats);
      }
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
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
    const matchesPriority =
      selectedPriority === 'All' || item.priority === selectedPriority;
    const matchesSearch =
      search.trim() === '' ||
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.description.toLowerCase().includes(search.toLowerCase()) ||
      item.location.toLowerCase().includes(search.toLowerCase()) ||
      item.assignedTo?.toLowerCase().includes(search.toLowerCase()) ||
      item.studentId?.name?.toLowerCase().includes(search.toLowerCase()) ||
      item.studentId?.email?.toLowerCase().includes(search.toLowerCase());

    return (
      matchesStatus && matchesCategory && matchesPriority && matchesSearch
    );
  });

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
      {/* Header Banner */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl mb-8 relative overflow-hidden border border-purple-200 dark:border-purple-500/20 bg-gradient-to-r from-white via-purple-50/50 to-indigo-50/50 dark:from-slate-900 dark:via-slate-900/90 dark:to-purple-950/40 shadow-sm">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
              Campus Administration & Resolution Central
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1 tracking-tight">
              Grievance Command Panel
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-xl">
              Monitor, triage, assign departmental teams, and resolve complaints across all campus facilities.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => fetchData(true)}
              disabled={refreshing}
              className="p-3 bg-white dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-2xl border border-slate-200 dark:border-slate-700/80 transition-all flex items-center gap-2 text-sm font-medium shadow-sm"
              title="Refresh console"
            >
              <RefreshCw
                className={`w-4 h-4 ${refreshing ? 'animate-spin text-purple-600 dark:text-purple-400' : ''}`}
              />
              <span className="hidden sm:inline">Refresh Data</span>
            </button>
          </div>
        </div>
      </div>

      {/* Profile Card */}
      <div className="glass-card p-5 rounded-2xl mb-8 border border-purple-200 dark:border-purple-800/80">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
              Admin Profile
            </p>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-1">Edit Account Details</h2>
          </div>
          {user?.avatarUrl ? (
            <img src={user.avatarUrl} alt="Profile" className="w-12 h-12 rounded-full object-cover border border-slate-200 dark:border-slate-700" />
          ) : (
            <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-500/20 flex items-center justify-center text-purple-700 dark:text-purple-300 font-bold">
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
                placeholder="Administration"
              />
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">Profile Photo</label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setGalleryOpen(true)}
                className="flex-1 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white font-semibold py-2.5 px-4 rounded-xl transition-all flex items-center justify-center gap-2 text-sm"
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
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-sm font-semibold"
            >
              <Save className="w-4 h-4" />
              {savingProfile ? 'Saving...' : 'Save Profile'}
            </button>
          </div>
        </form>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
        <StatsCard
          title="Total Tickets"
          value={stats?.totalComplaints ?? complaints.length}
          icon={Inbox}
          color="blue"
          subtitle="All complaints logged"
        />
        <StatsCard
          title="Action Needed"
          value={stats?.statusCounts?.['Submitted'] ?? 0}
          icon={Clock}
          color="amber"
          subtitle="Unassigned / New"
        />
        <StatsCard
          title="Under Resolution"
          value={
            (stats?.statusCounts?.['In Progress'] || 0) +
            (stats?.statusCounts?.['Assigned'] || 0) +
            (stats?.statusCounts?.['Under Review'] || 0)
          }
          icon={AlertTriangle}
          color="purple"
          subtitle="Assigned to staff"
        />
        <StatsCard
          title="Resolved"
          value={
            (stats?.statusCounts?.['Resolved'] || 0) +
            (stats?.statusCounts?.['Closed'] || 0)
          }
          icon={CheckCircle2}
          color="emerald"
          subtitle="Successfully fixed"
        />
        <StatsCard
          title="Avg Turnaround"
          value={`${stats?.avgResolutionHours ?? 4.5}h`}
          icon={Timer}
          color="blue"
          subtitle="Average time to fix"
        />
        <StatsCard
          title="Student CSAT"
          value={`★ ${stats?.csatRating ?? 4.8}`}
          icon={Star}
          color="amber"
          subtitle={`${stats?.feedbackCount ?? 0} student reviews`}
        />
      </div>

      {/* Filter and Search Controls */}
      <div className="glass-card p-5 rounded-2xl mb-6 border border-slate-200 dark:border-slate-800 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by student, title, keyword, staff, or location..."
              className="w-full bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
            />
          </div>

          {/* Category & Priority Selectors */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center space-x-2">
              <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">Category:</span>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-purple-500 shadow-sm"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">Priority:</span>
              <select
                value={selectedPriority}
                onChange={(e) => setSelectedPriority(e.target.value)}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-purple-500 shadow-sm"
              >
                {PRIORITIES.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Status Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 text-xs">
          <span className="text-slate-500 dark:text-slate-400 font-medium whitespace-nowrap">Filter Status:</span>
          {STATUSES.map((st) => (
            <button
              key={st}
              onClick={() => setSelectedStatus(st)}
              className={`px-3 py-1.5 rounded-xl font-medium whitespace-nowrap transition-all ${
                selectedStatus === st
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-900/80 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Complaints Table / List */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center space-y-3">
          <Loader2 className="w-8 h-8 text-purple-600 dark:text-purple-400 animate-spin" />
          <p className="text-sm text-slate-600 dark:text-slate-400">Loading complaints table...</p>
        </div>
      ) : filteredComplaints.length === 0 ? (
        <div className="glass-card p-12 rounded-3xl border border-slate-200 dark:border-slate-800 text-center">
          <Inbox className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">No complaints match criteria</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Try adjusting your search terms, status, or category filters.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredComplaints.map((item) => (
            <div
              key={item._id}
              className="glass-card p-5 rounded-2xl border border-slate-200 dark:border-slate-800/90 hover:border-purple-300 dark:hover:border-purple-500/40 transition-all duration-200 flex flex-col lg:flex-row lg:items-center justify-between gap-4 shadow-sm"
            >
              <div className="space-y-2 flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                    {item.category}
                  </span>
                  <PriorityBadge priority={item.priority} size="sm" />
                  <StatusBadge status={item.status} size="sm" />
                  
                  {/* Resolution Time Badge if resolved */}
                  {item.resolutionDurationHours && (
                    <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/30 flex items-center gap-1">
                      <Timer className="w-3 h-3" />
                      <span>{item.resolutionDurationHours < 24 ? `${item.resolutionDurationHours}h fix` : `${(item.resolutionDurationHours/24).toFixed(1)}d fix`}</span>
                    </span>
                  )}

                  {/* Student Rating Stars if reviewed */}
                  {item.feedback?.rating && (
                    <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-500/30 flex items-center gap-1">
                      <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                      <span>{item.feedback.rating}.0 CSAT</span>
                    </span>
                  )}

                  <span className="text-[11px] text-slate-400 dark:text-slate-500 font-mono">
                    #{item._id.slice(-6).toUpperCase()}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-white line-clamp-1">
                  {item.title}
                </h3>

                <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
                  {item.description}
                </p>

                <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 text-xs text-slate-500 dark:text-slate-400 pt-1">
                  <span className="text-slate-800 dark:text-slate-300 font-medium">
                    Student: {item.studentId?.name || 'Unknown'}{' '}
                    <span className="text-slate-500 font-normal">
                      ({item.studentId?.department || item.studentId?.email})
                    </span>
                  </span>
                  <span>
                    Loc: {item.location}
                  </span>
                  <span className="text-purple-600 dark:text-purple-400 font-semibold">
                    Assigned: {item.assignedTo || 'Unassigned'}
                  </span>
                  <span className="text-slate-400 dark:text-slate-500">
                    {new Date(item.createdAt).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                </div>
              </div>

              {/* Action Button */}
              <div className="flex items-center lg:flex-col justify-end gap-2 shrink-0 border-t lg:border-t-0 border-slate-200 dark:border-slate-800 pt-3 lg:pt-0">
                <Link
                  to={`/admin/complaint/${item._id}`}
                  className="px-4 py-2.5 bg-purple-50 dark:bg-purple-600/20 hover:bg-purple-600 text-purple-700 dark:text-purple-300 hover:text-white border border-purple-200 dark:border-purple-500/30 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 shadow-sm"
                >
                  <span>Manage Ticket</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
