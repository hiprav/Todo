require('dotenv').config()
const config = require('./config.json')
const mongoose = require('mongoose');
mongoose.connect(config.connectionString)
const express = require("express")
const cors = require('cors')
const app = express();

const jwt = require('jsonwebtoken');
const { authtoken } = require('./util');
const User = require('./model/usermodel')
const todo = require('./model/todo')

app.use(express.json());

app.use(
    cors({
        origin: '*',
    })
);


app.post('/signup', async (req, res) => {
    const { email, password } = req.body;

    const isUser = await User.findOne({ email: email });

    if (isUser) {
        return res.json({
            error: true,
            message: "User already exists"
        })
    }

    const newUser = new User({
        email,
        password
    })
    await newUser.save();

    const savedUser = await User.findOne({ email: email });
    console.log('signup->', savedUser);

    const accestoken = jwt.sign({ isUser: savedUser }, process.env.ACCESS_TOKEN_SECREATE, {
        expiresIn: "36000m",
    })

    return res.json({
        error: false,
        user: savedUser,
        accestoken,
        message: "registered successfully",
    });
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    const isUser = await User.findOne({ email: email });

    if (!isUser) {
        return res.json({
            error: true,
            message: "User does not exist"
        })
    }

    if (isUser.password != password) {
        return res.json({
            error: true,
            message: "Uncorrect Password"
        })
    }
    console.log('login->', isUser);
    const accestoken = jwt.sign({ isUser }, process.env.ACCESS_TOKEN_SECREATE, {
        expiresIn: "36000m",
    })

    return res.json({
        error: false,
        email,
        accestoken,
        isUser,
        message: "login succesfully",
    });
});

app.post('/addtodo', authtoken, async (req, res) => {
    console.log("in");
    const { title, content, done } = req.body;

    try {
        const newTodo = new todo({
            title,
            content,
            done,
            userId: req.user.isUser._id
        });

        await newTodo.save();

        return res.json({
            error: false,
            todo: newTodo,
            message: "Todo added successfully"
        });
    } catch (error) {
        console.error("Error adding todo:", error);
        return res.status(500).json({
            error: true,
            message: "Failed to add todo",
            details: error.message
        });
    }
});
app.put('/edittodo/:todoId', authtoken, async (req, res) => {
    const todoId = req.params.todoId;
    const { title, content, done } = req.body;


    try {
        const pretodo = await todo.findById({ _id: todoId })
        pretodo.title = title;
        pretodo.content = content;
        pretodo.done = done;

        await pretodo.save();

        return res.json({
            error: false,
            todo: pretodo,
            message: "Todo edited successfully"
        });
    } catch (error) {
        console.error("Error editing todo:", error);
        return res.status(500).json({
            error: true,
            message: "Failed to edit todo",
            details: error.message
        });
    }

});
app.get('/usertodo', authtoken, async (req, res) => {
    let page=Number(req.query.page) || 1;
    let limit= 9;


    try {
        const skip=(page-1)*limit;
        const todos = await todo.find({ userId: req.user.isUser._id }).skip(skip)
        .limit(limit);
        const totalCount = await todo.countDocuments({ userId: req.user.isUser._id });
        const len= Math.ceil(totalCount/9);
        return res.json({
            error: false,
            todos,
            len,
            message: "found all user todos successfully"
        });
    } catch (error) {
        console.error("Error findg user todo:", error);
        return res.status(500).json({
            error: true,
            message: "Failed to found user todos",
            details: error.message
        });
    }

});
app.delete('/deletetodo/:todoId', authtoken, async (req, res) => {
    const todoId = req.params.todoId;

    try {
        await todo.deleteOne({ _id: todoId })

        return res.json({
            error: false,
            message: "Todo deleted successfully"
        });
    } catch (error) {
        console.error("Error deleting todo:", error);
        return res.status(500).json({
            error: true,
            message: "Failed to delete todo",
            details: error.message
        });
    }
});
app.get('/getuser', authtoken, async (req, res) => {

    try {
        const user = req.user.isUser
        if (!user) {
            return res.status(500).json({
                error: true,
                message: "user nahi mila to delete todo"
            });
        }
        return res.json({
            error: false,
            user,
            message: "user mil gaya successfully"
        });
    } catch (error) {
        console.error("Error find user:", error);
        return res.status(500).json({
            error: true,
            message: "user nahi mila to delete todo",
            details: error.message
        });
    }
});
app.get('/searchtodo', authtoken, async (req, res) => {
    const { user } = req.user;
    const { query } = req.query;
    let page=Number(req.query.page) || 1;
    let limit= 9;

    if (!query) {
        return res.status(400).json({ error: true, message: "search value require" })
    }
    try {
        const skip=(page-1)*limit;
        const filteredTodos = await todo.find({
            userId: req.user.isUser._id,
            title: { $regex: query, $options: 'i' }
        }).skip(skip)
        .limit(limit);;
        const len=filteredTodos.length;
        return res.json({
            error: false,
            todos: filteredTodos,
            len,
            message: "Matching todos found successfully lets goo"
        });
    } catch (error) {
        console.error("Error searching user todos:", error);
        return res.status(500).json({
            error: true,
            message: "Error occurred while searching todos",
            details: error.message
        });
    }

});
app.listen(8000);

module.exports = app;

