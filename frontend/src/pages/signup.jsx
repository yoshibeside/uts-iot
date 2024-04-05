import { useState, useEffect} from "react"
import { Flex, Text, Button, Card, TextField, Box, Separator} from '@radix-ui/themes';
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify';

export function Signup() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [correct, setCorrect] = useState(false)

    useEffect(() => {
        if (password !== confirmPassword) {
            setCorrect(false)
        } if (password !== "" && password === confirmPassword) {
            setCorrect(true)
        }
    }
    , [confirmPassword])

    const checkEmailFormat = (email) => {
        const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/
        return regex.test(email)
    }

    const clickSubmit = async () => {
        try {
            if (checkEmailFormat(email) && password === confirmPassword && password !== "") {
                console.log("Email: ", email)
                console.log("Password", password)
                const response = await axios.post(
                    `${import.meta.env.VITE_BASE_URL}/signup`,
                    { email: email, password: password},
                );
                toast.success(response.data.message);
                setConfirmPassword('')
                setPassword('')
                setEmail('')
                setCorrect(false);
            } else {
                toast.warning("Please check your email and password")
            }
          } catch (error) {
            toast.info("Error: ", error.message);
            console.error('Error:', error);
          }
    }
        

    return (
        <>
        <ToastContainer />
        <main className="flex justify-center items-center h-screen">
            <Flex direction="column" gap="3">
            <Card>
                <Flex gap="3" direction={"column"} p="4">
                    <Text as="h1" className="flex justify-center" size="6" weight="bold">Sign Up</Text>
                    <Box width={"300px"}>
                        <Flex gap="1" direction={"column"}>
                            <Text size="2"><b>Email</b></Text><TextField.Root size="2" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                            <Text size="2"><b>Password</b></Text><TextField.Root className="hidden-text" size="2" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                            <Text size="2"><b>Confirm Password</b></Text>
                            <TextField.Root className="hidden-text" color={correct? "green" : "red"} size="2" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                        </Flex>
                    </Box>
                    
                    <Button onClick={clickSubmit} >Submit</Button>
                </Flex>
            </Card>

            <Flex direction="horizontal" gap="3">
                <Separator orientation="horizontal" size="4" />
                <Text>Or</Text>
                <Separator orientation="horizontal" size="4" />
            </Flex>
            <Flex justify={"center"}>
                <Text>Already have an account? <a href="/login">Sign In</a></Text>
            </Flex>
        </Flex>
    </main>
        </>
        
    )
}