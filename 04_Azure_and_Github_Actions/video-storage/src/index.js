const express = require("express");
const { BlobServiceClient, StorageSharedKeyCredential } = require("@azure/storage-blob");

//
// Starts the microservice.
//
async function startMicroservice(port, createBlobService, STORAGE_CONTAINER_NAME) {
    
    // Creates an instance of the Express Web Server.
    const app = express();

    //
    // Registers a HTTP GET route to retrieve videos from storage.
    //
    app.get("/video", async (req, res) => {

        const videoId = req.query.id;

        const blobService = createBlobService();
        const containerClient = blobService.getContainerClient(STORAGE_CONTAINER_NAME);
        const blobClient = containerClient.getBlobClient(videoId);
        const properties = await blobClient.getProperties();

        //
        // Writes HTTP headers to the response.
        //
        res.writeHead(200, {
            "Content-Length": properties.contentLength,
            "Content-Type": "video/mp4",
        });

        const response = await blobClient.download();
        response.readableStreamBody.pipe(res);
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
    
    // Throws an error if the STORAGE_ACCOUNT_NAME environment variable is missing.
    if (!process.env.STORAGE_ACCOUNT_NAME) {
        throw new Error("Please specify the name of an Azure storage account in environment variable STORAGE_ACCOUNT_NAME.");
    }
    
    // Throws an error if the STORAGE_ACCESS_KEY environment variable is missing.
    if (!process.env.STORAGE_ACCESS_KEY) {
        throw new Error("Please specify the access key to an Azure storage account in environment variable STORAGE_ACCESS_KEY.");
    }

    // Extracts the PORT, STORAGE_ACCOUNT_NAME and STORAGE_ACCESS_KEY environment variables.
    const PORT = process.env.PORT;
    const STORAGE_ACCOUNT_NAME = process.env.STORAGE_ACCOUNT_NAME;
    const STORAGE_ACCESS_KEY = process.env.STORAGE_ACCESS_KEY;
    const STORAGE_CONTAINER_NAME = "videos"; // Also sets the Storage Container to use.

    console.log(`Serving videos from Azure storage account ${STORAGE_ACCOUNT_NAME}/${STORAGE_CONTAINER_NAME}.`);

    //
    // Function that creates and returns a Blob service instance to communicate with Azure storage.
    //
    function createBlobService() {
        const sharedKeyCredential = new StorageSharedKeyCredential(STORAGE_ACCOUNT_NAME, STORAGE_ACCESS_KEY);
        const blobService = new BlobServiceClient(
            `https://${STORAGE_ACCOUNT_NAME}.blob.core.windows.net`,
            sharedKeyCredential
        );
        return blobService;
    }

    // Starts the microservice
    await startMicroservice(PORT, createBlobService, STORAGE_CONTAINER_NAME);
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