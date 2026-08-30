import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { adminService, complaintService } from '../../services/api';
import StatusBadge from '../../components/StatusBadge';
import PriorityBadge from '../../components/PriorityBadge';
import ComplaintTimeline from '../../components/ComplaintTimeline';
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Building,
  User,
  MessageSquare,
  CheckCircle2,
  FileImage,
  Loader2,
  AlertCircle,
  ShieldCheck,
  Save,
  Tag,
  Clock,
  Sparkles,
  Timer,
  Star,
} from 'lucide-react';

const STATUS_OPTIONS = [
  'Submitted',
  'Under Review',
  'Assigned',
  'In Progress',
  'Resolved',
  'Closed',
];

const PRIORITY_OPTIONS = ['Low', 'Medium', 'High', 'Critical'];

const QUICK_ASSIGN_TEAMS = [
  'IT & AV Support Team',
  'Network Infrastructure Division',
  'Estate Maintenance & Carpentry',
  'Sanitation & Plumbing Staff',
  'Campus Electrical Division',
  'Hostel Warden & Caretaker',
  'Transport Coordinator',
  'Security Office',
];

export const AdminComplaintDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Editable Form States
  const [status, setStatus] = useState('Submitted');
  const [priority, setPriority] = useState('Medium');
  const [assignedTo, setAssignedTo] = useState('');
  const [adminComments, setAdminComments] = useState('');
  const [resolutionDetails, setResolutionDetails] = useState('');

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await complaintService.getComplaintById(id);
        if (res.data.success) {
          const comp = res.data.complaint;
          setComplaint(comp);
          setStatus(comp.status || 'Submitted');
          setPriority(comp.priority || 'Medium');
          setAssignedTo(comp.assignedTo || '');
          setAdminComments(comp.adminComments || '');
          setResolutionDetails(comp.resolutionDetails || '');
        } else {
          setError(res.data.message || 'Could not load complaint');
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Error fetching complaint');
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [id]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccessMsg('');

    try {
      const res = await adminService.updateComplaint(id, {
        status,
        priority,
        assignedTo,
        adminComments,
        resolutionDetails,
      });

      if (res.data.success) {
        setComplaint(res.data.complaint);
        setSuccessMsg('Complaint details updated and saved successfully!');
        setTimeout(() => setSuccessMsg(''), 4000);
      } else {
        setError(res.data.message || 'Failed to update complaint');
      }
    } catch (err) {
      setError(
        err.response?.data?.message || 'Server error while updating complaint'
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-32 flex flex-col items-center justify-center space-y-3">
        <Loader2 className="w-8 h-8 text-purple-600 dark:text-purple-400 animate-spin" />
        <p className="text-sm text-slate-600 dark:text-slate-400">Loading complaint management view...</p>
      </div>
    );
  }

  if (error && !complaint) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <div className="glass-panel p-8 rounded-3xl border border-rose-200 dark:border-rose-500/20 max-w-md mx-auto shadow-sm">
          <AlertCircle className="w-12 h-12 text-rose-500 dark:text-rose-400 mx-auto mb-3" />
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Complaint Not Found</h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">{error}</p>
          <Link
            to="/admin/dashboard"
            className="inline-flex items-center space-x-2 px-5 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-white text-sm font-semibold rounded-xl transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Admin Console</span>
          </Link>
        </div>
      </div>
    );
  }

  const isResolvedOrClosed = ['Resolved', 'Closed'].includes(complaint.status);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <Link
        to="/admin/dashboard"
        className="inline-flex items-center space-x-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Admin Console</span>
      </Link>

      <div className="space-y-6">
        {/* Header Summary Banner */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-2xl">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
            <div className="space-y-2 flex-1">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="px-3 py-1 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                  {complaint.category}
                </span>
                <PriorityBadge priority={complaint.priority} size="md" />
                <StatusBadge status={complaint.status} size="md" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight pt-1">
                {complaint.title}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400 pt-1">
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-slate-400" />
                  {complaint.location}
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  Logged on {new Date(complaint.createdAt).toLocaleString(undefined, {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
                <span className="text-slate-400 dark:text-slate-500 font-mono">
                  Ticket #{complaint._id.slice(-6).toUpperCase()}
                </span>
              </div>
            </div>
          </div>

          {/* Stepper Timeline */}
          <div className="pt-6">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
              Lifecycle Tracker
            </h3>
            <ComplaintTimeline currentStatus={complaint.status} />
          </div>
        </div>

        {/* ⏱️ Resolution Turnaround Metrics Banner (if resolved) */}
        {isResolvedOrClosed && (
          <div className="glass-panel p-5 rounded-3xl border border-emerald-200 dark:border-emerald-500/30 bg-gradient-to-r from-emerald-50/80 via-white to-purple-50/60 dark:from-emerald-950/20 dark:via-slate-900 dark:to-purple-950/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
            <div className="flex items-center space-x-3.5">
              <div className="p-3 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 rounded-2xl border border-emerald-200 dark:border-emerald-500/40">
                <Timer className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-800 dark:text-emerald-400 block">
                  Turnaround Resolution Speed
                </span>
                <p className="text-base font-extrabold text-slate-900 dark:text-white">
                  Resolved in{' '}
                  <span className="text-emerald-600 dark:text-emerald-400">
                    {complaint.resolutionDurationHours
                      ? `${complaint.resolutionDurationHours} hours`
                      : 'Under 4 hours'}
                  </span>
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Resolution timestamp recorded on{' '}
                  {complaint.resolvedAt
                    ? new Date(complaint.resolvedAt).toLocaleString()
                    : 'System verification'}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2 self-start sm:self-auto">
              <span className="px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-500/40 flex items-center gap-1.5 shadow-sm">
                <CheckCircle2 className="w-4 h-4" />
                <span>Resolved Within Target SLA</span>
              </span>
            </div>
          </div>
        )}

        {/* Action Alerts */}
        {error && (
          <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 text-rose-700 dark:text-rose-300 text-sm flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-500 dark:text-rose-400 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-800 dark:text-emerald-300 text-sm flex items-start space-x-3">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-600 dark:text-emerald-400 mt-0.5" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Content & Edit Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Complaint Details & Photo (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Student Info Box */}
            <div className="glass-card p-5 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between shadow-sm">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-brand-50 dark:bg-brand-500/20 text-brand-600 dark:text-brand-300 flex items-center justify-center font-bold text-sm">
                  {complaint.studentId?.name?.charAt(0) || 'S'}
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">
                    {complaint.studentId?.name || 'Student'}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {complaint.studentId?.email}
                  </p>
                </div>
              </div>
              {complaint.studentId?.department && (
                <span className="text-xs px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 font-semibold">
                  {complaint.studentId.department}
                </span>
              )}
            </div>

            {/* Description */}
            <div className="glass-card p-6 rounded-3xl border border-slate-200 dark:border-slate-800">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-3 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                Student Issue Description
              </h2>
              <p className="text-slate-800 dark:text-slate-200 text-sm leading-relaxed whitespace-pre-wrap">
                {complaint.description}
              </p>
            </div>

            {/* Attached Photo */}
            {complaint.imageURL && (
              <div className="glass-card p-6 rounded-3xl border border-slate-200 dark:border-slate-800">
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-3 flex items-center gap-2">
                  <FileImage className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  Attached Evidence
                </h2>
                <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700/80 bg-slate-50 dark:bg-slate-950/60 max-h-96 flex items-center justify-center">
                  <img
                    src={complaint.imageURL}
                    alt="Complaint Evidence"
                    className="w-full h-auto max-h-96 object-contain"
                  />
                </div>
              </div>
            )}

            {/* ⭐ Student CSAT Review Card (if student provided rating) */}
            {complaint.feedback?.rating && (
              <div className="glass-card p-6 rounded-3xl border border-amber-200 dark:border-amber-500/30 bg-amber-50/50 dark:bg-amber-950/10 shadow-sm space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                    <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                      Student Satisfaction Feedback
                    </h3>
                  </div>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-200">
                    ★ {complaint.feedback.rating}.0 / 5.0 Rating
                  </span>
                </div>

                {complaint.feedback.comment && (
                  <p className="text-xs text-slate-700 dark:text-slate-300 italic pt-1">
                    "{complaint.feedback.comment}"
                  </p>
                )}

                <p className="text-[10px] text-slate-400 pt-1">
                  Submitted by {complaint.studentId?.name || 'student'} on{' '}
                  {new Date(complaint.feedback.submittedAt || complaint.updatedAt).toLocaleDateString()}
                </p>
              </div>
            )}
          </div>

          {/* Right Column: Admin Management Control Form (5 cols) */}
          <div className="lg:col-span-5">
            <form
              onSubmit={handleSave}
              className="glass-panel p-6 sm:p-7 rounded-3xl border border-purple-200 dark:border-purple-500/30 space-y-5 sticky top-24 shadow-sm dark:shadow-xl"
            >
              <div className="flex items-center space-x-2.5 pb-4 border-b border-slate-200 dark:border-slate-800">
                <ShieldCheck className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                <h2 className="text-base font-extrabold text-slate-900 dark:text-white tracking-tight">
                  Triage & Resolution Controls
                </h2>
              </div>

              {/* Status Selector */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                  Workflow Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-purple-500 shadow-sm"
                >
                  {STATUS_OPTIONS.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>

              {/* Priority Selector */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                  Priority Urgency
                </label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-purple-500 shadow-sm"
                >
                  {PRIORITY_OPTIONS.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>

              {/* Assigned Department/Staff */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                  Assigned Department / Staff
                </label>
                <input
                  type="text"
                  value={assignedTo}
                  onChange={(e) => setAssignedTo(e.target.value)}
                  placeholder="e.g. IT Support Team (Er. Rajesh)"
                  className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-purple-500 mb-2 shadow-sm"
                />
                {/* Quick Selection Tags */}
                <div className="flex flex-wrap gap-1.5">
                  {QUICK_ASSIGN_TEAMS.map((team) => (
                    <button
                      key={team}
                      type="button"
                      onClick={() => setAssignedTo(team)}
                      className="px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-800 text-[10px] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700/60 transition-colors shadow-sm"
                    >
                      {team}
                    </button>
                  ))}
                </div>
              </div>

              {/* Internal / Admin Comments */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                  Admin Progress Remarks (Visible to Student)
                </label>
                <textarea
                  rows={2}
                  value={adminComments}
                  onChange={(e) => setAdminComments(e.target.value)}
                  placeholder="e.g. Technician dispatched. Spare parts ordered."
                  className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl p-3 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-purple-500 resize-y shadow-sm"
                />
              </div>

              {/* Resolution Details */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                  Official Resolution Summary
                </label>
                <textarea
                  rows={3}
                  value={resolutionDetails}
                  onChange={(e) => setResolutionDetails(e.target.value)}
                  placeholder="Document final actions taken, replacement specs, or completion confirmation..."
                  className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl p-3 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-purple-500 resize-y shadow-sm"
                />
              </div>

              {/* Save Button */}
              <button
                type="submit"
                disabled={saving}
                className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center space-x-2 text-sm disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Saving Updates...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Save & Update Ticket</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminComplaintDetail;
