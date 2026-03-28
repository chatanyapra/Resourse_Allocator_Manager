import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'default-secret-change-me';

// Middleware to authenticate JWT tokens
const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({
            error: 'Authorization header is required',
            code: 'AUTH_MISSING',
        });
    }

    let tokenString = authHeader;
    if (authHeader.startsWith('Bearer ')) {
        tokenString = authHeader.slice(7);
    }

    try {
        const decoded = jwt.verify(tokenString, JWT_SECRET);
        // The Go auth-service JWT contains "user_id" in the claims.
        // Controllers expect req.user.id, so we set req.user as an object.
        req.user = { id: decoded.user_id };
        req.userID = decoded.user_id; // Keep backward compatibility
        next();
    } catch (err) {
        return res.status(401).json({
            error: 'Invalid or expired token',
            code: 'TOKEN_INVALID',
        });
    }
};

export { authenticate };