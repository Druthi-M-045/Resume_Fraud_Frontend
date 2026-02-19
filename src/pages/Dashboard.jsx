import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const Dashboard = () => {
    const navigate = useNavigate();
    const fileInputRef = useRef(null);
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');
    const [dragActive, setDragActive] = useState(false);

    const username = localStorage.getItem('user') || 'User';

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const droppedFile = e.dataTransfer.files[0];
            const validTypes = ['.pdf', '.docx'];
            const extension = droppedFile.name.substring(droppedFile.name.lastIndexOf('.')).toLowerCase();
            if (validTypes.includes(extension)) {
                setFile(droppedFile);
                setError('');
                setResult(null);
            } else {
                setError('Please upload a PDF or DOCX file.');
            }
        }
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            setError('');
            setResult(null);
        }
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file) return;

        setUploading(true);
        setError('');
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await api.post('/upload-resume', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setResult(response.data);
        } catch (err) {
            setError(err.response?.data?.detail || 'Failed to upload and analyze resume.');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="min-h-screen">
            <div className="bg-mesh" />

            {/* Navigation */}
            <nav className="glass sticky top-0 z-50 px-6 py-4">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary-600/20 border border-primary-500/30 flex items-center justify-center">
                            <svg className="w-6 h-6 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                        </div>
                        <span className="text-xl font-bold gradient-text">FraudDetect</span>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="hidden sm:flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-surface-300 text-sm font-medium">Hi, {username}</span>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="px-4 py-2 rounded-lg bg-surface-800 border border-surface-700 text-surface-200 text-sm font-medium hover:bg-surface-700 transition-all flex items-center gap-2"
                        >
                            Sign Out
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                        </button>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-6 py-12">
                <div className="grid lg:grid-cols-2 gap-12">

                    {/* Left Column: Upload */}
                    <div className="space-y-8 animate-slide-up">
                        <div>
                            <h2 className="text-4xl font-extrabold text-white mb-4">Resume Analyzer</h2>
                            <p className="text-surface-400 text-lg">
                                Upload a resume to scan for fraud indicators, verify credentials, and check consistency across profiles.
                            </p>
                        </div>

                        <form onSubmit={handleUpload} className="space-y-6">
                            <div
                                className={`drop-zone relative h-64 border-2 border-dashed rounded-3xl flex flex-col items-center justify-center p-8 text-center cursor-pointer overflow-hidden ${dragActive ? 'dragover' : 'border-surface-700 hover:border-primary-500/50 hover:bg-primary-500/5'
                                    }`}
                                onDragEnter={handleDrag}
                                onDragOver={handleDrag}
                                onDragLeave={handleDrag}
                                onDrop={handleDrop}
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept=".pdf,.docx"
                                    onChange={handleFileChange}
                                    className="hidden"
                                />

                                <div className="relative z-10">
                                    <div className="w-20 h-20 bg-primary-600/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-primary-500/20 group-hover:scale-110 transition-transform">
                                        <svg className="w-10 h-10 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                        </svg>
                                    </div>
                                    <h3 className="text-lg font-semibold text-surface-100">
                                        {file ? file.name : "Choose a file or drag it here"}
                                    </h3>
                                    <p className="text-surface-500 text-sm mt-2">
                                        Supported formats: PDF, DOCX (Max 10MB)
                                    </p>
                                </div>

                                {/* Background decorative blob */}
                                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-primary-600/5 blur-3xl rounded-full" />
                            </div>

                            {error && (
                                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm flex items-center gap-3 animate-slide-up">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    {error}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={!file || uploading}
                                className="w-full py-4 rounded-2xl bg-gradient-to-r from-primary-600 to-primary-500 text-white font-bold text-lg
                  shadow-lg shadow-primary-500/25 hover:from-primary-500 hover:to-primary-400 disabled:opacity-50 disabled:cursor-not-allowed
                  transition-all duration-300 transform active:scale-95 flex items-center justify-center gap-3"
                            >
                                {uploading ? (
                                    <>
                                        <svg className="animate-spin h-6 w-6" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                        </svg>
                                        Analyzing Resume...
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                                        </svg>
                                        Start Analysis
                                    </>
                                )}
                            </button>
                        </form>
                    </div>

                    {/* Right Column: Results */}
                    <div className="space-y-6">
                        {!result && !uploading && (
                            <div className="h-full min-h-[400px] glass rounded-3xl border-dashed flex flex-col items-center justify-center p-12 text-center opacity-60">
                                <div className="w-24 h-24 bg-surface-800/50 rounded-full flex items-center justify-center mb-6 border border-surface-700/50">
                                    <svg className="w-12 h-12 text-surface-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-medium text-surface-400 mb-2">Analysis Results</h3>
                                <p className="text-surface-500 max-w-xs">
                                    Your analysis results will appear here after you upload and process a resume.
                                </p>
                            </div>
                        )}

                        {uploading && (
                            <div className="h-full min-h-[400px] glass rounded-3xl flex flex-col items-center justify-center p-12 text-center">
                                <div className="relative w-32 h-32 mb-8">
                                    <div className="absolute inset-0 rounded-full border-4 border-primary-500/20" />
                                    <div className="absolute inset-0 rounded-full border-4 border-primary-500 border-t-transparent animate-spin" />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <svg className="w-12 h-12 text-primary-400 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                    </div>
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-2">Analyzing...</h3>
                                <p className="text-surface-400 animate-pulse">Running fraud detection algorithms</p>
                            </div>
                        )}

                        {result && (
                            <div className="animate-slide-in-right space-y-6">
                                {/* Score Card */}
                                <div className="glass rounded-3xl p-8 border-l-4 border-l-primary-500 overflow-hidden relative">
                                    <div className="flex justify-between items-start mb-6">
                                        <div>
                                            <h4 className="text-surface-400 font-medium text-sm uppercase tracking-wider mb-1">Fraud Score</h4>
                                            <div className="text-5xl font-black text-white">{result.fraud_score}%</div>
                                        </div>
                                        <div className={`px-4 py-2 rounded-full font-bold text-sm flex items-center gap-2 ${result.fraud_status === 'Flagged'
                                            ? 'bg-red-500/10 text-red-500 border border-red-500/20'
                                            : 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                                            }`}>
                                            <span className={`w-2 h-2 rounded-full ${result.fraud_status === 'Flagged' ? 'bg-red-500' : 'bg-emerald-500'}`} />
                                            {result.fraud_status.toUpperCase()}
                                        </div>
                                    </div>

                                    <div className="relative h-3 w-full bg-surface-800 rounded-full overflow-hidden mb-2">
                                        <div
                                            className={`absolute inset-0 rounded-full progress-bar-fill ${result.fraud_score > 50 ? 'bg-gradient-to-r from-red-600 to-red-400' : 'bg-gradient-to-r from-emerald-600 to-emerald-400'
                                                }`}
                                            style={{ '--progress-width': `${result.fraud_score}%` }}
                                        />
                                    </div>
                                    <div className="flex justify-between text-xs font-medium text-surface-500">
                                        <span>Low Risk</span>
                                        <span>High Risk</span>
                                    </div>

                                    <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary-600/5 blur-3xl rounded-full" />
                                </div>

                                {/* Reasons List */}
                                <div className="glass rounded-3xl p-8">
                                    <h4 className="text-lg font-bold text-white mb-6 flex items-center gap-3">
                                        <svg className="w-5 h-5 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        Detected Findings
                                    </h4>
                                    <ul className="space-y-4">
                                        {result.reasons.length > 0 ? (
                                            result.reasons.map((reason, idx) => (
                                                <li key={idx} className="flex gap-4 p-4 rounded-2xl bg-surface-800/40 border border-surface-700/50 hover:bg-surface-800/60 transition-colors group">
                                                    <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 font-bold group-hover:scale-110 transition-transform">
                                                        {idx + 1}
                                                    </div>
                                                    <p className="text-surface-300 leading-relaxed pt-1">{reason}</p>
                                                </li>
                                            ))
                                        ) : (
                                            <div className="text-center py-6">
                                                <svg className="w-12 h-12 text-emerald-500/40 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                <p className="text-surface-400">No major fraud indicators detected.</p>
                                            </div>
                                        )}
                                    </ul>
                                </div>

                                {/* Preview Card */}
                                <div className="glass rounded-3xl p-8 max-h-[400px] flex flex-col">
                                    <h4 className="text-lg font-bold text-white mb-6 flex items-center gap-3">
                                        <svg className="w-5 h-5 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                        </svg>
                                        Extracted Content Preview
                                    </h4>
                                    <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                                        <pre className="text-sm text-surface-400 whitespace-pre-wrap leading-relaxed font-mono p-6 rounded-2xl bg-surface-950/50 border border-surface-800 selection:bg-primary-500/30">
                                            {result.extracted_text || 'No text extracted.'}
                                        </pre>
                                    </div>
                                </div>

                            </div>
                        )}
                    </div>

                </div>
            </main>
        </div>
    );
};

export default Dashboard;
