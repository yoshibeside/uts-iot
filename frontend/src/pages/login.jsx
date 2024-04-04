import { useState } from "react"
import { Flex, Text, Button, Card, TextField, Box, Separator } from '@radix-ui/themes';
import { ToastContainer, toast } from 'react-toastify';
import axios from "axios"

export function Login() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const clickSubmit = async () => {
        try {
            if (username !== "" && password !== "") {
                const response = await axios.post(
                    `${import.meta.env.VITE_BASE_URL}/login`,
                    { username: username, password: password },
                );
                toast.success(response.data.message);
                localStorage.setItem("token", response.data.token);
                if (response.data.exists === false) {
                    window.location.href = "/createpin"
                } else {
                    window.location.href = "/dashboard";
                }
            } else {
                toast.warning("Please check your email and password")
            }
        } catch (error) {
            if (error.response.status === 401) {
                toast.error("Wrong Password or Username")
            } else {
                toast.info("Error: ", error.message);
                console.error('Error:', error);
            }
        }
    }
            
    return (
        <>
        <div className="fixed">
        <ToastContainer />
        </div>
        
        <main className="flex justify-center items-center h-screen">
        
            <Flex direction="column" gap="3">
            <Card>
                <Flex gap="3" direction={"column"} p="4">
                    <Text as="h1" size="6" weight="bold">Login</Text>
                    <Box width={"300px"}>
                        <Flex gap="1" direction={"column"}>
                            <TextField.Root size="2" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
                            <TextField.Root className="hidden-text" size="2" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                        </Flex>
                    </Box>
                    
                    <Button onClick={clickSubmit}>Submit</Button>
                </Flex>
            </Card>

            <Flex direction="horizontal" gap="3">
                <Separator orientation="horizontal" size="4" />
                <Text>Or</Text>
                <Separator orientation="horizontal" size="4" />
            </Flex>
            <Flex justify={"center"}>
                <Text>Don't have an account? <a href="/signup">Sign up</a></Text>
            </Flex>
        </Flex>
        </main>
        </>
        
    )
}