const otps = require("../models/otps");
const twilio = require("twilio");
const users = require("../models/users");

// const client = twilio(
//   process.env.TWILIO_ACCOUNT_SID,
//   process.env.TWILIO_AUTH_TOKEN
// );

const otpGenerator = async (req, res) => {
  const { phoneNumber } = req.body;

  const userRecord = await users.findOne({ phoneNumber });

  if (userRecord) {
    return res
      .status(400)
      .json({ success: false, message: " user is already vote marked " });
  }

  const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

  const userNumber = await otps.findOne({ phoneNumber });

  if (userNumber) {
    await otps.updateOne(
      { phoneNumber },
      { $set: { otp: otpCode, createdAt: new Date() } }
    );
    const newOtp = await otps.findOne({ phoneNumber });
    return res.status(200).json(newOtp);
  }
  const otp = new otps({
    phoneNumber,
    otp: otpCode,
    createdAt: new Date(),
  });

  const sendData = await otp.save();

  if (sendData) {
    return res.status(200).json(sendData);
  }

  //   client.messages
  //     .create({
  //       body: ` Your OTP code is ${otpCode} `,
  //       from: process.env.TWILIO_PHONE_NUMBER,
  //       to: phoneNumber,
  //     })
  //     .then((message) =>
  //       res.status(200).json({ success: true, message: "OTP send successfully" })
  //     )
  //     .catch((err) =>
  //       res
  //         .status(500)
  //         .json({ success: false, message: "failed to send OTP", error: err })
  //     );
};
const otpValidation = async (req, res) => {
  const { phoneNumber, otp } = req.body;

  const otpRecode = await otps
    .findOne({ phoneNumber, otp })
    .sort({ createdAt: -1 });

  if (!otpRecode) {
    return res.status(400).json({ success: false, message: "Invalid OTP " });
  }

  const currentTime = new Date();
  const otpTime = new Date(otpRecode.createdAt);
  const differentMinutes = Math.floor((currentTime - otpTime) / 1000 / 60);

  if (differentMinutes > 5) {
    await otps.deleteMany({ phoneNumber, otp });
    return res.status(400).json({ success: false, message: ` OTP expired ` });
  }

  await otps.deleteMany({ phoneNumber, otp });

  const newUser = new users({
    phoneNumber: otpRecode?.phoneNumber,
  });
  await newUser.save();
  return res
    .status(200)
    .json({ success: true, message: "OTP verified successfully " });
};

module.exports = { otpGenerator, otpValidation };
