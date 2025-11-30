import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import './Callback.css';

const Callback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { handleCallback } = useAuth();
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(true);
  const processedRef = useRef(false);

  useEffect(() => {
    const processCallback = async () => {
      // Prevent double processing
      if (processedRef.current) return;
      processedRef.current = true;

      const code = searchParams.get('code');
      const state = searchParams.get('state');
      const errorParam = searchParams.get('error');

      if (errorParam) {
        setError(`Authorization failed: ${errorParam}`);
        setProcessing(false);
        return;
      }

      if (!code) {
        setError('No authorization code received');
        setProcessing(false);
        return;
      }

      try {
        await handleCallback(code, state);
        navigate('/', { replace: true });
      } catch (err) {
        console.error('Callback error:', err);
        setError('Failed to complete authentication. Please try again.');
        setProcessing(false);
      }
    };

    processCallback();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (error) {
    return (
      <div className="callback-page">
        <div className="callback-container error">
          <div className="callback-icon error">✕</div>
          <h2>Authentication Failed</h2>
          <p>{error}</p>
          <button 
            className="btn btn-primary"
            onClick={() => navigate('/login')}
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="callback-page">
      <div className="callback-container">
        {processing && (
          <>
            <div className="callback-spinner"></div>
            <h2>Completing Authentication</h2>
            <p>Please wait while we connect to your Tesla account...</p>
          </>
        )}
      </div>
    </div>
  );
};

export default Callback;
