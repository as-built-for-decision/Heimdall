import { initializeApp } from "firebase/app";
import { getFunctions, connectFunctionsEmulator } from "firebase/functions";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getStorage, ref, listAll, getDownloadURL } from "firebase/storage";

const firebase = initializeApp({
	apiKey: process.env.NEXT_PUBLIC_FB_API_KEY,
	authDomain: process.env.NEXT_PUBLIC_FB_AUTH_DOM,
	projectId: process.env.NEXT_PUBLIC_FB_PROJ_ID,
	storageBucket: process.env.NEXT_PUBLIC_FB_STORAGE,
	messagingSenderId: process.env.NEXT_PUBLIC_FB_MESSAGE,
	appId: process.env.NEXT_PUBLIC_FB_APP_ID,
	measurementId: process.env.NEXT_PUBLIC_FB_MEASURE
})

const functions = getFunctions(firebase);
const firestore = getFirestore(firebase);
const storage = getStorage(firebase, "gs://ab4d-9af1a");

async function intoMemory(path, fileName) {
	// Downloads the file into a buffer in memory.
	const contents = await storage.bucket(path).file(fileName).download();
	// console.log(`Contents of gs://${bucketName}/${fileName} are ${contents.toString()}.`);
	return (contents)
}

// const listRef = ref(storage, 'pointcloudsV02/pointclouds');

// Find all the prefixes and items.
// listAll(listRef)
// 	.then((res) => {
// 		res.prefixes.forEach((folderRef) => {
// 			// All the prefixes under listRef.
// 			// You may call listAll() recursively on them.
// 			console.log("folder:", folderRef)
// 		});
// 		res.items.forEach((itemRef) => {
// 			// All the items underlistRef.
// 			console.log("item:", itemRef)
// 		});
// 	}).catch((error) => {
// 		// Uh-oh, an error occurred!
// 	});

// console.log(intoMemory("pointcloudsV02/pointclouds/2024PedrasSlam","octree.bin"))

// getDownloadURL(ref(storage, 'pointcloudsV02/pointclouds/2024PedrasSlam/octree.bin'))
// 	.then((url) => {
// 		// `url` is the download URL for 'images/stars.jpg'
// 		console.log(url)
// 		// This can be downloaded directly:
// 		// const xhr = new XMLHttpRequest();
// 		// xhr.responseType = 'blob';
// 		// xhr.onload = (event) => {
// 		// 	const blob = xhr.response;
// 		// };
// 		// xhr.open('GET', url);
// 		// xhr.send();

// 		// Or inserted into an <img> element
// 		// const img = document.getElementById('myimg');
// 		// img.setAttribute('src', url);
// 	})
// 	.catch((error) => {
// 		// Handle any errors
// 	});


console.log(process.env.NODE_ENV)
if (process.env.NODE_ENV === "development") {
	console.log(
		"Testing locally: hitting local functions and firestore emulators."
	);
	connectFunctionsEmulator(functions, "127.0.0.1", 5001);
	connectFirestoreEmulator(firestore, "127.0.0.1", 8080);
}

export { functions, firestore, firebase, storage, intoMemory };