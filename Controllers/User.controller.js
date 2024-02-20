const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const UserModel = require("../Models/User.model");
const { generateOTP } = require("../helperFunction/generateOTP");
const SendMail = require("../Config/SendMail");
const FeedbackModel = require("../Models/Feedback.model");
const MeetingModel = require("../Models/Meeting.model");

require("dotenv").config();

exports.AuthLogin = async (req, res) => {
  const { email, password } = req.body;
  const test = { email, password };
  for (const key in test) {
    if (!test[key])
      return res.status(401).send({
        message: `Please Provide ${key}, Mandatory field missing: ${key}`,
      });
  }
  try {
    let user = await UserModel.findOne({ email });
    if (!user)
      return res
        .status(404)
        .send({ message: "Email Not Found, Please check entered email" });
    if (user.working_status == "disabled")
      return res.status(400).send({
        message: "Account on Hold",
        status: "info",
        desc: "Your account has been under survey, Please wait we will contact you soon!",
      });

    bcrypt.compare(password, user?.password).then(async (result) => {
      if (!result) {
        return res.status(404).send({ message: "Wrong Credentials" });
      } else {
        const token = jwt.sign(
          { id: user?._id, role: user?.role },
          process.env.JSON_SECRET
        );
        let instance = await UserModel.findOne({ email }).select({
          password: 0,
        });
        res.send({ message: "Login Successful", token, user: instance });
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Something went Wrong" });
  }
};
exports.getAllUsers = async (req, res) => {
  let limit = req.query.limit || 10;
  let page = req.query.page || 1;
  page = page > 0 ? page : 1;
  let skip = (page - 1) * limit || 0;
  try {
    const Users = await UserModel.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip)
      .populate(["address"])
      .select({ password: 0 });
    const TotalUsers = await UserModel.find().count();
    res.send({
      message: `All Users Page ${page}`,
      Count: Users.length,
      Users,
      TotalUsers,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Something went Wrong" });
  }
};

exports.UpdateUserByID = async (req, res) => {
  let id = req.params.id;
  let payload = req.body;

  try {
    let updatedUser = await UserModel.findByIdAndUpdate(id, payload, {
      new: true,
    });
    return res
      .status(200)
      .send({ message: "Updated The User with ID : " + id, updatedUser });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: error?.message || "Server Error 500" });
  }
};

exports.searchUser = async (req, res) => {
  const query = req.body;
  try {
    let Users = await UserModel.find(query)
      .sort({ createdAt: -1 })
      .populate(["address"])
      .select({ password: 0 });
    res
      .status(200)
      .send({ message: "Searched Users", count: Users.length, Users: Users });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: error?.message || "Server Error 500" });
  }
};
exports.changePassword = async (req, res) => {
  let { newPass, userID } = req.body;

  try {
    let user = await UserModel.findById(userID);
    if (!user)
      return res
        .status(404)
        .send({ message: "Email Not Found, Please check entered email" });
    const Hash = await bcrypt.hash(newPass, 5);
    await UserModel.findByIdAndUpdate(userID, { password: Hash });
    let instance = await UserModel.findById(userID)
      .populate(["address"])
      .select({ password: 0 });
    return res.status(200).send({
      message: "Changed the password of user with user ID :" + userID,
      UpdatedUser: instance,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: error?.message || "Server Error 500" });
  }
};

exports.sendOTP = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    //Generating the 6 digit random OTP
    const otp = generateOTP();
    // Storing the OTP and its expiration time in the database, the expirestAt time is 5 minutes.
    user.otp = {
      code: otp,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    };
    await user.save();

    SendMail({
      recipientEmail: email,
      client_name: user.first_name + " " + user.last_name,
      subject: "OTP for Resetting the Password",
      content: otp,
    });

    res.status(200).json({ message: "OTP sent successfully",success:true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to send OTP" });
  }
};

exports.resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  try {
    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Verifying the OTP based on the expiresAt date. It should be in between five minutes.
    if (user.otp && user.otp.expiresAt && user.otp.expiresAt < new Date()) {
      // removing the otp field if the otp is expired
      await UserModel.findByIdAndUpdate(user._id, { $unset: { otp: 1 } });
      return res.status(400).json({
        message: "OTP has expired. Please generate a new OTP.",
      });
    }

    // Verifying the OTP provided from frontend
    if (!user.otp || user.otp.code !== otp) {
      return res.status(400).json({
        message: "Invalid OTP. Please provide the correct OTP.",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 5);
    await UserModel.findByIdAndUpdate(user._id, {
      password: hashedPassword,
      $unset: { otp: 1 },
    });

    res.status(200).json({ message: "Password reset successfully" ,success:true});
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to reset password" });
  }
};

exports.getAllFeedbacks = async (req, res) => {
  try {
    const allFeedbacks = await FeedbackModel.find();
    res.status(200).json({ allFeedbacks, success: true });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Failed to fetch feedbacks", success: false });
  }
};

exports.getFeedbackDetails = async (req, res) => {
  const feedbackId = req.params.feedbackId;

  try {
    const feedback = await FeedbackModel.findById(feedbackId);

    if (!feedback) {
      return res
        .status(404)
        .json({ message: "Feedback not found", success: false });
    }

    res.status(200).json({ feedback, success: true });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Failed to fetch feedback details", success: false });
  }
};

exports.postFeedback = async () => {
  const { user, feedback } = req.body;
  const meetingId = req.params.meetingId;

  try {
    const newFeedback = new FeedbackModel({ user, feedback });
    await newFeedback.save();

    const updatedMeeting = await MeetingModel.findByIdAndUpdate(
      meetingId,
      { feedback: newFeedback._id },
      { new: true }
    );

    if (!updatedMeeting) {
      return res.status(404).json({ message: "Meeting not found" });
    }

    res
      .status(201)
      .json({ message: "Feedback posted successfully", success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to post feedback" });
  }
};
