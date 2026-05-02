import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const KYCContext = createContext();

export const KYCProvider = ({ children }) => {
    const { user } = useAuth();
    const [kycStatus, setKycStatus] = useState('NOT_STARTED'); // NOT_STARTED, PENDING, MIN_KYC, FULL_KYC, REJECTED
    const [kycLevel, setKycLevel] = useState('NONE');
    const [loading, setLoading] = useState(true);
    const [limits, setLimits] = useState({ daily: {}, monthly: {} });

    const fetchKYCStatus = async () => {
        if (!user) return;
        try {
            const token = await user.getIdToken();
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/kyc/status`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setKycStatus(response.data.kycStatus);
            setKycLevel(response.data.kycLevel);
            setLimits(response.data.limits);
        } catch (error) {
            console.error('Failed to fetch KYC status:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchKYCStatus();
    }, [user]);

    const submitKYC = async (type, data) => {
        try {
            const token = await user.getIdToken();
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/kyc/submit`, 
                { type, data },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            
            if (response.data.success) {
                toast.success(type === 'MIN' ? 'Minimum KYC Completed!' : 'Full KYC Submitted for Review');
                fetchKYCStatus();
                return true;
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'KYC submission failed');
            return false;
        }
    };

    const value = {
        kycStatus,
        kycLevel,
        loading,
        limits,
        submitKYC,
        refreshKYC: fetchKYCStatus
    };

    return <KYCContext.Provider value={value}>{children}</KYCContext.Provider>;
};

export const useKYC = () => {
    const context = useContext(KYCContext);
    if (!context) throw new Error('useKYC must be used within a KYCProvider');
    return context;
};
