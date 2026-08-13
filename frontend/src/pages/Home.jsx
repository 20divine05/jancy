import React, { useState } from 'react';
import axios from 'axios';
import confetti from 'canvas-confetti';
import { Shield, Lock, Flame, Zap, ArrowRight, CheckCircle2 } from 'lucide-react';
import UploadBox from '../components/UploadBox';
import ConfigPanel from '../components/ConfigPanel';
import SuccessCard from '../components/SuccessCard';
import Stats from '../components/Stats';

const Home = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [expirationHours, setExpirationHours] = useState(24);
  const [maxDownloads, setMaxDownloads] = useState(1);
  const [passcode, setPasscode] = useState('');
  
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Please select or drop a file to upload');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    setError(null);

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('expirationHours', expirationHours);
    formData.append('maxDownloads', maxDownloads);
    if (passcode.trim()) {
      formData.append('passcode', passcode.trim());
    }

    try {
      const response = await axios.post('/api/files/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percent);
        },
      });

      if (response.data.success) {
        setUploadedFile(response.data.file);
        
        // Trigger celebratory confetti effect
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#6366f1', '#00f2fe', '#10b981'],
        });
      } else {
        setError(response.data.message || 'Failed to upload file');
      }
    } catch (err) {
      console.error('Upload Error:', err);
      setError(err.response?.data?.message || 'Server error uploading file');
    } finally {
      setIsUploading(false);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setUploadedFile(null);
    setPasscode('');
    setError(null);
    setUploadProgress(0);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold">
          <Zap className="w-3.5 h-3.5 text-cyan-400" />
          <span>Next-Gen Ephemeral Vault</span>
        </div>
        
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
          Disposable, Encrypted <br />
          <span className="text-gradient">Self-Destructing File Vault</span>
        </h1>

        <p className="text-sm sm:text-base text-slate-400 max-w-xl mx-auto leading-relaxed">
          Send files securely. Links automatically destroy themselves after reaching max download limit or when the expiration timer elapses.
        </p>
      </div>

      {/* Platform Activity Stats */}
      <Stats />

      {/* Upload Main Vault Container */}
      <div className="space-y-6">
        {!uploadedFile ? (
          <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl space-y-6">
            
            {/* File Dropzone */}
            <UploadBox
              selectedFile={selectedFile}
              setSelectedFile={setSelectedFile}
              isUploading={isUploading}
              uploadProgress={uploadProgress}
              error={error}
            />

            {/* Custom Rules & Config Panel */}
            <ConfigPanel
              expirationHours={expirationHours}
              setExpirationHours={setExpirationHours}
              maxDownloads={maxDownloads}
              setMaxDownloads={setMaxDownloads}
              passcode={passcode}
              setPasscode={setPasscode}
            />

            {/* Submit CTA */}
            <button
              onClick={handleUpload}
              disabled={!selectedFile || isUploading}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-bold text-sm flex items-center justify-center gap-2.5 shadow-xl shadow-indigo-500/20 hover:shadow-indigo-500/35 hover:scale-[1.005] active:scale-[0.995] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {isUploading ? (
                <span>Securing & Vaulting File... ({uploadProgress}%)</span>
              ) : (
                <>
                  <Lock className="w-4 h-4" /> Upload & Generate Destructible Link
                </>
              )}
            </button>

          </div>
        ) : (
          <SuccessCard uploadedFile={uploadedFile} onReset={handleReset} />
        )}
      </div>

      {/* Features Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
        <div className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800/80 space-y-2">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
            <Flame className="w-5 h-5" />
          </div>
          <h4 className="text-sm font-bold text-white">Physical Disk Unlink</h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            Upon download limit exhaustion, physical files are instantly unlinked from Node disk storage.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800/80 space-y-2">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
            <Lock className="w-5 h-5" />
          </div>
          <h4 className="text-sm font-bold text-white">Bcrypt Passcode PIN</h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            Optional passcodes are hashed with salted bcrypt hashes before database persistence.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800/80 space-y-2">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
            <Shield className="w-5 h-5" />
          </div>
          <h4 className="text-sm font-bold text-white">MongoDB TTL Indexes</h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            Database records use native TTL indexes (`expiresAt`) for guaranteed background document cleanup.
          </p>
        </div>
      </div>

    </div>
  );
};

export default Home;
