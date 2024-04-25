const router = require("express").Router();
const User = require("../models/User");
const Order = require("../models/Order");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const STATUS_INVALID = "Invalid license number or password.";
const STATUS_EXISTED = "License number already exists.";
const STATUS_ERROR = "Internal server error";
const STATUS_SUCCESS = "User registered successfully.";

router.post("/signup", async (req, res) => {
  try {
    const { name, licenseNo, role, password } = req.body;

    const existingLicenseNo = await User.findOne({ licenseNo });

    if (existingLicenseNo) {
      return res.status(400).json({ error: STATUS_EXISTED });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({
      name,
      licenseNo,
      password: hashedPassword,
      role,
      age: null,
      email: "",
      address: "",
    });

    const savedUser = await user.save();

    res.json({
      message: STATUS_SUCCESS,
      userId: savedUser._id,
    });
  } catch (e) {
    console.error(error);
    res.status(500).json({ error: STATUS_ERROR });
  }
});

router.post("/login", async (req, res) => {
  const { licenseNo, password } = req.body;

  const user = await User.findOne({ licenseNo });

  if (!user) return res.status(400).send(STATUS_INVALID);

  const validPassword = await bcrypt.compare(password, user.password);

  if (!validPassword) return res.status(400).send(STATUS_INVALID);

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY);

  res.send({ token });
});

router.get("/employees", async (req, res) => {
  try {
    const users = await User.find({ isAdmin: false }).populate("name");
    console.log("users", users);
    res.json({
      data: users.map((user) => ({
        id: user._id,
        licenseNo: user.licenseNo,
        name: user.name,
        age: user.age,
        address: user.age,
        email: user.email,
        role: user.role
      })),
    });
  } catch (err) {
    res.status(400).send(err.message);
  }
});

router.patch("/employee/:id", async (req, res) => {
  const { id } = req.params;
  const { name, licenseNo } = req.body;

  await User.findByIdAndUpdate({ _id: id }, { name, licenseNo });
  const users = await User.find();
  console.log("updated employee", users);
  try {
    res.status(200).json(users);
  } catch (e) {
    res.status(400).send(e.message);
  }
});

router.delete("/employee/:id", async (req, res) => {
  const { id } = req.params;
  const { user_id } = req.body;
  try {
    // const user = await User.findById(user_id);
    // if(!user.isAdmin) return res.status(401).json("You don't have permission");
    await User.findByIdAndDelete({ _id: id });
    const users = await User.find();
    res.status(200).json(users);
  } catch (e) {
    res.status(400).send(e.message);
  }
});

router.post("/employee", async (req, res) => {
  const DEFAULT_PASSWORD = "123";
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(DEFAULT_PASSWORD, salt);
  try {
    const { name, licenseNo } = req.body;
    await User.create({
      name,
      licenseNo,
      password: hashedPassword,
      age: null,
      role: 'Nurse',
      email: "",
      address: "",
    });
    const users = await User.find();
    res.status(201).json(users);
  } catch (e) {
    res.status(400).send(e.message);
  }
});

// // get users;

// router.get("/", async (req, res) => {
//   try {
//     const users = await User.find({ isAdmin: false }).populate("orders");
//     res.json(users);
//   } catch (e) {
//     res.status(400).send(e.message);
//   }
// });

// // get user orders

// router.get("/:id/orders", async (req, res) => {
//   const { id } = req.params;
//   try {
//     const user = await User.findById(id).populate("orders");
//     res.json(user.orders);
//   } catch (e) {
//     res.status(400).send(e.message);
//   }
// });
// // update user notifcations
// router.post("/:id/updateNotifications", async (req, res) => {
//   const { id } = req.params;
//   try {
//     const user = await User.findById(id);
//     user.notifications.forEach((notif) => {
//       notif.status = "read";
//     });
//     user.markModified("notifications");
//     await user.save();
//     res.status(200).send();
//   } catch (e) {
//     res.status(400).send(e.message);
//   }
// });

module.exports = router;
