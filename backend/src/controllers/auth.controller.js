const UserModel = require('../models/user.model')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
dotenv.config()



async function registerUser(req, res) {

    try {
        const { name, email, password } = req.body;

        const isUserAlreadyExist = await UserModel.findOne(
            {
                email
            }
        )

        //checking if user already exists in database

        if (isUserAlreadyExist) {
            return res.status(400).json({
                message: "user already exists"
            })
        }

        //hashing password before registering a user

        const hashedPassword = await bcrypt.hash(password, 10)

        const user = await UserModel.create(
            {
                name,
                email,
                password: hashedPassword
            }
        )

        //creating token
        const token = jwt.sign(
            {
                id: user._id,
            }, process.env.JWT_SECRET
        )

        res.cookie("token", token)

        res.status(201).json(
            {
                message: "user created successfully",
                user:
                {
                    _id: user._id,
                    email: user.email,
                    name: user.name
                }
            }

        )
    } catch (error) {
        res.status(400).json(
            {
                message: `Internal Server Error ${error}`,

            })
    }

}

async function loginUser(req, res) {

    try {
        const { email, password } = req.body;


        const user = await UserModel.findOne(
            {
                email
            }
        )

        if (!user) {
            return res.status(400).json({
                message: "Invalid email or password"
            })
        }

        const isPasswordValid = await bcrypt.compare(password, user.password)

        if (!isPasswordValid) {
            return res.status(400).json({
                message: "Invalid email or password"
            })
        }

        const token = jwt.sign(
            {
                id: user._id,
            }, process.env.JWT_SECRET
        )

        res.cookie("token", token)
        res.status(200).json({
            message: "user logged in successfully",
            user:
            {
                _id: user._id,
                email: user.email,
                name: user.name
            }
        })
    }
    catch (error) {
        res.status(400).json(
            {
                message: `Internal Server Error ${error}`,

            })
    }
}

function logoutUser(req,res)
{
res.clearCookie("token");
res.status(200).json({
    message:"user logged out successfully"
})
}

async function getMe(req, res) {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: "login first" })
        }

        const user = await UserModel.findById(req.user.id).select('_id email name')
        if (!user) {
            return res.status(404).json({ message: "user not found" })
        }

        return res.status(200).json({ user })
    } catch (error) {
        return res.status(400).json({ message: `Internal Server Error ${error}` })
    }
}
module.exports = {
    registerUser,
    loginUser,logoutUser,
    getMe
}