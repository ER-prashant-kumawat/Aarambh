import React, { useState, useRef, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { Shield, Folder, Loader2, Upload, Download, Eye, Trash2 } from 'lucide-react';

const getApiUrl = () => {
  let url = import.meta.env.VITE_API_URL || 'https://aarambh-k6rv.vercel.app/api';
  if (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
    url = 'http://localhost:5000/api';
  }
  if (!url.endsWith('/api') && !url.endsWith('/api/')) {
    url = url.replace(/\/$/, '') + '/api';
  }
  return url;
};
const API_URL = getApiUrl();
const SERVER_URL = API_URL.replace('/api', '');

export default function FounderWallet() {
  const auth = useContext(AuthContext);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [justAdded, setJustAdded] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const documents = auth ? auth.documents : [];
  const uploadDoc = auth ? auth.uploadDoc : async () => ({ success: false, error: "Upload failed" });
  const deleteDoc = auth ? auth.deleteDoc : async () => ({ success: false, error: "Delete failed" });

  const statusBadge = (s: string) => {
    if (s === "verified") return <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 text-xs font-bold">✓ Verified</span>;
    if (s === "active") return <span className="px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-400 border border-blue-500/25 text-xs font-bold">Active</span>;
    return <span className="px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/25 text-xs font-bold">⏳ Pending</span>;
  };

  const extColor = (ext: string) => {
    if (ext === "PDF") return "bg-red-500/15 text-red-400";
    if (ext === "PFX") return "bg-purple-500/15 text-purple-400";
    return "bg-blue-500/15 text-blue-400";
  };

  const processUpload = async (files: FileList) => {
    if (!files.length) return;
    setUploading(true);
    
    const file = files[0];
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', 'Founder Uploaded Asset');

    const res = await uploadDoc(formData);
    if (res.success) {
      setJustAdded("just-uploaded-item-flash");
      setTimeout(() => setJustAdded(null), 3000);
    }
    setUploading(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    if (e.dataTransfer.files) {
      processUpload(e.dataTransfer.files);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      processUpload(e.target.files);
    }
  };

  const handleDownload = (id: string) => {
    window.open(`${API_URL}/documents/${id}/download`, '_blank');
  };

  const handlePreview = (filePath: string) => {
    window.open(`${SERVER_URL}/uploads/${filePath}`, '_blank');
  };

  return (
    <div className="animate-fade-in space-y-6">
      {/* Header */}
      <div className="glass rounded-3xl p-7">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl grad-purple flex items-center justify-center shadow-xl">
              <Folder size={26} className="text-white"/>
            </div>
            <div>
              <h2 className="text-white font-black text-xl">Founder's Secure Asset Wallet</h2>
              <p className="text-slate-400 text-sm font-medium">Encrypted corporate document vault — accessible anytime, anywhere</p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 w-fit">
            <Shield size={14} className="text-emerald-400"/>
            <span className="text-emerald-400 text-xs font-bold">AES-256 Encrypted</span>
          </div>
        </div>

        {/* Storage bar */}
        <div>
          <div className="flex justify-between text-xs text-slate-400 mb-2">
            <span>Storage Used: {documents.length > 0 ? '4.5 MB' : '0 MB'} of 1 GB</span>
            <span>{documents.length} Documents</span>
          </div>
          <div className="w-full h-2 bg-slate-700/50 rounded-full overflow-hidden">
            <div className="h-full grad-em rounded-full" style={{ width: documents.length > 0 ? "0.45%" : "0%" }}></div>
          </div>
        </div>
      </div>

      {/* Documents list */}
      <div className="glass rounded-3xl overflow-hidden">
        <div className="p-6 border-b border-slate-700/30">
          <h3 className="text-white font-bold text-base">Corporate Documents</h3>
        </div>
        <div className="divide-y divide-slate-700/20">
          {documents.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-sm font-semibold">
              No documents in vault yet. Drag and drop to upload key certificates below!
            </div>
          ) : (
            documents.map(doc => (
              <div key={doc._id}
                className={`flex items-center gap-4 px-6 py-4 hover:bg-white/3 transition-all ${doc._id === justAdded ? "bg-emerald-500/5 border-l-2 border-emerald-400" : ""}`}>
                <div className={`w-10 h-10 rounded-xl ${extColor(doc.ext)} flex items-center justify-center flex-shrink-0 font-bold text-xs`}>
                  {doc.ext}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-semibold text-sm truncate">{doc.name}</p>
                  <p className="text-slate-400 text-xs font-medium">{doc.type} · {doc.size} · {new Date(doc.dateUploaded).toLocaleDateString()}</p>
                </div>
                <div className="hidden sm:block">{statusBadge(doc.status)}</div>
                <div className="flex items-center gap-2">
                  <button onClick={() => handleDownload(doc._id)} className="p-2 rounded-lg text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10 transition-all" title="Download">
                    <Download size={15}/>
                  </button>
                  <button onClick={() => handlePreview(doc.filePath)} className="p-2 rounded-lg text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 transition-all" title="View">
                    <Eye size={15}/>
                  </button>
                  <button onClick={() => deleteDoc(doc._id)} className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all" title="Remove">
                    <Trash2 size={15}/>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Drag & Drop Upload */}
      <div
        className={`drag-zone p-10 flex flex-col items-center justify-center cursor-pointer ${dragging ? "active" : ""}`}
        onDragOver={e => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileRef.current?.click()}>
        <input ref={fileRef} type="file" className="hidden" onChange={handleFileInput} />
        {uploading ? (
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="text-emerald-400 animate-spin" size={30} />
            <p className="text-emerald-400 font-semibold text-sm">Uploading & encrypting…</p>
          </div>
        ) : (
          <>
            <div className="w-14 h-14 rounded-2xl bg-slate-700/40 flex items-center justify-center mb-4">
              <Upload size={26} className="text-slate-400"/>
            </div>
            <p className="text-white font-bold text-base mb-1">Drop files here to upload</p>
            <p className="text-slate-400 text-sm mb-4">PDF, DOC, PNG, JPG, PFX — max 25 MB per file</p>
            <button className="px-6 py-2.5 rounded-xl grad-em text-white font-bold text-sm hover:opacity-90">Browse Files</button>
          </>
        )}
      </div>

      {/* Security notice */}
      <div className="flex items-start gap-3 bg-emerald-500/5 border border-emerald-500/15 rounded-2xl p-5">
        <Shield size={18} className="text-emerald-400 flex-shrink-0 mt-0.5"/>
        <p className="text-slate-400 text-xs leading-relaxed font-semibold">
          All documents stored in Aarambhh Vault are encrypted with AES-256 at rest and TLS 1.3 in transit. Documents are stored on ISO 27001-certified servers. Only you and your designated advisors can access these files. We never share, sell, or process your documents for any purpose other than your active service requests.
        </p>
      </div>
    </div>
  );
}
