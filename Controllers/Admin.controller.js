const UserModel = require("../Models/User.model");
const AddressModel = require("../Models/Addresses.model");

const bcrypt = require("bcrypt");
const SendMail = require("../Config/SendMail");
const UserCreationTemplate = require("../Email/UserCreationTemplate");

exports.adminCreateUser = async (req, res) => {
  let payload = req.body;
  let { email, password, name, phone_number } = req.body;
  const test = { email, password, name, phone_number: +phone_number };

  for (const key in test) {
    if (!test[key])
      return res.status(401).send({
        message: `Please Provide ${key}, Mandatory field missing: ${key}`,
      });
  }
  try {
    bcrypt.hash(password, 10, async (err, hash) => {
      if (err)
        return res
          .status(500)
          .send({ message: "Something Went Wrong", Err: "Bcrypt Error" });
      const address = new AddressModel(payload?.address);
      await address.save();

      payload.address = address._id;
      payload.password = hash;


            const instance = new UserModel(payload)
            SendMail({
                recipientEmail: instance.email,
                client_name: instance.name,
                subject: 'Account Created',
                content: UserCreationTemplate(instance),
            })
            await instance.save()
            return res.status(200).send({ message: "New User Created Successfully", instance });
        })
    } catch (err) {
        console.log(err);
        return res.status(500).send({ message: err?.message || "Something went Wrong" })
    }
}



exports.getAllUsers = async (req, res) => {
  try {
    let users = await UserModel.find();
    return res.status(200).send({ message: "All Users", success: true, users });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ message: error?.message || "Server Error 500" });
  }
};
exports.DeleteUserById = async (req, res) => {
  let id = req.params.id;
  try {
    await UserModel.findByIdAndDelete(id);
    return res
      .status(200)
      .send({ message: "Deleted The User with ID : " + id });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ message: error?.message || "Server Error 500" });
  }
};

exports.searchUserWithName = async (req, res) => {
  const search = req.query.search;
  const regex = new RegExp(search, "i");
  try {
    let query = {};
    let queryArr = [{ name: regex }, { email: regex }];
    query["$or"] = queryArr;

    let foundUser = await UserModel.find(query);
    return res.status(200).send({
      success: true,
      message: "Searched Users",
      count: foundUser.length,
      foundUser,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ message: error?.message || "Server Error 500" });
  }
};

exports.adminInviteUser = async (req, res) => {
  let id = req.params.id;
  let { recipientEmail, client_name, subject, content } = req.body;
  try {
    SendMail({ recipientEmail, client_name, subject, content });
    return res.status(200).send({ message: "Invite user with ID" + id });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ message: error?.message || "Server Error 500" });
  }
};
