import React, { useState } from 'react';
import { X, Grid3x3 } from 'lucide-react';

// Sample professional avatar photos from Unsplash
const AVATAR_GALLERY = [
  {
    id: 1,
    name: 'Professional 1',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
  },
  {
    id: 2,
    name: 'Professional 2',
    url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
  },
  {
    id: 3,
    name: 'Professional 3',
    url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop',
  },
  {
    id: 4,
    name: 'Professional 4',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&flip=h',
  },
  {
    id: 5,
    name: 'Professional 5',
    url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop',
  },
  {
    id: 6,
    name: 'Professional 6',
    url: 'https://images.unsplash.com/photo-1519915212-85e47b4a6b54?w=400&h=400&fit=crop',
  },
  {
    id: 7,
    name: 'Professional 7',
    url: 'https://images.unsplash.com/photo-1537368310025-700d6a53399b?w=400&h=400&fit=crop',
  },
  {
    id: 8,
    name: 'Professional 8',
    url: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&h=400&fit=crop',
  },
  {
    id: 9,
    name: 'Professional 9',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69da49?w=400&h=400&fit=crop',
  },
  {
    id: 10,
    name: 'Professional 10',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&brightness=0.8',
  },
  {
    id: 11,
    name: 'Professional 11',
    url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop&flip=h',
  },
  {
    id: 12,
    name: 'Professional 12',
    url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&brightness=0.9',
  },
];

export const ProfilePhotoGallery = ({ isOpen, onClose, onSelectPhoto, currentPhotoUrl }) => {
  const [selectedId, setSelectedId] = useState(null);

  const handleSelectPhoto = (photo) => {
    setSelectedId(photo.id);
    onSelectPhoto(photo.url);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
          <div className="flex items-center gap-3">
            <Grid3x3 className="w-5 h-5 text-brand-600 dark:text-brand-400" />
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              Select Profile Photo
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-slate-600 dark:text-slate-400" />
          </button>
        </div>

        {/* Gallery Grid */}
        <div className="p-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {AVATAR_GALLERY.map((photo) => (
              <button
                key={photo.id}
                onClick={() => handleSelectPhoto(photo)}
                className={`relative group rounded-xl overflow-hidden transition-all transform hover:scale-105 ${
                  currentPhotoUrl === photo.url || selectedId === photo.id
                    ? 'ring-4 ring-brand-500 scale-105'
                    : 'hover:ring-2 hover:ring-brand-300 dark:hover:ring-brand-600'
                }`}
              >
                <img
                  src={photo.url}
                  alt={photo.name}
                  className="w-full h-32 object-cover"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                  {(currentPhotoUrl === photo.url || selectedId === photo.id) && (
                    <div className="w-8 h-8 bg-brand-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-lg font-bold">✓</span>
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>

          <p className="text-sm text-slate-600 dark:text-slate-400 mt-6 text-center">
            Click any photo to select it for your profile
          </p>
        </div>

        {/* Footer Actions */}
        <div className="sticky bottom-0 flex justify-end gap-3 p-6 border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-semibold rounded-xl transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePhotoGallery;
