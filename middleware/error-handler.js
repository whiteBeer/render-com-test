const { CustomAPIError } = require("../errors");
const { StatusCodes } = require("http-status-codes");

const errorHandlerMiddleware = (err, req, res, next) => {
    if (err instanceof CustomAPIError) {
        return res.status(err.statusCode).json({ msg: err.message });
    }

    console.log("Unhandled error", err);

    return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .send("Something went wrong try again later");
};

module.exports = errorHandlerMiddleware;
