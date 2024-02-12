const express = require("express");
const axios = require("axios");

//
// Starts the microservice.
//
async function startMicroservice(port) {
    // Creates an instance of the Express Web Server.
    const app = express();

    // Registers a HTTP GET route for video streaming.
    app.get("/video", async (req, res) => { // Route for streaming video.

        const videoId = req.query.id;
        const response = await axios({ // Forwards the request to the video-storage microservice.
            method: "GET",
            url: `http://video-storage/video?id=${videoId}`, 
            data: req, 
            responseType: "stream",
        });
        response.data.pipe(res);
    });

    // Starts the HTTP server.
    app.listen(port, () => {
        console.log(`Microservice online.`);
    });
}

//
// Application entry point.
//
async function main() {
    // Throws an error if the PORT environment variable is missing.
    if (!process.env.PORT) {
        throw new Error("Please specify the port number for the HTTP server with the environment variable PORT.");
    }

    // Extracts the PORT environment variable.
    const PORT = process.env.PORT;

    // Starts the microservice
    await startMicroservice(PORT);
}

//
// Run microservice normally or under test.
//
if (require.main === module) {
    // Only start the microservice normally if this script is the "main" module.
    main()
        .catch(err => {
            console.error("Microservice failed to start.");
            console.error(err && err.stack || err);
        });
}
else {
    // Otherwise we are running under test
    module.exports = {
        startMicroservice
    };
}