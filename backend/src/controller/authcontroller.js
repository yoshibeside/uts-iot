
import FirebaseAll from "../database/firebaseall.js"
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import Token from "../utils/token.js";
import { getAuth } from "firebase/auth";
import {getFirestore, getDocs, addDoc, setDoc, collection, query, where, doc} from "firebase/firestore"
import crypto from "crypto"

class AuthController {
    
    login = async (req, res) => {
        try {
            const { username, password } = req.body
            const app = FirebaseAll.getApp()
            const auth = getAuth(app);
            const refFirestore = getFirestore(app)
            const q_user = query(collection(refFirestore, "users"), where("email", "==", username));

            signInWithEmailAndPassword(auth, username, password)
            .then((userCredential) => {
                // Signed in 
                getDocs(q_user).then((querySnapshot) => {
                    if (querySnapshot.size == 1) {
                        const user = {email: userCredential.user.email, uid: userCredential.user.uid}
                        if (querySnapshot.docs[0].data().pin === undefined) {
                            return res.status(200).json({ message: 'Login Success', token: Token.generateTokenAccess(userCredential.user), exists: false })
                        } else {
                            return res.status(200).json({ message: 'Login Success', token: Token.generateTokenAccess(userCredential.user), exists: true })
                        }
                    }
                })
              })
              .catch((error) => {
                const errorMessage = error.message;
                console.error(`Error: ${errorMessage}`)
                return res.status(401).json({ message: 'Wrong Password or Username' })
              });
        } catch (err) {
            console.error(`Error: ${err.message}`)
            return res.status(500).json({ message: 'Login Error' })
        }
    }

    signup = async (req, res) => {
        try {
            const { email, password } = req.body
            const app = FirebaseAll.getApp()
            const auth = getAuth(app);
            const refFirestore = getFirestore(app)
            const q_user = query(collection(refFirestore, `users`), where("email", "==", email));

            getDocs(q_user).then((querySnapshot) => {
                if (querySnapshot.size > 0) {
                    consol
                    return res.status(400).json({ message: 'Email already exists' })
                } else {
                    createUserWithEmailAndPassword(auth, email, password)
                    .then((userCredential) => {
                        // Signed in 
                        const user = {email: userCredential.user.email, uid: userCredential.user.uid}
                        addDoc(collection(refFirestore, "users"), {
                            email: email,
                            saldo: 197000
                        }).then(() => {
                            console.log("Document successfully written!");
                            return res.status(200).json({ message: 'Signup Success Please Login'})
                        })
                      })
                      .catch((error) => {
                        const errorMessage = error.message;
                        console.error(`Error: ${errorMessage}`)
                        return res.status(401).json({ message: 'Signup Error' })
                      });
                }
            })
        } catch (err) {
            console.error(`Error: ${err.message}`)
            return res.status(500).json({ message: 'Signup Error' })
        }
    }

    createPin = async (req, res) => {
        try {
            const hashPin = (pin) => {
                const hashedPin = crypto.createHash('sha256').update(pin).digest("hex")
                return hashedPin
            }
            const { pin } = req.body
            const payloadToken = Token.decodeToken(req)
            const app = FirebaseAll.getApp()
            const db = getFirestore(app)
            // Create a query to fetch the document with the specified email
            const q_user = query(collection(db, "users"), where('email', '==', payloadToken.user.email));

            // Execute the query to get the document snapshot
            getDocs(q_user).then((querySnapshot) => {
                // If there is exactly one document matching the query
                if (querySnapshot.size === 1) {
                    const docSnapshot = querySnapshot.docs[0]; // Get the document snapshot
                    const docRef = doc(db, 'users', docSnapshot.id); // Get a reference to the document
                    
                    // Update the document with the hashed PIN value
                    setDoc(docRef, { pin: hashPin(pin) }, { merge: true })
                        .then(() => {
                            console.log("Document successfully written!");
                            res.status(200).json({ message: 'Pin Created' });
                        })
                        .catch((error) => {
                            console.error(`Error: ${error.message}`);
                            res.status(401).json({ message: 'Pin Error' });
                        });
                } else {
                    console.error("No document found or multiple documents found!");
                    res.status(404).json({ message: 'User not found' });
                }
            })
            .catch((error) => {
                console.error(`Error: ${error.message}`);
                res.status(500).json({ message: 'Internal Server Error' });
            });
        } catch (err) {
            console.error(`Error: ${err.message}`)
            return res.status(500).json({ message: 'Pin Error' })
        }
    }

    checkPin = async (req, res) => {
        try {
            const hashPin = (pin) => {
                const hashedPin = crypto.createHash('sha256').update(pin).digest("hex")
                return hashedPin
            }
            const { pin } = req.body
            const payloadToken = Token.decodeToken(req)
            const app = FirebaseAll.getApp()
            const db = getFirestore(app)
            // Create a query to fetch the document with the specified email
            const q_user = query(collection(db, "users"), where('email', '==', payloadToken.user.email));

            // Execute the query to get the document snapshot
            getDocs(q_user).then((querySnapshot) => {
                // If there is exactly one document matching the query
                if (querySnapshot.size === 1) {
                    const docSnapshot = querySnapshot.docs[0]; // Get the document snapshot
                    const docRef = doc(db, 'users', docSnapshot.id); // Get a reference to the document
                    const user = docSnapshot.data()
                    if (user.pin === hashPin(pin)) {
                        res.status(200).json({ message: 'Pin is correct', checker: true });
                    } else {
                        res.status(200).json({ message: 'Pin is incorrect', checker: false });
                    }
                } else {
                    console.error("No document found or multiple documents found!");
                    res.status(404).json({ message: 'User not found' });
                }
            })
            .catch((error) => {
                console.error(`Error: ${error.message}`);
                res.status(500).json({ message: 'Internal Server Error' });
            });
        } catch (err) {
            console.error(`Error: ${err.message}`)
            return res.status(500).json({ message: 'Pin Check Fail' })
        }
    }
}

export default new AuthController();