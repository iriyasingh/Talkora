import User from '../models/user.model.js';
import jwt from 'jsonwebtoken';
import { upsertStreamUser } from '../lib/stream.js';


export async function signup(req, res) {

    const { fullName, email, password } = req.body;

    try{

        if(!fullName || !email || !password){
            return res.status(400).json({ message: "Please provide all required fields" });
        }

        if(password.length < 6){
            return res.status(400).json({ message: "Password must be at least 6 characters long" });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if(!emailRegex.test(email)){
            return res.status(400).json({ message: "Please provide a valid email address" });
        }

        const existingUser = await User.findOne({ email });

        if(existingUser){
            return res.status(400).json({ message: "User with this email already exists" });
        }

        const idx = Math.floor(Math.random() * 100);
        const randomAvatar = `https://api.dicebear.com/10.x/lorelei/`;

        const newUser = await User.create({
            fullName,
            email,
            password,
            profilePicture: randomAvatar
        });

        const safeUser = await User.findById(newUser._id).select("-password");


        try {
            await upsertStreamUser({
                id: newUser._id.toString(),
                name: newUser.fullName,
                email: newUser.email,
                image: newUser.profilePicture|| "",
            });
            console.log("Stream user upserted successfully for ${newUser.fullName}");
        } catch (error) {
            console.error("Error upserting Stream user:", error);
        }

        //TODO: Create the user  in STREAM as well

        const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

        res.cookie("jwt", token, { 
            httpOnly: true,  //prevent XSS attack
            maxAge: 7 * 24 * 60 * 60 * 1000,
            sameSite: "none", //allow cross-site requests (Vite dev + API)
            secure: process.env.NODE_ENV === "production" //only send cookie over HTTPS in production
        });

        res.status(201).json({ success: true, message: "User created successfully", user: safeUser, token });

    } catch (error) {
        console.error("Error during signup:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }



} 

export async function login(req, res) {
    try{
        const { email, password } = req.body;

        if(!email || !password){
            return res.status(400).json({ message: "Please provide all required fields" });
        }

        const user = await User.findOne({ email });

        if(!user){
            return res.status(400).json({ message: "Invalid email or password" });
        }

        const isPasswordCorrect = await user.matchPassword(password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

        res.cookie("jwt", token, { 
            httpOnly: true,  //prevent XSS attack
            maxAge: 7 * 24 * 60 * 60 * 1000,
            sameSite: "none", //allow cross-site requests (Vite dev + APIsameSite: "none", //allow cross-site requests (Vite dev + API)
            secure: process.env.NODE_ENV === "production" //only send cookie over HTTPS in production
        });

        const safeUser = await User.findById(user._id).select("-password");

        res.status(200).json({ success: true, message: "Login successful", user: safeUser, token });
    }
    catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}   

export function logout(req, res) {
    // clear cookie with same options used when setting it
    res.clearCookie("jwt", { httpOnly: true, sameSite: "none", secure: process.env.NODE_ENV === "production" });
    res.status(200).json({success: true, message: "Logged out successfully" });
}

export async function onboard(req, res) {
    try {
        const userId= req.user._id

        const { fullName, bio, profilePicture, nativeLanguage, learningLanguage, location } = req.body

        if(!fullName || !bio || !nativeLanguage || !learningLanguage || !location){
            return res.status(400).json({ 
                message: "Please provide all required fields" ,
                missingFields: [
                    !fullName && "fullName",
                    !bio && "bio",
                    // !profilePicture && "profilePicture",
                    !nativeLanguage && "nativeLanguage",
                    !learningLanguage && "learningLanguage",
                    !location && "location",
                ].filter(Boolean) //filter out falsy values
            });
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,{
            fullName,
            bio,
            profilePicture,
            nativeLanguage,
            learningLanguage,
            location,
            isOnboarded: true,
            },{new: true})

        if (!updatedUser) return res.status(404).json({ message: "User not found" });

        await upsertStreamUser({
            id: updatedUser._id.toString(), 
            name: updatedUser.fullName, 
            email: updatedUser.email, 
            image: updatedUser.profilePicture || ""
        });

        console.log(`Stream user upserted successfully for ${updatedUser.fullName}`);

        //todo = update the user in STREAM as well
        
        res.status(200).json({ message: "User onboarded successfully", user: updatedUser });



            
    } catch (error) {
        console.error("Error during onboard:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}