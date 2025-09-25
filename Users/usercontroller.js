const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("./usermodel");
const crypto = require("crypto"); // Added this line

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

exports.register = async(req, res)=>{
    try{
        const {name, email, password, role} = req.body;

        const existingUser = await User.findByEmail(email);
        if (existingUser){
            return res.status(400).json({message:"Email already exists"});
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user_id = await User.create(name, email, hashedPassword, role);

        res.status(201).json({message: "User registered", user_id});
    }
    catch(error){
        console.error(error);
        res.status(500).json({message:"Server error"});
    }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.getAll();
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error while fetching users" });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.login= async(req, res)=>{
    try{
        const {email, password}= req.body;

        const user = await User.findByEmail(email);
        if(!user) return res.status(401).json({message:"Invalid credentials"});

        const isMatch =await bcrypt.compare(password, user.password);
        if(!isMatch) return res.status(401).json({message:"Invalid credentials"});

        const token = jwt.sign(
            {id: user.user_id, role: user.role},
            JWT_SECRET,
            {expiresIn: "1h"}
        );
        return res.json({
            message:"Login successful",
            token,
            user:{
                id: user.user_id,
                name:user.name,
                email:user.email,
                role:user.role
            }
        })
    }
    catch(error){
        console.error(error);
        res.status(500).json({message:"Server error"});
    }
};

exports.changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid current password." });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await User.updatePassword(user.user_id, hashedPassword);

        res.json({ message: "Password updated successfully." });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error." });
    }
};

exports.promoteUser = async(req, res)=>{
    try{
        const {id} = req.params;
        await User.updateRole(id, "admin");

        res.json({message:"User promoted to admin"});
    }
    catch(error){
        res.status(500).json({message:"Server error"});
    }
}

exports.demoteUser= async(req, res)=>{
  try{
    const {id}= req.params;
    await User.updateRole(id, "user");

    res.json({message:"User demoted to user"});
  }
  catch(error){
    res.status(500).json({message:"Server error"});
  }
};

exports.forgotPassword= async(req, res)=>{
   try {
        const { email } = req.body;
        const user = await User.findByEmail(email);

        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        const resetToken = crypto.randomBytes(32).toString("hex");
        const resetTokenExpires = Date.now() + 3600000;
        await User.savePasswordResetToken(user.user_id, resetToken, resetTokenExpires);
        const resetUrl = `http://localhost:5173/reset-password?token=${resetToken}`;
        console.log(`Password reset URL: ${resetUrl}`);

        res.json({ message: "Password reset link has been sent to your email." });
    } catch (error) {
        res.status(500).json({ message: "Server error." });
    }
};

exports.resetPassword= async(req, res)=>{
   try {
        const { token, newPassword } = req.body;
        const user = await User.findByResetToken(token);

        if (!user || user.reset_token_expires < Date.now()) {
            return res.status(400).json({ message: "Invalid or expired token." });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await User.updatePassword(user.user_id, hashedPassword);
        await User.clearPasswordResetToken(user.user_id);

        res.json({ message: "Password has been reset successfully." });
    } catch (error) {
        res.status(500).json({ message: "Server error." });
    }
};