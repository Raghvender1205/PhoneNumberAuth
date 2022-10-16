const User = require('../models/user.model');

const {
    PHONE_NOT_FOUND_ERR,
    PHONE_ALREADY_EXISTS_ERR,
    USER_NOT_FOUND_ERR,
    INCORRECT_OTP_ERR,
    ACCESS_DENIED_ERR,
} = require('../errors');

const { checkPassword, hashPassword } = require('../utils/password.util');
const { createJWTtoken } = require('../utils/token.util');
const { generateOTP, fast2sms } = require('../utils/otp.util');

/**
 * Create a new User
 */
exports.createNewUser = async (req, res, next) => {
    try {
        let {phone, name} = req.body;

        const phoneExist = await User.findOne({ phone }); // Check for Duplicate
        if (phoneExist) {
            next({ status: 400, message: PHONE_ALREADY_EXISTS_ERR });
            return;
        }

        const createUser = new User({
            phone, name,
            role: phone == process.env.ADMIN_PHONE ? "ADMIN" : "USER"
        });
        const user = await createUser.save();

        res.status(200).json({
            type: "Success",
            message: "Account Created",
            date: {
                userId: user._id,
            },
        });

        // Generate OTP
        const otp = generateOTP(6);
        user.phoneOTP = otp;
        await user.save();

        await fast2sms(
            {
                message: `Sign up OTP is ${otp}`,
                phoneNumber: user.phone,
            },
            next
        );
    } catch (err) {
        next(err);
    }
};

/**
 * Login using OTP
 */
exports.loginWithOTP = async (res, req, next) => {
    try {
        const { phone } = req.body;
        const user = await User.findOne({ phone });
        if (!user) {
            next({ status: 400, message: PHONE_NOT_FOUND_ERR });
            return;
        }

        res.status(201).json({
            type: "Success",
            message: "OTP Sent to your Phone Number",
            date: {
                userId: user._id,
            }
        });

        const otp = generateOTP(6);
        user.phoneOtp = otp;
        user.isAccountVerified = true;
        await user.save();
        await fast2sms({
            message: `Your OTP is ${otp}`,
            contactNumber: user.phone,
        }, next);
    } catch (err) {
        next(err);
    }
};

/**
 * Verify OTP
 */
exports.verifyOTP = async (req, res, next) => {
    try {
        const { otp, userId } = req.body;
        const user = await User.findById(userId);
        if (!user) {
            next({ status: 400, message: USER_NOT_FOUND_ERR });
            return;
        }

        if (user.phoneOtp !== otp) {
            next({ status: 400, message: INCORRECT_OTP_ERR });
            return;
        }

        const token = createJwtToken({ userId: user._id });
        user.phoneOtp = "";
        await user.save();

        res.status(201).json({
            type: "Success",
            message: "OTP verified!!",
            data: {
                token,
                userId: user._id,
            },
        });
    } catch (err) {
        next(err);
    }
};

/**
 * Fetch Current User
 */
exports.fetchCurrUser = async (req, res, next) => {
    try {
        const currUser = res.locals.user;
        return res.status(200).json({
            type: "Success",
            message: "Fetch Current User",
            data: {
                user: currUser,
            },
        });
    } catch (err) {
        next(err);
    }
};

/**
 * Admin Access Only
 */
exports.handleAdmin = async (req, res, next) => {
    try {
        const currUser = res.locals.user;

        return res.status(200).json({
            type: "Success",
            message: "You are an Admin!!",
            data: {
                user: currUser,
            },
        });
    } catch (err) {
        next(err);
    }
};