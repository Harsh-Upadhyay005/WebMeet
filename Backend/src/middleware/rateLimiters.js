import rateLimit from 'express-rate-limit';

const userKeyGenerator = (req) => req.user?._id?.toString() || req.user?.id?.toString() || req.ip;

const createUserLimiter = ({ windowMs, max, message }) =>
    rateLimit({
        windowMs,
        max,
        message,
        standardHeaders: true,
        legacyHeaders: false,
        keyGenerator: userKeyGenerator,
    });

export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: 'Too many login or signup attempts, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
});

export const profileLimiter = createUserLimiter({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: 'Too many profile changes, please try again later.',
});

export const streamTokenLimiter = createUserLimiter({
    windowMs: 15 * 60 * 1000,
    max: 30,
    message: 'Too many Stream token requests, please try again later.',
});

export const friendActionLimiter = createUserLimiter({
    windowMs: 15 * 60 * 1000,
    max: 20,
    message: 'Too many friend request actions, please try again later.',
});

export const groupMutationLimiter = createUserLimiter({
    windowMs: 15 * 60 * 1000,
    max: 20,
    message: 'Too many group changes, please try again later.',
});

export const roomCreationLimiter = createUserLimiter({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: 'Too many meeting creations, please try again later.',
});

export const roomJoinLimiter = createUserLimiter({
    windowMs: 15 * 60 * 1000,
    max: 15,
    message: 'Too many meeting join attempts, please try again later.',
});
