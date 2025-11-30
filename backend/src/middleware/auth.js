const requireAuth = (req, res, next) => {
  // Check for Bearer token in Authorization header
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    // If we have a session, update it (or create a mock one if session middleware didn't)
    if (!req.session) {
      req.session = {};
    }
    req.session.accessToken = token;
    // Note: We can't easily get refresh token or expiry from just the access token here
    // unless we decode it (if it's JWT) or look it up. 
    // For now, we assume if the client sends a valid Bearer token, they handle refresh.
  }

  console.log('🔒 Auth check');
  console.log('   Path:', req.path);
  console.log('   Session ID:', req.sessionID);
  console.log('   Has access token:', !!req.session?.accessToken);
  
  if (!req.session?.accessToken) {
    console.log('❌ No access token in session or header');
    return res.status(401).json({ error: 'Authentication required' });
  }
  
  // Check if token is expired (only works if we have expiry in session)
  if (req.session.tokenExpiry && Date.now() > req.session.tokenExpiry) {
    console.log('❌ Token expired');
    return res.status(401).json({ error: 'Token expired', code: 'TOKEN_EXPIRED' });
  }
  
  console.log('✅ Auth check passed');
  next();
};

module.exports = requireAuth;
