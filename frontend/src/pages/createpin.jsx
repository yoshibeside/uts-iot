import { useState, useEffect} from "react"
import { Flex, Text, Button, Card, TextField, Box, Separator} from '@radix-ui/themes';
import {ToastContainer, toast} from 'react-toastify';
import axios from "axios"

export function Createpin() {
    const [pinConfirm, setPinConfirm] = useState('')
    const [pin, setPin] = useState('')
    const [pinConfirmCorrect, setPinConfirmCorrect] = useState(false)
    const [pinCorrect, setPinCorrect] = useState(false)

    const handleChange = (e) => {
        const re = /^\d{0,8}$/;
        const value = e.target.value
        if (value === '' || re.test(value)) {
            console.log(e.target.id)
            if (e.target.id === "pin") {
                setPin(value)
            }
            else {
                setPinConfirm(value)
            }
        }
    }
    
    useEffect(() => {
        if (pin.length < 6) {
            setPinCorrect(false)
        } else {
            setPinCorrect(true)
        }
    }, [pin])

    useEffect(() => {
        if (pin !== pinConfirm) {
            setPinConfirmCorrect(false)
        } if (pin !== "" && pin === pinConfirm) {
            setPinConfirmCorrect(true)
        }
    }
    , [pinConfirm])

    const clickSubmit = async () => {
        try {
            if (pin === pinConfirm && pin.length >= 6) {
                const response = await axios.post(
                    `${import.meta.env.VITE_BASE_URL}/createPin`,
                    {pin: pin},
                    {headers: { Bearer: `${localStorage.getItem("token")}` }}
                );
                toast.success(response.data.message);
                window.location.href = "/dashboard";
            } else {
                toast.warning("Put Pin from 6-8 digits")
            }
          } catch (error) {
            if (error.response.status === 401) {
                localStorage.removeItem("token");
                window.location.href = "/login";
            }
            toast.info("Error: ", error.message);
            console.error('Error:', error);
          }
    }

    return (
        <main className="flex justify-center items-center h-screen">
            <ToastContainer />
            <Flex direction="column" gap="3">
            <Card>
                <Flex gap="3" direction={"column"} p="4">
                    <Text as="h1" className="flex justify-center" size="6" weight="bold">Create Pin</Text>
                    <Box width={"300px"}>
                        <Flex gap="2" direction={"column"}>
                            <Flex direction={"column"}>
                            <Text size="2"><b>Pin</b></Text>
                            <Text color="gray" size="1">Enter a 6-8 pin number</Text>
                            <TextField.Root size="2" className="hidden-text" id="pin" placeholder="Pin" color={pinCorrect? "green":"red"} value={pin} onChange={(e) => handleChange(e)} />
                            </Flex>

                            <Flex direction={"column"}>
                            <Text size="2"><b>Confirm Pin</b></Text>
                            <Text color="gray" size="1">Re-enter your pin number</Text>
                            <TextField.Root className="hidden-text" id="pinConfirm" color={pinConfirmCorrect? "green":"red"} size="2" placeholder="Confirm Pin" value={pinConfirm} onChange={(e) => handleChange(e)} />
                            </Flex> 

                        </Flex>
                    </Box>
                    <Button onClick={clickSubmit}>Submit</Button>
                </Flex>
            </Card>
        </Flex>
    </main>
    )
}