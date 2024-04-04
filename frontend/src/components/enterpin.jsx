import { Flex, Text, Button, Card, TextField, Box, Grid} from '@radix-ui/themes';

export function Enterpin({onClickEnter, tryAmounts, handleChange, pin, onClickOutside}) {

    return (
            <Grid columns="3" rows="3" height="100vh">
                <Text onClick={onClickOutside} className="col-span-3"></Text>
                <Text onClick={onClickOutside}></Text>
                    <Flex className="" justify="center" align="center">
                        <Card variant='classic'>
                            <Flex gap="3" direction={"column"} p="4">
                                <Text as="h1" className="flex justify-center" size="6" weight="bold">Enter Pin</Text>
                                <Box width={"300px"}>
                                    <Flex gap="2" direction={"column"}>
                                        <Flex direction={"column"}>
                                        <TextField.Root size="2" className="hidden-text" id="enterpin" placeholder="Pin" value={pin} onChange={(e) => handleChange(e)} />
                                        </Flex>
                                    </Flex>
                                </Box>
                                <Button onClick={onClickEnter}>Submit</Button>
                            </Flex>
                        </Card>
                    </Flex>
                <Text onClick={onClickOutside}></Text>
                <Text onClick={onClickOutside} className="col-span-3"></Text>
            </Grid>
    )
}

