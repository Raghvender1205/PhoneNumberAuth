const fast2sms = require('fast-two-sms');
const { FAST2SMS } = require('../config');

exports.generateOTP = (otp_length) => {
    var digits = "0123456789";
    let OTP = "";
    for (let i = 0; i < otp_length; i++) {
        OTP += digits[Math.floor(Math.random() * 10)];
    }

    return OTP;
};

exports.fast2sms = async ({msg, phoneNumber}, next) => {
    try {
        const res = await fast2sms.sendMessage({
            authorization: FAST2SMS,
            msg,
            numbers: [phoneNumber],
        });
        console.log(res);
    } catch (err) {
        next(err);
    }
}