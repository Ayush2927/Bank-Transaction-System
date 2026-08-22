import mongoose from "mongoose";
import bcrypt from "bcryptjs"

const UserSchema = mongoose.Schema({
    email: {
        type: String,
        required: [true, "email is required for creating user"],
        trim: true,
        lowercase: true,
        match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Invalid email address"],
        unique: [true, "Email already exists"]
    },

    name: {
        type: String,
        required: [true, "Name is required for creating an account"],

    },

    password: {
        type: String,
        required: [true, "password is required for creating an account"],
        minLength: [6, "password should contain more than 6 characters "],
        select: false
    },

    systemUser: {
        type: Boolean,
        default: false,
        immutable: true,
        select: false
    },

    is2FAEnabled: {
        type: Boolean,
        default: false
    },

    otpCode: {
        type: String,
        select: false
    },

    otpExpiresAt: {
        type: Date,
        select: false
    }
},
    {
        timestamps: true
    })

UserSchema.pre("save", async function () {
    if (!this.isModified("password")) {
        return;
    }
    const hash = await bcrypt.hash(this.password, 10);
    this.password = hash;
});

UserSchema.methods.comparePassword = async function (password) {
    console.log(password, this.password)
    return await bcrypt.compare(password, this.password);
}

const User = mongoose.model("User", UserSchema)

export default User;