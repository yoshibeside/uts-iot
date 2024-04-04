import { useState, useEffect, useRef} from "react"
import { Flex, Text, Button, Card, TextField, Box, Tabs} from '@radix-ui/themes';
import { Enterpin } from "../components/enterpin";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import moment from 'moment'

export function Dashboard() {
    const [saldo, setSaldo] = useState('')
    const [tambahSaldo, setTambahSaldo] = useState('')
    const [showModal, setShowModal] = useState(false)
    const [pin, setPin] = useState('')
    const [tryAmount, setTryAmount] = useState(0)
    const [historyTransaksi, setHistoryTransaksi] = useState([])
    const [notif, setNotif] = useState(null)
    const [showPayment, setshowPayment] = useState(false)

    const socket = useRef(null);

    useEffect(() => {
        socket.current = new WebSocket(`${import.meta.env.VITE_WS_URL}`);
  
        socket.current.onopen = () => {
        console.log('WebSocket connection opened');
        };

        // Handle WebSocket messages
        socket.current.onmessage = (event) => {
            setNotif({
                timestamp: new Date()
            })
            const newMessage = event.data;
            console.log(newMessage);
        };

        // Handle WebSocket errors
        socket.current.onerror = (error) => {
        console.error('WebSocket error:', error);
        };

        // Handle WebSocket connection closed
        socket.current.onclose = () => {
        console.log('WebSocket connection closed');
        };

        // Clean up WebSocket connection on component unmount
        return () => {
        socket.current.close();
        };
    }, []);

    const sendMessage = (message) => {
        console.log(socket.current.readyState)
        if (socket.current.readyState === WebSocket.OPEN) {
          socket.current.send(message);
        }
    };

    const fetchData = async () => {
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_BASE_URL}/saldo`,
                { headers: { Bearer: `${localStorage.getItem("token")}` } }
            );
            setSaldo(response.data.saldo)
        } catch (error) {
            console.error('Error:', error);
            toast.error("Error: ", error.message);
            if (error.response.status === 401) {
                window.location.href = "/login";
            }
        }
    }

    useEffect(() => {
        fetchData()
        getHistoryTransaksi()
    }, [])

    function formattedTime(date) {
        return moment(date).format('MMMM Do YYYY, h:mm:ss a')
    }

    function addCommasToNumber(string) {
        return string.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    function removeCommasToNumber(string) {
        return string.replace(/,/g, "");
    }

    const handleChange = (e) => {
        const re = /^[0-9]+$/   ;
        const value = removeCommasToNumber(e.target.value)
        if (value === '' || re.test(value)) {
            if (e.target.id === "topupAmount") {
                setTambahSaldo(addCommasToNumber(value))
            } else if (e.target.id === "enterpin") {
                setPin(value)
            }
        }
    }

    const handleClickOutside = () => {
        setShowModal(false)
    }

    const handleSubmit = () => {
        if (tambahSaldo !== "") {
            setShowModal(true)
        }
    }

    const getHistoryTransaksi = async () => {
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_BASE_URL}/transactions`,
                { headers: { Bearer: `${localStorage.getItem("token")}` }
            });
            setHistoryTransaksi(response.data.transactions)
        }
        catch (error) {
            console.error('Error:', error);
            toast.error("Error: ", error.message);
        }
    }


    const addSaldo = async () => {
        const response = await axios.post(
            `${import.meta.env.VITE_BASE_URL}/addSaldo`,
            { saldo: parseInt(removeCommasToNumber(tambahSaldo)) },
            { headers: { Bearer: `${localStorage.getItem("token")}` }
        });
        toast.success(response.data.message);
        setShowModal(false)
        setTambahSaldo('')
        setTryAmount(0)

        const responseSaldo = await axios.get(
            `${import.meta.env.VITE_BASE_URL}/saldo`,
            { headers: { Bearer: `${localStorage.getItem("token")}` } }
        );
        setSaldo(responseSaldo.data.saldo)
        getHistoryTransaksi()
    }

    const acceptPayment = () => {
        setshowPayment(true);
    }

    const cancelPayment = () => {
        console.log("lewat cancel kok?")
        setshowPayment(false);
        toast.success("Payment Canceled");
        sendMessage("gagal")
        setNotif(null)
    }

    const kurangSaldo = async () => {
        const response = await axios.post(
            `${import.meta.env.VITE_BASE_URL}/kurangsaldo`,{},
            { headers: {Bearer: `${localStorage.getItem("token")}`}
        });
        if (response.data.success) {
            toast.success(response.data.message)
            getHistoryTransaksi()
            sendMessage("berhasil")
            setPin('')
            setTryAmount(0)
            fetchData()
        } else {
            toast.error(response.data.message)
            sendMessage("kurang")
        }
        setNotif(null)
    }

    const handleKurangSaldo = async () => {
        try {
            setshowPayment(false)
            const response = await axios.post(
                `${import.meta.env.VITE_BASE_URL}/checkPin`,
                { pin: pin },
                { headers: { Bearer: `${localStorage.getItem("token")}` }
            });
            if (response.data.checker) {
                kurangSaldo()
            } else {
                toast.warning("Pin is incorrect. Tries left: " + (2 - tryAmount).toString())
                setTryAmount(tryAmount + 1)
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error("Error: ", error.message);
        }
    }

    const handleAddSaldo = async () => {
        try {
            setShowModal(false)
            setTambahSaldo('')
            const response = await axios.post(
                `${import.meta.env.VITE_BASE_URL}/checkPin`,
                { pin: pin },
                { headers: { Bearer: `${localStorage.getItem("token")}` }
            });
            if (response.data.checker) {
                addSaldo()
            }
            else {
                toast.warning("Pin is incorrect. Tries left: " + (2 - tryAmount).toString())
                setTryAmount(tryAmount + 1)
            }
            setPin('')
            if (tryAmount === 3) {
                setTryAmount(0)
                toast.error("You have tried too many times. Please try again later.")
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error("Error: ", error.message);
        }
    }

    const logout = () => {
        localStorage.removeItem("token")
        window.location.href = "/login";
    }

    return (
        <main className="">
            <ToastContainer />
            <Flex direction="column" className="" gap="3">
                <Flex direction="horizontal" justify="between" className="m-6">
                    <Text as="h1" size="8" weight="bold">Dashboard</Text>
                    <button onClick={logout}className="bg-transparent">
                        <svg className="fill-blue-500" xmlns="http://www.w3.org/2000/svg" height="35" viewBox="0 -960 960 960" width="35"><path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h280v80H200Zm440-160-55-58 102-102H360v-80h327L585-622l55-58 200 200-200 200Z"/></svg>
                    </button>
                </Flex>
                <Card className="mx-6">
                    <svg xmlns="http://www.w3.org/2000/svg" className="fill-blue-500" height="35" viewBox="0 -960 960 960" width="35"><path d="M200-200v-560 560Zm0 80q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v100h-80v-100H200v560h560v-100h80v100q0 33-23.5 56.5T760-120H200Zm320-160q-33 0-56.5-23.5T440-360v-240q0-33 23.5-56.5T520-680h280q33 0 56.5 23.5T880-600v240q0 33-23.5 56.5T800-280H520Zm280-80v-240H520v240h280Zm-160-60q25 0 42.5-17.5T700-480q0-25-17.5-42.5T640-540q-25 0-42.5 17.5T580-480q0 25 17.5 42.5T640-420Z"/></svg>
                    <Text as="h1" className="flex justify-center" size="6" weight="bold">Rp {saldo !== ''? addCommasToNumber(saldo.toString()): "SALDO"}</Text>
                </Card>

                <Tabs.Root defaultValue="topup" className="mx-6">
                    <Tabs.List>
                        <Tabs.Trigger value="topup">Top Up Balance</Tabs.Trigger>
                        <Tabs.Trigger value="transaksi">Transaction History</Tabs.Trigger>
                        <Tabs.Trigger value="notifikasi">Notifikasi</Tabs.Trigger>
                        <Tabs.Trigger value="settings">Settings</Tabs.Trigger>
                    </Tabs.List>

                    <Box pt="3">
                        <Tabs.Content value="topup">
                            <div className="flex justify-center">
                                <Card >
                                    <Flex gap="3" direction={"column"} p="4">
                                    
                                        <Box width={"300px"}>
                                            <Flex gap="2" direction={"column"}>
                                                <Text size="2"><b>Top Up Amount</b></Text>
                                                <TextField.Root size="2" id="topupAmount" placeholder="Rp" value={tambahSaldo} onChange={(e) => handleChange(e)} />
                                            </Flex>
                                        </Box>
                
                                        <Button onClick={handleSubmit}>Submit</Button>
                                    </Flex>
                                </Card>
                            </div>
                        </Tabs.Content>

                        <Tabs.Content value="transaksi">
                            <Flex direction={"column"} gapY={"3"}>
                            {
                                historyTransaksi.length === 0 ? <Text size="2">No transaction history</Text> :
                                historyTransaksi.map((transaksi, index) => {
                                    return (
                                        <Card key={index}>
                                            <Flex direction={"horizontal"} justify={"between"}>
                                                <Text size="2">{formattedTime(transaksi.timestamp)}</Text>
                                                    <Text size="2" color={transaksi.type ==="tambah"? "green":"red"}>{transaksi.type === "tambah" ? "+" : "-"} Rp{addCommasToNumber(transaksi.amount.toString())}</Text>
                                                    <Text size="2">End Balance: Rp {addCommasToNumber((transaksi.saldoAkhir.toString()))}</Text>
                                            </Flex>
                                        </Card>
                                    )
                            })
                            }
                            </Flex>
                            
                        </Tabs.Content>

                        <Tabs.Content value="settings">
                        <Text size="2">Edit your profile or update contact information.</Text>
                        </Tabs.Content>

                        <Tabs.Content value="notifikasi">
                            {notif === null ? <Text size="2">No notifications</Text> : 
                            <Card key={"temp"}>
                                <Flex direction={"horizontal"} justify={"between"}>
                                    <Text size="2">{formattedTime(notif.timestamp)}</Text>
                                    <Text size="2">Nominal: Rp{addCommasToNumber("20000")}</Text>
                                    <Flex direction={"horizontal"} gap="2" justify={"center"}>
                                        <Button onClick={acceptPayment} className="bg-green-500">Accept</Button>
                                        <Button onClick={cancelPayment} className="bg-red-500">Decline</Button>
                                    </Flex>
                                </Flex>
                            </Card>}
                        </Tabs.Content>
                    </Box>
                </Tabs.Root>
            </Flex>

            <div id="default-modal" className={`${showModal? "fixed": "hidden"} bg-gray-800 bg-opacity-80 overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0`}>
                <Enterpin
                    onClickEnter={handleAddSaldo}
                    tryAmounts={tryAmount}
                    handleChange={handleChange}
                    pin={pin}
                    onClickOutside={handleClickOutside}
                />
            </div>

            <div id="reduced-model" className={`${showPayment? "fixed": "hidden"} bg-gray-800 bg-opacity-80 overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0`}>
                <Enterpin
                    onClickEnter={handleKurangSaldo}
                    tryAmounts={tryAmount}
                    handleChange={handleChange}
                    pin={pin}
                    onClickOutside={cancelPayment}
                />
            </div>
    </main>
    )
}