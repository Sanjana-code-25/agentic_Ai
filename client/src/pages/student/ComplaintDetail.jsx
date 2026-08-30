import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { complaintService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
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
  Clock,
  ShieldCheck,
  Star,
  Timer,
  Send,
  Sparkles,
} from 'lucide-react';

export const ComplaintDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Student Feedback States
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [feedbackComment, setFeedbackComment] = useState('');
  const [submittingFeedback, setSubmittingFeedback] = useState(false);
  const [feedbackSuccess, setFeedbackSuccess] = useState('');
  const [feedbackError, setFeedbackError] = useState('');

  const fetchDetail = async () => {
    try {
      const res = await complaintService.getComplaintById(id);
      if (res.data.success) {
        setComplaint(res.data.complaint);
      } else {
        setError(res.data.message || 'Could not load complaint details');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching complaint');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetail();
  }, [id]);

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    setFeedbackError('');
    setFeedbackSuccess('');
    setSubmittingFeedback(true);

    try {
      const res = await complaintService.submitFeedback(id, {
        rating,
        comment: feedbackComment,
      });

      if (res.data.success) {
        setComplaint(res.data.complaint);
        setFeedbackSuccess('Thank you! Your feedback has been submitted.');
      } else {
        setFeedbackError(res.data.message || 'Failed to submit feedback');
      }
    } catch (err) {
      setFeedbackError(
        err.response?.data?.message || 'Server error while submitting feedback'
      );
    } finally {
      setSubmittingFeedback(false);
    }
  };

  if (loading) {
    return (
      <div className="py-32 flex flex-col items-center justify-center space-y-3">
        <Loader2 className="w-8 h-8 text-brand-600 dark:text-brand-400 animate-spin" />
        <p className="text-sm text-slate-600 dark:text-slate-400">Loading complaint status & details...</p>
      </div>
    );
  }

  if (error || !complaint) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <div className="glass-panel p-8 rounded-3xl border border-rose-200 dark:border-rose-500/20 max-w-md mx-auto shadow-sm">
          <AlertCircle className="w-12 h-12 text-rose-500 dark:text-rose-400 mx-auto mb-3" />
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Unable to load ticket</h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">{error || 'Complaint not found'}</p>
          <Link
            to="/student/dashboard"
            className="inline-flex items-center space-x-2 px-5 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-white text-sm font-semibold rounded-xl transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Dashboard</span>
          </Link>
        </div>
      </div>
    );
  }

  const isResolvedOrClosed = ['Resolved', 'Closed'].includes(complaint.status);
  const isOwnerStudent =
    user?.role === 'student' &&
    (complaint.studentId?._id === user?._id || complaint.studentId === user?._id);

  // Format Duration string
  const getDurationText = () => {
    if (complaint.resolutionDurationHours) {
      if (complaint.resolutionDurationHours < 1) {
        return `${Math.round(complaint.resolutionDurationHours * 60)} minutes`;
      }
      if (complaint.resolutionDurationHours < 24) {
        return `${complaint.resolutionDurationHours} hours`;
      }
      const days = (complaint.resolutionDurationHours / 24).toFixed(1);
      return `${days} days (${complaint.resolutionDurationHours} hrs)`;
    }
    return 'Under 4 hours';
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <Link
        to="/student/dashboard"
        className="inline-flex items-center space-x-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to My Dashboard</span>
      </Link>

      <div className="space-y-6">
        {/* Header Summary Card */}
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
              Resolution Progress Lifecycle
            </h3>
            <ComplaintTimeline currentStatus={complaint.status} />
          </div>
        </div>

        {/* ⏱️ Resolution Time Tracking Banner (if resolved or closed) */}
        {isResolvedOrClosed && (
          <div className="glass-panel p-5 rounded-3xl border border-emerald-200 dark:border-emerald-500/30 bg-gradient-to-r from-emerald-50/80 via-white to-sky-50/60 dark:from-emerald-950/20 dark:via-slate-900 dark:to-sky-950/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
            <div className="flex items-center space-x-3.5">
              <div className="p-3 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 rounded-2xl border border-emerald-200 dark:border-emerald-500/40">
                <Timer className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-800 dark:text-emerald-400 block">
                  Turnaround Resolution Metrics
                </span>
                <p className="text-base font-extrabold text-slate-900 dark:text-white">
                  Resolved in <span className="text-emerald-600 dark:text-emerald-400">{getDurationText()}</span>
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Closed on {complaint.resolvedAt ? new Date(complaint.resolvedAt).toLocaleString(undefined, { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Verified complete'}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2 self-start sm:self-auto">
              <span className="px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-500/40 flex items-center gap-1.5 shadow-sm">
                <CheckCircle2 className="w-4 h-4" />
                <span>SLA Fulfilled</span>
              </span>
            </div>
          </div>
        )}

        {/* Complaint Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Description & Photo Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <div className="glass-card p-6 rounded-3xl border border-slate-200 dark:border-slate-800">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-white mb-3 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                Issue Description
              </h2>
              <p className="text-slate-700 dark:text-white text-sm leading-relaxed whitespace-pre-wrap">
                {complaint.description}
              </p>
            </div>

            {/* Photo Attachment */}
            {complaint.imageURL && (
              <div className="glass-card p-6 rounded-3xl border border-slate-200 dark:border-slate-800">
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-2">
                  <FileImage className="w-4 h-4 text-brand-600 dark:text-brand-400" />
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

            {/* Final Resolution Details */}
            {complaint.resolutionDetails && (
              <div className="glass-card p-6 rounded-3xl border border-emerald-300 dark:border-emerald-500/30 bg-emerald-50/70 dark:bg-emerald-950/10 shadow-sm">
                <h2 className="text-sm font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400 mb-2 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  Official Resolution Summary
                </h2>
                <p className="text-slate-800 dark:text-white text-sm leading-relaxed whitespace-pre-wrap">
                  {complaint.resolutionDetails}
                </p>
              </div>
            )}

            {/* ⭐ Student Resolution Feedback Section */}
            {isResolvedOrClosed && (
              <div className="glass-card p-6 sm:p-7 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                <div className="flex items-center space-x-2.5 pb-3 border-b border-slate-200 dark:border-slate-800">
                  <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                  <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
                    Student Resolution Feedback & Rating
                  </h2>
                </div>

                {/* If feedback was already submitted */}
                {complaint.feedback?.rating ? (
                  <div className="p-5 rounded-2xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-500/30 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-amber-800 dark:text-amber-300">
                        Student CSAT Rating:
                      </span>
                      <div className="flex items-center space-x-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-5 h-5 ${
                              star <= complaint.feedback.rating
                                ? 'text-amber-500 fill-amber-500'
                                : 'text-slate-300 dark:text-slate-700'
                            }`}
                          />
                        ))}
                        <span className="font-extrabold text-slate-900 dark:text-white text-sm ml-1.5">
                          {complaint.feedback.rating}.0 / 5.0
                        </span>
                      </div>
                    </div>

                    {complaint.feedback.comment && (
                      <p className="text-xs text-slate-700 dark:text-slate-300 italic pt-1">
                        "{complaint.feedback.comment}"
                      </p>
                    )}

                    <p className="text-[10px] text-slate-400 pt-1">
                      Submitted on{' '}
                      {new Date(
                        complaint.feedback.submittedAt || complaint.updatedAt
                      ).toLocaleDateString()}
                    </p>
                  </div>
                ) : isOwnerStudent ? (
                  // Form for owner student to submit feedback
                  <form onSubmit={handleFeedbackSubmit} className="space-y-4">
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      How satisfied are you with the speed and quality of this resolution?
                    </p>

                    {feedbackError && (
                      <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
                        <AlertCircle className="w-4 h-4" />
                        <span>{feedbackError}</span>
                      </div>
                    )}

                    {feedbackSuccess && (
                      <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>{feedbackSuccess}</span>
                      </div>
                    )}

                    {/* Star Rating Picker */}
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                        Rate Resolution Quality (1 - 5 Stars)
                      </label>
                      <div className="flex items-center space-x-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setRating(star)}
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(0)}
                            className="p-1 text-slate-300 dark:text-slate-700 hover:scale-125 transition-transform"
                          >
                            <Star
                              className={`w-7 h-7 ${
                                star <= (hoverRating || rating)
                                  ? 'text-amber-500 fill-amber-500'
                                  : 'text-slate-300 dark:text-slate-700'
                              }`}
                            />
                          </button>
                        ))}
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-300 ml-2">
                          {rating === 5 && '🌟 Excellent'}
                          {rating === 4 && '👍 Very Good'}
                          {rating === 3 && '👌 Satisfactory'}
                          {rating === 2 && '👎 Needs Improvement'}
                          {rating === 1 && '❌ Unsatisfactory'}
                        </span>
                      </div>
                    </div>

                    {/* Feedback Comment */}
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                        Comments / Suggestions (Optional)
                      </label>
                      <textarea
                        rows={2}
                        value={feedbackComment}
                        onChange={(e) => setFeedbackComment(e.target.value)}
                        placeholder="Was the technician helpful? Did this fix your issue completely?"
                        className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl p-3 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-brand-500 shadow-sm"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={submittingFeedback}
                      className="px-5 py-2.5 bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold rounded-xl shadow-glow-brand transition-all flex items-center space-x-2 disabled:opacity-50"
                    >
                      {submittingFeedback ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Submitting...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-3.5 h-3.5" />
                          <span>Submit Resolution Feedback</span>
                        </>
                      )}
                    </button>
                  </form>
                ) : (
                  <p className="text-xs text-slate-500 italic">
                    Awaiting student satisfaction review.
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Sidebar Info Column */}
          <div className="space-y-6">
            {/* Assignment & Department Info */}
            <div className="glass-card p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                Assignment & Staff
              </h2>

              <div>
                <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                  Assigned Team / Technician
                </span>
                <p className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                  {complaint.assignedTo || 'Unassigned'}
                </p>
              </div>

              {complaint.adminComments ? (
                <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
                  <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-300 uppercase tracking-wider block">
                    Admin / Staff Remarks
                  </span>
                  <p className="text-xs text-slate-700 dark:text-white mt-1 italic bg-slate-100 dark:bg-slate-900/80 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                    "{complaint.adminComments}"
                  </p>
                </div>
              ) : (
                <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
                  <span className="text-xs text-slate-400 dark:text-slate-200 italic">
                    No administrator remarks posted yet.
                  </span>
                </div>
              )}
            </div>

            {/* Student Info */}
            <div className="glass-card p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <User className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                Submitted By
              </h2>
              <div>
                <p className="text-sm font-bold text-slate-900 dark:text-white">
                  {complaint.studentId?.name || 'Student'}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {complaint.studentId?.email}
                </p>
                {complaint.studentId?.department && (
                  <p className="text-xs text-brand-600 dark:text-brand-400 mt-0.5 font-semibold">
                    {complaint.studentId.department}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComplaintDetail;
