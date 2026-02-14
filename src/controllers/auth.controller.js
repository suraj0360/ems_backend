import * as authService from '../services/auth.service.js';
import catchAsync from '../utils/catchAsync.js';

const setCookies = (res, accessToken, refreshToken) => {
    res.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Lax',
        maxAge: 15 * 60 * 1000,
    });
    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Lax',
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });
};

export const register = catchAsync(async (req, res) => {
    const { user, accessToken, refreshToken } = await authService.register(req.body);
    setCookies(res, accessToken, refreshToken);
    res.status(201).json({ status: 'success', data: { user, accessToken, refreshToken } });
});

export const login = catchAsync(async (req, res) => {
    const { user, accessToken, refreshToken } = await authService.login(req.body);
    setCookies(res, accessToken, refreshToken);
    res.status(200).json({ status: 'success', data: { user, accessToken, refreshToken } });
});

export const logout = catchAsync(async (req, res) => {
    await authService.logout(req.user._id);
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    res.status(200).json({ status: 'success', message: 'Logged out successfully' });
});

export const refresh = catchAsync(async (req, res) => {
    const refreshToken = req.cookies.refreshToken || req.body.refreshToken;
    if (!refreshToken) throw new Error('No refresh token provided');

    // Decode to get user id (simplified, ideally verify generic structure first)
    // Assuming the middleware or service handles robust verification
    // But here we need ID to call service.
    // We can let the service handle verify if we pass just token? 
    // But service needs user ID to find user first.

    // Workaround: Decode without verify to get ID, then verify in service properly?
    // Or just verify here.
    const jwt = await import('jsonwebtoken');
    const decoded = jwt.decode(refreshToken);
    if (!decoded) throw new Error('Invalid token');

    const tokens = await authService.refreshTokens(decoded.sub, refreshToken);
    setCookies(res, tokens.accessToken, tokens.refreshToken);

    res.status(200).json({ status: 'success', data: tokens });
});
