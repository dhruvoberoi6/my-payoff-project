import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, Eye, Trash2, Download, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PrivacyPolicy = () => {
    const navigate = useNavigate();

    return (
        <div className="p-6 pb-24 max-w-2xl mx-auto">
            <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-white/5 mb-6">
                <ChevronLeft />
            </button>

            <div className="mb-10">
                <h1 className="text-4xl font-black uppercase tracking-tighter mb-2">Privacy & Compliance</h1>
                <p className="text-text-secondary">How we protect your data as per RBI & GDPR guidelines</p>
            </div>

            <div className="space-y-8">
                <section>
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-accent-cyan/10 flex items-center justify-center border border-accent-cyan/20">
                            <Shield className="w-5 h-5 text-accent-cyan" />
                        </div>
                        <h2 className="text-xl font-bold">Data Collection</h2>
                    </div>
                    <p className="text-sm text-text-secondary leading-relaxed">
                        To provide offline payment services and comply with RBI (Reserve Bank of India) regulations, we collect:
                    </p>
                    <ul className="mt-3 space-y-2 list-disc list-inside text-sm text-text-secondary">
                        <li>Identity data (Aadhaar, PAN) via our KYC process.</li>
                        <li>Transaction metadata (amount, timestamp, receiver).</li>
                        <li>Device information (IP address, device ID) for fraud prevention.</li>
                        <li>Contact information (Phone number) for verification.</li>
                    </ul>
                </section>

                <section>
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20">
                            <Lock className="w-5 h-5 text-purple-400" />
                        </div>
                        <h2 className="text-xl font-bold">Data Usage & Retention</h2>
                    </div>
                    <p className="text-sm text-text-secondary leading-relaxed">
                        Your KYC data is encrypted at rest and used only for identity verification. Audit logs are maintained for 5 years as per RBI mandate for PPI issuers. We do not sell your personal data to third parties.
                    </p>
                </section>

                <section>
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                            <Eye className="w-5 h-5 text-blue-400" />
                        </div>
                        <h2 className="text-xl font-bold">Your Rights</h2>
                    </div>
                    <div className="grid grid-cols-1 gap-4">
                        <div className="glass-card p-4">
                            <h3 className="text-sm font-bold mb-1">Right to Portability</h3>
                            <p className="text-xs text-text-secondary">You can download all your data in JSON format at any time.</p>
                        </div>
                        <div className="glass-card p-4">
                            <h3 className="text-sm font-bold mb-1">Right to Erasure</h3>
                            <p className="text-xs text-text-secondary">You can request account deletion. Note that transaction logs will be retained for 5 years as per law.</p>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
