import React, { useState } from 'react';
import { Download, Trash2, ShieldCheck, AlertTriangle, ChevronLeft, Loader2, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const DataManagement = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [exporting, setExporting] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const handleExport = async () => {
        setExporting(true);
        try {
            const token = await user.getIdToken();
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/compliance/data/export`, {
                headers: { Authorization: `Bearer ${token}` },
                responseType: 'blob'
            });
            
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `offlinepay_data_${user.uid}.json`);
            document.body.appendChild(link);
            link.click();
            toast.success('Data exported successfully');
        } catch (error) {
            toast.error('Failed to export data');
        } finally {
            setExporting(false);
        }
    };

    const handleDeleteRequest = async () => {
        const confirm = window.confirm('Are you sure you want to request data deletion? This action cannot be undone, though some logs will be retained for 5 years as per RBI mandate.');
        if (!confirm) return;

        setDeleting(true);
        try {
            const token = await user.getIdToken();
            await axios.post(`${import.meta.env.VITE_API_URL}/api/compliance/data/delete`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success('Deletion request submitted. Your account will be processed in 48 hours.');
        } catch (error) {
            toast.error('Failed to submit deletion request');
        } finally {
            setDeleting(false);
        }
    };

    return (
        <div className="p-6">
            <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-white/5 mb-6">
                <ChevronLeft />
            </button>

            <div className="mb-8">
                <h2 className="text-3xl font-black uppercase tracking-tighter mb-2">Data Rights</h2>
                <p className="text-text-secondary">Manage your personal information</p>
            </div>

            <div className="space-y-4">
                <div className="glass-card p-6 border-l-4 border-l-accent-cyan">
                    <div className="flex items-start gap-4">
                        <div className="p-3 rounded-xl bg-accent-cyan/10 border border-accent-cyan/20">
                            <Download className="text-accent-cyan" />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-lg font-bold">Export Data</h3>
                            <p className="text-xs text-text-secondary mb-4">Download a copy of all your data including KYC info and transaction history in JSON format.</p>
                            <div className="flex gap-2">
                                <button 
                                    onClick={handleExport}
                                    disabled={exporting}
                                    className="px-4 py-2 bg-accent-cyan text-bg-primary rounded-lg text-[10px] font-black uppercase flex items-center gap-2"
                                >
                                    {exporting ? <Loader2 className="w-3 h-3 animate-spin" /> : <Download className="w-3 h-3" />}
                                    JSON Data
                                </button>
                                <button 
                                    onClick={async () => {
                                        try {
                                            const token = await user.getIdToken();
                                            window.open(`${import.meta.env.VITE_API_URL}/api/compliance/audit/export?token=${token}`, '_blank');
                                        } catch (e) {
                                            toast.error('Failed to generate PDF');
                                        }
                                    }}
                                    className="px-4 py-2 border border-accent-cyan/30 text-accent-cyan hover:bg-accent-cyan/10 rounded-lg text-[10px] font-black uppercase flex items-center gap-2 transition-colors"
                                >
                                    <FileText className="w-3 h-3" />
                                    Audit PDF
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="glass-card p-6 border-l-4 border-l-red-500">
                    <div className="flex items-start gap-4">
                        <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20">
                            <Trash2 className="text-red-500" />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-lg font-bold">Request Deletion</h3>
                            <p className="text-xs text-text-secondary mb-4">Exercise your "Right to be Forgotten". We will remove your personal data within 48 hours.</p>
                            <button 
                                onClick={handleDeleteRequest}
                                disabled={deleting}
                                className="px-4 py-2 border border-red-500/30 text-red-500 hover:bg-red-500/10 rounded-lg text-xs font-black uppercase flex items-center gap-2 transition-colors"
                            >
                                {deleting ? <Loader2 className="w-3 h-3 animate-spin" /> : <Trash2 className="w-3 h-3" />}
                                Request Deletion
                            </button>
                        </div>
                    </div>
                </div>

                <div className="mt-8 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-2xl flex gap-3">
                    <AlertTriangle className="w-5 h-5 text-yellow-500 shrink-0" />
                    <div>
                        <h4 className="text-xs font-bold text-yellow-500 uppercase mb-1">RBI Retention Notice</h4>
                        <p className="text-[10px] text-yellow-100/70 leading-relaxed">
                            Under the RBI Master Direction on PPI, we are legally required to maintain transaction logs and KYC metadata for a period of <span className="text-yellow-500 font-bold">5 years</span> from the date of transaction/account closure.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DataManagement;
