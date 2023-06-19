import { VStack, Heading, Icon, useTheme } from "native-base";
import Logo from "../assets/logo_primary.svg";
import Input from "../components/Input";
import { Envelope, Key } from "phosphor-react-native";
import Button from "../components/Button";
import {useState} from "react";

export default function SignIn() {
    const [name, setName] = useState();
    const [password, setPassword] = useState();

    const { colors } = useTheme();

    return (
        <VStack flex={1} alignItems="center" bg="gray.600" px={6} pt={24}>
            <Logo />

            <Heading color="gray.200" fontSize="xl" mt={20} mb={6}>
                Acesse sua conta {name}
            </Heading>

            <Input
                placeholder="E-mail"
                mb={4}
                InputLeftElement={<Icon as={ <Envelope color={colors.gray[300]} />} ml={4} />}
                onChangeText={setName}
            />
            <Input
                mb={8}
                placeholder="Senha"
                InputLeftElement={<Icon as={ <Key color={colors.gray[300]} />} ml={4} />}
                secureTextEntry
                onChangeText={setPassword}
            />

            <Button
                title="Entrar"
                w="full"
            />
        </VStack>
    )
}