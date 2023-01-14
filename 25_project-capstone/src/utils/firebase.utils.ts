// import the functions you need from the SDKs you need
// base code is automatically provided by firebase: click on new Web App in your firebase project
import { initializeApp } from 'firebase/app';
// firebase authentication
import { getAuth, signInWithRedirect, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
// firestore database
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';
import type { User } from 'firebase/auth';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// web app firebase configuration
const firebaseConfig = {
	apiKey: 'AIzaSyCmMgRsaQHWsS04PLbV94cflNEYmLaNE8c',
	authDomain: 'course-react-capstone.firebaseapp.com',
	projectId: 'course-react-capstone',
	storageBucket: 'course-react-capstone.appspot.com',
	messagingSenderId: '834738815137',
	appId: '1:834738815137:web:94773c3f6d12d9bfcaf0e0'
};

// initialize Firebase
const app = initializeApp(firebaseConfig);

// create connection to Google Authentication
// Google was allowed in firebase project -> Authentication -> Sign-in method -> Google -> Aktivieren
const provider = new GoogleAuthProvider();
provider.setCustomParameters({
	prompt: 'select_account'
});

export const auth = getAuth(); // authentication to and with firebase
export const signInWithGooglePopup = () => signInWithPopup(auth, provider); // connect Google and firebase authentication

export const db = getFirestore(); // connection to your database

export const createUserDocumentFromAuth = async (userAuth: User) => {
	// get a reference to a target document in your db
	const userDocRef = doc(db, 'users', userAuth.uid); // doc(<database>, <collection>, <unique identifier>)

	// get the document of a specific reference
	const userSnapshot = await getDoc(userDocRef);

	// if user data does NOT exist, create document
	if (!userSnapshot.exists()) {
		const { displayName, email } = userAuth;
		const createdAt = new Date();

		try {
			await setDoc(userDocRef, { displayName, email, createdAt });
		} catch (error: unknown) {
			console.log('error during creating the user', error);
		}
	}

	return userDocRef;
};
