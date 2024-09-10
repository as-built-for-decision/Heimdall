/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const { onRequest } = require("firebase-functions/v2/https");
// const { Storage } = require("@google-cloud/storage");
const { getStorage } = require("firebase-admin/storage");
const admin = require('firebase-admin');
const axios = require('axios')

const app = admin.initializeApp({
	apiKey: process.env.FB_API_KEY,
	authDomain: process.env.FB_AUTH_DOM,
	projectId: process.env.FB_PROJ_ID,
	storageBucket: process.env.FB_STORAGE,
	messagingSenderId: process.env.FB_MESSAGE,
	appId: process.env.FB_APP_ID,
	measurementId: process.env.FB_MEASURE,
});

const storage = getStorage(app)

// async function octreeBucket() {
// 	return getStorage(app).bucket("gs://ab4d-9af1a")
// }

// octreeBucket().then(bucketRef => {
// 	console.log()
// })

async function downloadIntoMemory(path, fileName) {
	// Downloads the file into a buffer in memory.
	const contents = await storage.bucket(`gs://ab4d-9af1a/${path}`).file(fileName).download();
	// console.log(`Contents of gs://${bucketName}/${fileName} are ${contents.toString()}.`);
	return (contents)
}

// downloadIntoMemory("pointcloudsV02/pointclouds/2024Pedras/2024Pedras00000_0,08156197518110275_2,2479958534240723_1,2305452823638916/", "octree.bin").then(data => {
// 	console.log(data)
// })
// const storage = new Storage({
// 	projectId: "importjson-235820",
// 	keyFilename: "gcloudkey.json",
// });
// const bucketName = "local-pointclouds";
// // local-pointclouds/pointcloudsV02/pointcloudsV02/pointclouds/2024PedrasSlam
// async function getPointCloudURL(fileName) {
// 	const filePath = `pointcloudsV02/pointcloudsV02/pointclouds/2024Pedras/${fileName}`;

// 	const file = storage.bucket(bucketName).file(filePath);
// 	const [exists] = await file.exists();

// 	if (!exists) {
// 		throw new Error("File not found");
// 	}

// 	const [url] = await file.getSignedUrl({
// 		action: "read",
// 		expires: Date.now() + 1000 * 60 * 60, // 1 hour
// 	});

// 	return url;
// }

exports.octree = onRequest({ cors: true, timeoutSeconds: 90 }, async (req, res) => {
	const { fileName } = req.body.data;
	console.log(fileName)
	const content = await getStorage(app).bucket("gs://ab4d-9af1a").file(`pointcloudsV02/pointclouds/2024Pedras_guid/processed/${fileName}`).download()
	res.send({ data: content.toString("base64") })
	return content
})

exports.api = onRequest({ cors: true, timeoutSeconds: 30 }, async (req, res) => {


	const { fileName } = req.body.data;

	if (!fileName) {
		return res.status(400).send("File name is required");
	}

	try {
		const url = await getPointCloudURL(fileName);
		const response = await axios.get(url, { responseType: "arraybuffer" });

		res.set("Content-Type", response.headers["content-type"]);
		res.send(response.data);
	} catch (error) {
		console.error("Error fetching file from Google Cloud Storage:", error);
		res.status(500).send("Error fetching file");
	}
});
