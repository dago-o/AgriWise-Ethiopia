import jwt from 'jsonwebtoken';

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Token is required' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(403).json({
            message: 'Invalid or expired token'
        });
    }
};

const authorizeRole = (allowedRoles) => (req, res, next) => {
    if (!req.user || !req.user.role) {
        return res.status(403).json({
            message: 'Forbidden - no role found'
        });
    }

    if (!allowedRoles.includes(req.user.role)) {
        return res.status(403).json({
            message: 'Forbidden - insufficient permissions'
        });
    }

    next();
};

export { authenticateToken, authorizeRole };