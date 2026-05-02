import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Shield, 
    Smartphone, 
    User, 
    FileText, 
    Camera, 
    CheckCircle, 
    ChevronRight, 
    ChevronLeft,
    AlertCircle,
    Info,
    Lock
} from 'lucide-react';
import { useKYC } from '../context/KYCContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const STEPS = [
    { id: 'mobile', title: 'Mobile', icon: Smartphone },
    { id: 'details', title: 'Details', icon: User },
    { id: 'docs', title: 'Documents', icon: FileText },
    { id: 'review', title: 'Review', icon: Shield }
];

const KYCScreen = () => {
    const { submitKYC, kycStatus, kycLevel } = useKYC();
    const { user } = useAuth();
    const [currentStep, setCurrentStep] = useState(0);
    const [kycType, setKycType] = useState(null); // 'MIN' or 'FULL'
    
    const [formData, setFormData] = useState({
        phone: user?.phoneNumber || '',
        otp: '',
        fullName: '',
        dob: '',
        address: '',
        pincode: '',
        city: '',
        state: '',
        aadhaarLast4: '',
        panNumber: '',
        docs: {
            aadhaarFront: null,
            aadhaarBack: null,
            pan: null,
            selfie: null
        }
    });

    const [isVerifyingOTP, setIsVerifyingOTP] = useState(false);
    const [otpSent, setOtpSent] = useState(false);

    const handleNext = () => {
        if (currentStep < STEPS.length - 1) {
            setCurrentStep(currentStep + 1);
        }
    };

    const handleBack = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        } else {
            setKycType(null);
        }
    };

    const handleSubmit = async () => {
        const success = await submitKYC(kycType, formData);
        if (success) {
            // Handled in context (toast + status update)
        }
    };

    if (kycStatus === 'PENDING') {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6">
                <div className="w-20 h-20 rounded-full bg-blue-500/20 flex items-center justify-center mb-6 animate-pulse">
                    <Shield className="w-10 h-10 text-blue-400" />
                </div>
                <h2 className="text-2xl font-bold mb-2">KYC Under Review</h2>
                <p className="text-text-secondary max-w-xs">
                    Our compliance team is verifying your documents. This usually takes 24-48 hours.
                </p>
                <div className="mt-8 p-4 glass-card border-blue-500/30 flex items-start gap-3 text-left">
                    <Info className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                    <p className="text-xs text-blue-100/70">
                        You can still use basic features, but your limits will be restricted until full verification is complete.
                    </p>
                </div>
            </div>
        );
    }

    if (!kycType) {
        return (
            <div className="p-6">
                <div className="mb-8">
                    <h2 className="text-3xl font-black mb-2 uppercase tracking-tighter">Choose KYC Tier</h2>
                    <p className="text-text-secondary">RBI compliant wallet upgrades</p>
                </div>

                <div className="space-y-4">
                    {/* MIN KYC CARD */}
                    <motion.div 
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setKycType('MIN')}
                        className={`glass-card p-6 border-l-4 cursor-pointer transition-all ${kycLevel === 'MIN_KYC' || kycLevel === 'FULL_KYC' ? 'border-l-green-500 opacity-60 pointer-events-none' : 'border-l-accent-cyan'}`}
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <span className="text-[10px] font-black bg-accent-cyan/20 text-accent-cyan px-2 py-0.5 rounded-full uppercase mb-2 inline-block">
                                    Tier 1
                                </span>
                                <h3 className="text-xl font-bold">Minimum KYC</h3>
                            </div>
                            {kycLevel !== 'NONE' && <CheckCircle className="text-green-500" />}
                        </div>
                        <div className="space-y-2 mb-6">
                            <div className="flex items-center gap-2 text-sm text-text-secondary">
                                <CheckCircle className="w-4 h-4 text-accent-cyan" />
                                <span>₹10,000 Wallet Limit</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-text-secondary">
                                <CheckCircle className="w-4 h-4 text-accent-cyan" />
                                <span>Basic Send/Receive</span>
                            </div>
                        </div>
                        <p className="text-xs text-text-secondary italic">Requires mobile OTP only</p>
                    </motion.div>

                    {/* FULL KYC CARD */}
                    <motion.div 
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setKycType('FULL')}
                        className={`glass-card p-6 border-l-4 cursor-pointer transition-all ${kycLevel === 'FULL_KYC' ? 'border-l-green-500 opacity-60 pointer-events-none' : 'border-l-purple-500'}`}
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <span className="text-[10px] font-black bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded-full uppercase mb-2 inline-block">
                                    Tier 2
                                </span>
                                <h3 className="text-xl font-bold">Full KYC</h3>
                            </div>
                            {kycLevel === 'FULL_KYC' && <CheckCircle className="text-green-500" />}
                        </div>
                        <div className="space-y-2 mb-6">
                            <div className="flex items-center gap-2 text-sm text-text-secondary">
                                <CheckCircle className="w-4 h-4 text-purple-400" />
                                <span>₹1,00,000 Wallet Limit</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-text-secondary">
                                <CheckCircle className="w-4 h-4 text-purple-400" />
                                <span>RBI Compliant PPI</span>
                            </div>
                        </div>
                        <p className="text-xs text-text-secondary italic">Requires Aadhaar, PAN & Video KYC</p>
                    </motion.div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 pb-24">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <button onClick={handleBack} className="p-2 rounded-full hover:bg-white/5 transition-colors">
                    <ChevronLeft />
                </button>
                <div>
                    <h2 className="text-xl font-black uppercase tracking-tight">
                        {kycType === 'MIN' ? 'Minimum KYC' : 'Full KYC Setup'}
                    </h2>
                    <p className="text-xs text-text-secondary">Step {currentStep + 1} of {STEPS.length}</p>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="flex gap-2 mb-10">
                {STEPS.map((step, idx) => (
                    <div 
                        key={step.id}
                        className={`h-1 flex-1 rounded-full transition-all duration-500 ${idx <= currentStep ? (kycType === 'MIN' ? 'bg-accent-cyan' : 'bg-purple-500') : 'bg-white/10'}`}
                    />
                ))}
            </div>

            {/* Step Content */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={STEPS[currentStep].id}
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -20, opacity: 0 }}
                    className="space-y-6"
                >
                    {currentStep === 0 && (
                        <div className="space-y-6">
                            <div className="text-center mb-8">
                                <div className="w-16 h-16 rounded-2xl bg-accent-cyan/10 flex items-center justify-center mx-auto mb-4 border border-accent-cyan/20">
                                    <Smartphone className="text-accent-cyan" />
                                </div>
                                <h3 className="text-lg font-bold">Verify Mobile Number</h3>
                                <p className="text-sm text-text-secondary">We'll send an OTP to your registered number</p>
                            </div>

                            <div className="space-y-4">
                                <div className="glass-card p-4 flex items-center gap-4">
                                    <div className="text-text-secondary font-bold border-r border-white/10 pr-4">+91</div>
                                    <input 
                                        type="tel"
                                        placeholder="Phone Number"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                        className="bg-transparent border-none outline-none flex-1 font-bold tracking-widest"
                                    />
                                </div>

                                {otpSent && (
                                    <motion.div 
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        className="space-y-2"
                                    >
                                        <label className="text-[10px] font-bold text-text-secondary uppercase px-1">Enter 6-Digit OTP</label>
                                        <div className="flex justify-between gap-2">
                                            {[1,2,3,4,5,6].map((_, i) => (
                                                <input 
                                                    key={i}
                                                    type="text"
                                                    maxLength="1"
                                                    className="w-full aspect-square text-center font-black text-xl glass-card border-accent-cyan/30 rounded-xl outline-none focus:border-accent-cyan transition-all"
                                                />
                                            ))}
                                        </div>
                                    </motion.div>
                                )}

                                <button 
                                    onClick={() => setOtpSent(true)}
                                    className={`w-full p-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all ${otpSent ? 'bg-accent-cyan text-bg-primary' : 'bg-white/5 border border-white/10 hover:bg-white/10'}`}
                                >
                                    {otpSent ? 'Verify OTP' : 'Send Verification Code'}
                                </button>
                            </div>
                        </div>
                    )}

                    {currentStep === 1 && (
                        <div className="space-y-4">
                             <div className="text-center mb-8">
                                <div className="w-16 h-16 rounded-2xl bg-blue-500/10 flex items-center justify-center mx-auto mb-4 border border-blue-500/20">
                                    <User className="text-blue-400" />
                                </div>
                                <h3 className="text-lg font-bold">Personal Details</h3>
                                <p className="text-sm text-text-secondary">Must match your official documents</p>
                            </div>

                            <div className="space-y-3">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-text-secondary uppercase px-1">Full Name</label>
                                    <input 
                                        type="text"
                                        placeholder="Enter your full name"
                                        className="w-full p-4 glass-card outline-none border-white/5 focus:border-accent-cyan"
                                        value={formData.fullName}
                                        onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-text-secondary uppercase px-1">Date of Birth</label>
                                    <input 
                                        type="date"
                                        className="w-full p-4 glass-card outline-none border-white/5 focus:border-accent-cyan text-white"
                                        value={formData.dob}
                                        onChange={(e) => setFormData({...formData, dob: e.target.value})}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-text-secondary uppercase px-1">Pincode</label>
                                        <input 
                                            type="text"
                                            placeholder="400001"
                                            className="w-full p-4 glass-card outline-none border-white/5 focus:border-accent-cyan"
                                            value={formData.pincode}
                                            onChange={(e) => setFormData({...formData, pincode: e.target.value})}
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-text-secondary uppercase px-1">PAN Card</label>
                                        <input 
                                            type="text"
                                            placeholder="ABCDE1234F"
                                            className="w-full p-4 glass-card outline-none border-white/5 focus:border-accent-cyan uppercase"
                                            value={formData.panNumber}
                                            onChange={(e) => setFormData({...formData, panNumber: e.target.value})}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {currentStep === 2 && (
                        <div className="space-y-6">
                            <div className="text-center mb-8">
                                <div className="w-16 h-16 rounded-2xl bg-purple-500/10 flex items-center justify-center mx-auto mb-4 border border-purple-500/20">
                                    <Camera className="text-purple-400" />
                                </div>
                                <h3 className="text-lg font-bold">Document Capture</h3>
                                <p className="text-sm text-text-secondary">Clear photos for faster verification</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="glass-card p-4 aspect-square flex flex-col items-center justify-center text-center gap-2 border-dashed border-white/20">
                                    <Camera className="w-6 h-6 text-text-secondary" />
                                    <span className="text-[10px] font-bold uppercase text-text-secondary">Aadhaar Front</span>
                                </div>
                                <div className="glass-card p-4 aspect-square flex flex-col items-center justify-center text-center gap-2 border-dashed border-white/20">
                                    <Camera className="w-6 h-6 text-text-secondary" />
                                    <span className="text-[10px] font-bold uppercase text-text-secondary">Aadhaar Back</span>
                                </div>
                                <div className="glass-card p-4 aspect-square flex flex-col items-center justify-center text-center gap-2 border-dashed border-white/20">
                                    <Camera className="w-6 h-6 text-text-secondary" />
                                    <span className="text-[10px] font-bold uppercase text-text-secondary">PAN Card</span>
                                </div>
                                <div className="glass-card p-4 aspect-square flex flex-col items-center justify-center text-center gap-2 border-dashed border-white/20 relative overflow-hidden group">
                                    <Camera className="w-6 h-6 text-purple-400" />
                                    <span className="text-[10px] font-bold uppercase text-purple-400">Live Selfie</span>
                                    <div className="absolute inset-0 bg-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <span className="text-[8px] font-black uppercase text-purple-400">Open Camera</span>
                                    </div>
                                </div>
                            </div>

                            <div className="p-4 rounded-2xl bg-yellow-500/10 border border-yellow-500/20 flex gap-3">
                                <AlertCircle className="w-5 h-5 text-yellow-500 shrink-0" />
                                <p className="text-[10px] text-yellow-200/80 leading-relaxed">
                                    <span className="font-bold">Guidelines:</span> Ensure documents are well-lit, not blurry, and text is readable. Selfies must show full face without masks or sunglasses.
                                </p>
                            </div>
                        </div>
                    )}

                    {currentStep === 3 && (
                        <div className="space-y-6">
                            <div className="glass-card p-6 border-l-4 border-l-accent-cyan">
                                <h3 className="text-sm font-black uppercase mb-4 tracking-wider">Confirm Details</h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between border-b border-white/5 pb-2">
                                        <span className="text-xs text-text-secondary">Name</span>
                                        <span className="text-xs font-bold">{formData.fullName}</span>
                                    </div>
                                    <div className="flex justify-between border-b border-white/5 pb-2">
                                        <span className="text-xs text-text-secondary">Phone</span>
                                        <span className="text-xs font-bold">{formData.phone}</span>
                                    </div>
                                    <div className="flex justify-between border-b border-white/5 pb-2">
                                        <span className="text-xs text-text-secondary">PAN</span>
                                        <span className="text-xs font-bold uppercase">{formData.panNumber}</span>
                                    </div>
                                    <div className="flex justify-between border-b border-white/5 pb-2">
                                        <span className="text-xs text-text-secondary">KYC Tier</span>
                                        <span className={`text-xs font-black ${kycType === 'MIN' ? 'text-accent-cyan' : 'text-purple-400'}`}>
                                            {kycType === 'MIN' ? 'MINIMUM' : 'FULL'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <label className="flex gap-3 cursor-pointer group">
                                    <input type="checkbox" className="hidden" id="consent" />
                                    <div className="w-5 h-5 rounded border border-white/20 flex items-center justify-center group-hover:border-accent-cyan transition-colors">
                                        <CheckCircle className="w-3 h-3 text-transparent group-active:text-accent-cyan" />
                                    </div>
                                    <span className="text-[10px] text-text-secondary leading-relaxed">
                                        I hereby consent to share my Aadhaar and PAN details for the purpose of KYC verification as per RBI Master Direction on PPIs.
                                    </span>
                                </label>

                                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3">
                                    <Lock className="w-4 h-4 text-text-secondary" />
                                    <span className="text-[10px] text-text-secondary font-bold uppercase tracking-widest">End-to-End Encrypted</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Navigation */}
                    <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-bg-primary via-bg-primary/95 to-transparent pt-12">
                        {currentStep < STEPS.length - 1 ? (
                            <button 
                                onClick={handleNext}
                                className={`w-full p-4 rounded-2xl flex items-center justify-center gap-2 font-black text-sm uppercase tracking-widest shadow-lg ${kycType === 'MIN' ? 'bg-accent-cyan text-bg-primary' : 'bg-purple-500 text-white'}`}
                            >
                                Next Step <ChevronRight className="w-5 h-5" />
                            </button>
                        ) : (
                            <button 
                                onClick={handleSubmit}
                                className={`w-full p-4 rounded-2xl flex items-center justify-center gap-2 font-black text-sm uppercase tracking-widest shadow-lg ${kycType === 'MIN' ? 'bg-accent-cyan text-bg-primary' : 'bg-purple-500 text-white'}`}
                            >
                                Submit KYC <Shield className="w-5 h-5" />
                            </button>
                        )}
                    </div>
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

export default KYCScreen;
