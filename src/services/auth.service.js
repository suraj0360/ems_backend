import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import AppError from '../utils/appError.js';

const signTokens = (userId, email, role) => {
    const accessToken = jwt.sign(
        { sub: userId, email, role },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRY || '15m' }
    );

    const refreshToken = jwt.sign(
        { sub: userId, email, role },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRY || '7d' }
    );

    return { accessToken, refreshToken };
};

export const register = async (userData) => {
    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) {
        throw new AppError('User already exists', 400);
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const user = await User.create({
        ...userData,
        role: userData.role ? userData.role.toUpperCase() : 'USER',
        password: hashedPassword,
    });

    const tokens = signTokens(user._id, user.email, user.role);

    // Store refresh token (hashed in a real app, keeping simple here to match logic)
    // Or better, hash it.
    const hashedRefreshToken = await bcrypt.hash(tokens.refreshToken, 10);
    user.refreshToken = hashedRefreshToken;
    await user.save();

    const userObj = user.toObject();
    delete userObj.password;
    delete userObj.refreshToken;

    return { user: userObj, ...tokens };
};

export const login = async ({ email, password }) => {
    const user = await User.findOne({ email }).select('+password +refreshToken');
    if (!user || !(await bcrypt.compare(password, user.password))) {
        throw new AppError('Invalid credentials', 401);
    }

    const tokens = signTokens(user._id, user.email, user.role);

    // Update refresh token
    const hashedRefreshToken = await bcrypt.hash(tokens.refreshToken, 10);
    user.refreshToken = hashedRefreshToken;
    await user.save();

    const userObj = user.toObject();
    delete userObj.password;
    delete userObj.refreshToken;

    return { user: userObj, ...tokens };
};

export const refreshTokens = async (userId, refreshToken) => {
    const user = await User.findById(userId).select('+refreshToken');
    if (!user || !user.refreshToken) throw new AppError('Access Denied', 401);

    const isMatching = await bcrypt.compare(refreshToken, user.refreshToken);
    if (!isMatching) throw new AppError('Access Denied', 401);

    const tokens = signTokens(user._id, user.email, user.role);

    // Update refresh token
    const hashedRefreshToken = await bcrypt.hash(tokens.refreshToken, 10);
    user.refreshToken = hashedRefreshToken;
    await user.save();

    return tokens;
};

export const logout = async (userId) => {
    await User.findByIdAndUpdate(userId, { refreshToken: null });
};
