'use client';

import React from 'react';

interface DisclaimerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DisclaimerModal({ isOpen, onClose }: DisclaimerModalProps) {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(4px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
      }}
      onClick={onClose}
    >
      <div
        style={{
          maxWidth: '560px',
          width: '100%',
          backgroundColor: '#120f0d',
          border: '1px solid rgba(251, 191, 36, 0.25)',
          borderRadius: '16px',
          padding: '24px',
          color: '#d1d5db',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.8)',
          position: 'relative',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '16px',
            borderBottom: '1px solid rgba(251, 191, 36, 0.15)',
            paddingBottom: '12px',
          }}
        >
          <h3
            style={{
              margin: 0,
              fontSize: '16px',
              fontWeight: 600,
              color: '#fbbf24',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            📜 Copyright & Media Disclaimer
          </h3>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#9ca3af',
              fontSize: '18px',
              cursor: 'pointer',
              lineHeight: 1,
              padding: '4px',
            }}
            title="Close"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div style={{ fontSize: '13px', lineHeight: '1.6', color: '#9ca3af' }}>
          <p style={{ marginBottom: '12px' }}>
            All devotional songs, musical compositions, chants, and video streams provided on{' '}
            <strong style={{ color: '#fef3c7' }}>Ayyappa Sannidhi Radio</strong> are the sole intellectual
            property and copyright of their respective original singers, lyricists, composers, production studios, and record labels.
          </p>

          <p style={{ marginBottom: '12px' }}>
            This platform functions strictly as an interactive media interface and{' '}
            <strong style={{ color: '#e5e7eb' }}>does not host, download, re-upload, or sell</strong> any proprietary audio files on its servers. All seeded tracks are delivered directly through the official{' '}
            <strong style={{ color: '#fbbf24' }}>YouTube IFrame Player API</strong> in complete accordance with YouTube Developer Terms of Service.
          </p>

          <p style={{ marginBottom: '16px' }}>
            All view counts, watch time, impressions, and ad revenues accrue directly to the respective content creators, original rights holders, and YouTube partner channels.
          </p>

          <div
            style={{
              padding: '12px',
              borderRadius: '8px',
              backgroundColor: 'rgba(251, 191, 36, 0.05)',
              border: '1px solid rgba(251, 191, 36, 0.1)',
              fontSize: '12px',
              color: '#d1d5db',
            }}
          >
            <strong style={{ color: '#fbbf24', display: 'block', marginBottom: '4px' }}>
              Content Removal & Inquiries
            </strong>
            If you are a copyright owner and wish to request content attribution changes or removal, please reach out to the site administrator.
          </div>
        </div>

        {/* Close Action */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
          <button
            onClick={onClose}
            style={{
              backgroundColor: '#b45309',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              padding: '8px 16px',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Understood
          </button>
        </div>
      </div>
    </div>
  );
}