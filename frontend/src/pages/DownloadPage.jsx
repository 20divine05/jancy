import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import DownloadCard from '../components/DownloadCard';
import PasscodeModal from '../components/PasscodeModal';
import ExpiredNotice from '../components/ExpiredNotice';

const DownloadPage = () => {
  const { id } = useParams();
  
  const [loading, setLoading] = useState(true);
  const [fileInfo, setFileInfo] = useState(null);
  const [isExpired, setIsExpired] = useState(false);
  
  // Passcode verification state
  const [passcode, setPasscode] = useState('');
  const [passcodeVerified, setPasscodeVerified] = useState(false);
  const [passcodeError, setPasscodeError] = useState(null);
  const [passcodeLoading, setPasscodeLoading] = useState(false);

  // File Download state
  const [downloading, setDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState(null);

  // Fetch File Info Metadata on Mount
  useEffect(() => {
    const fetchFileInfo = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`/api/files/info/${id}`);
        if (response.data.success) {
          setFileInfo(response.data.file);
          if (!response.data.file.requiresPasscode) {
            setPasscodeVerified(true);
          }
        }
      } catch (err) {
        console.error('Error fetching file info:', err);
        setIsExpired(true);
      } finally {
        setLoading(false);
      }
    };

    fetchFileInfo();
  }, [id]);

  // Handle Passcode Submission for Protected Files
  const handlePasscodeSubmit = async (enteredPasscode) => {
    setPasscodeLoading(true);
    setPasscodeError(null);
    setPasscode(enteredPasscode);

    try {
      const response = await axios.post(`/api/files/verify-passcode/${id}`, {
        passcode: enteredPasscode,
      });

      if (response.data.success) {
        setPasscodeVerified(true);
      }
    } catch (err) {
      console.error('Passcode verification error:', err);
      if (err.response?.status === 404) {
        setIsExpired(true);
      } else {
        setPasscodeError(err.response?.data?.message || 'Incorrect passcode');
      }
    } finally {
      setPasscodeLoading(false);
    }
  };

  // Trigger File Download CTA
  const handleDownloadFile = async () => {
    setDownloading(true);
    setDownloadError(null);

    try {
      const response = await axios.post(
        `/api/files/download/${id}`,
        { passcode: passcode },
        { responseType: 'blob' }
      );

      triggerBlobDownload(response.data, fileInfo.filename);

      // Refresh metadata or mark expired if download limit reached
      if (fileInfo.remainingDownloads <= 1) {
        setTimeout(() => setIsExpired(true), 2000);
      } else {
        setFileInfo((prev) => ({
          ...prev,
          downloadCount: prev.downloadCount + 1,
          remainingDownloads: prev.remainingDownloads - 1,
        }));
      }
    } catch (err) {
      console.error('Download error:', err);
      if (err.response && err.response.data instanceof Blob) {
        const text = await err.response.data.text();
        try {
          const jsonErr = JSON.parse(text);
          setDownloadError(jsonErr.message || 'Failed to download file');
          if (jsonErr.message === 'Link expired or destroyed') {
            setIsExpired(true);
          }
        } catch {
          setDownloadError('Download failed or link self-destructed.');
        }
      } else {
        setDownloadError(err.response?.data?.message || 'Download failed');
      }
    } finally {
      setDownloading(false);
    }
  };

  // Utility to initiate browser download for blob
  const triggerBlobDownload = (blobData, filename) => {
    const url = window.URL.createObjectURL(new Blob([blobData]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
        <div className="w-10 h-10 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
        <p className="text-xs font-mono text-slate-400">Verifying Vault Link Security...</p>
      </div>
    );
  }

  if (isExpired || !fileInfo) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <ExpiredNotice />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {!passcodeVerified ? (
        <PasscodeModal
          onSubmit={handlePasscodeSubmit}
          error={passcodeError}
          loading={passcodeLoading}
        />
      ) : (
        <DownloadCard
          file={fileInfo}
          onDownload={handleDownloadFile}
          downloading={downloading}
          downloadError={downloadError}
        />
      )}
    </div>
  );
};

export default DownloadPage;
