const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const cors = require('cors');

const { PORT, MONGODB_URI, NODE_ENV, ORIGIN } = require('./config');
const { API_ENDPOINT_NOT_FOUND_ERR, SERVER_ERR } = require('./errors');
const authRoutes = require('./routes/auth.route');

dotenv.config();
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json()); // Parse JSON
app.use(
    cors({
        credentials: true,
        origin: ORIGIN,
        optionsSuccessStatus: 200,
    })
);

// Login
if (NODE_ENV === "development") {
    const morgan = require('morgan');
    app.use(morgan("dev"));
}

app.get("/", (req, res) => {
    res.status(200).json({
        type: "Success",
        message: "Server is Up and Running",
        data: null
    });
});

// Route Middlwares
app.use("/api/auth", authRoutes);
app.use("*", (req, res, next) => {
    const error = {
        status: 404,
        message: API_ENDPOINT_NOT_FOUND_ERR,
    };
    next(error);
});

app.use((err, req, res, next) => {
    console.log(err);
    const status = err.status || 500;
    const message = err.message || SERVER_ERR;
    const data = err.data || null;

    res.status(status).json({
        type: "error",
        message,
        data,
    });
});

async function main() {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true
        });
        console.log("Database Connected");
        app.listen(process.env.PORT || 8000, () => console.log(`Server listening on PORT ${process.env.PORT}`));
    } catch (err) {
        console.log(err);
        process.exit(1);
    }
};

main();