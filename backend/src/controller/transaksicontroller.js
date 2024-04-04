
import FirebaseAll from "../database/firebaseall.js"
import Token from "../utils/token.js";
import {getFirestore, getDocs, addDoc, setDoc, collection, query, where, Timestamp} from "firebase/firestore"

class TransaksiController {

    addSaldo = async (req, res) => {
        try {
            const { saldo } = req.body
            const app = FirebaseAll.getApp()
            const refFirestore = getFirestore(app)
            const payloadToken = Token.decodeToken(req)
            const q_user = query(collection(refFirestore, `users`), where("email", "==", payloadToken.user.email));

            getDocs(q_user).then((querySnapshot) => {
                if (querySnapshot.size > 0) {
                    querySnapshot.forEach((doc) => {
                        const user = doc.data()
                        const newSaldo = user.saldo + saldo

                        const transactionsRef = collection(doc.ref, 'transactions');

                        // Create a new transaction document within the 'transactions' subcollection
                        addDoc(transactionsRef, {
                            amount: saldo, 
                            timestamp: new Date(), 
                            saldoAkhir: newSaldo,
                            type: "tambah"
                        }).then(() => {
                            setDoc(doc.ref, {saldo: newSaldo}, { merge: true }).then(() => {
                                return res.status(200).json({ message: 'Saldo added' })
                            }).catch((error) => {
                                console.error(`Error: ${error.message}`)
                                return res.status(500).json({ message: 'Saldo Update Error' })
                            })
                        })
                        console.log("Document successfully written!");
                    })
                } else {
                    return res.status(400).json({ message: 'User not found' })
                }
            })
        } catch (err) {
            console.error(`Error: ${err.message}`)
            return res.status(500).json({ message: 'Signup Error' })
        }
    }

    getSaldo = async (req, res) => {
        try {
            const app = FirebaseAll.getApp()
            const refFirestore = getFirestore(app)
            const payloadToken = Token.decodeToken(req)
            const q_user = query(collection(refFirestore, `users`), where("email", "==", payloadToken.user.email));

            getDocs(q_user).then((querySnapshot) => {
                if (querySnapshot.size > 0) {
                    querySnapshot.forEach((doc) => {
                        const user = doc.data()
                        return res.status(200).json({ saldo: user.saldo })
                    })
                } else {
                    return res.status(400).json({ message: 'User not found' })
                }
            })
        } catch (err) {
            console.error(`Error: ${err.message}`)
            return res.status(500).json({ message: 'Saldo Retrievel Fail' })
        }
    }

    getTransactions = async (req, res) => {
        const timeObj = new Timestamp();
        try {
            const app = FirebaseAll.getApp()
            const refFirestore = getFirestore(app)
            const payloadToken = Token.decodeToken(req)
            const q_user = query(collection(refFirestore, `users`), where("email", "==", payloadToken.user.email));

            getDocs(q_user).then((querySnapshot) => {
                if (querySnapshot.size > 0) {
                    querySnapshot.forEach((doc) => {
                        const user = doc.data()
                        const transactionsRef = collection(doc.ref, 'transactions');
                        getDocs(transactionsRef).then((transactionsSnapshot) => {
                            const transactions = []
                            transactionsSnapshot.forEach((transaction) => {
                                transaction.data().timestamp = transaction.data().timestamp.toDate()
                                var replace = transaction.data()
                                replace.timestamp = replace.timestamp.toDate();
                                transactions.push(replace)
                            })
                            return res.status(200).json({ transactions: transactions })
                        })
                    })
                } else {
                    return res.status(400).json({ message: 'User not found' })
                }
            })
        } catch (err) {
            console.error(`Error: ${err.message}`)
            return res.status(500).json({ message: 'Transaction Retrievel Fail' })
        }
    }
}

export default new TransaksiController();