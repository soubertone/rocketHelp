import {Alert} from "react-native";
import {VStack} from 'native-base';

import firestore from "@react-native-firebase/firestore";

import {Header} from "../components/Header";
import Button from "../components/Button";
import Input from "../components/Input";

import { useState } from "react";
import { useNavigation } from "@react-navigation/native"

export function Register() {
    const [isLoading, setIsLoading] = useState(false);
    const [patrimony, setPatrimony] = useState('');
    const [description, setDescription] = useState('');

    const navigation = useNavigation();

    function handleNewOrderRegister () {
        if (!patrimony || !description) {
            return Alert.alert("Solicitação", "Preencha todos os campos");
        }

        setIsLoading(true);
        firestore()
            .collection("orders")
            .add({
                patrimony,
                description,
                status: 'open',
                created_at: firestore.FieldValue.serverTimestamp(),
            })
            .then(() => {
                Alert.alert("Solicitação", "Solicitação registrada com sucesso");
                navigation.goBack();
            })
            .catch((error) => {
                console.log(error);
                setIsLoading(false);
                return Alert.alert("Solicitação", "Não foi possivel registrar solicitação");
            })
    }

    return (
        <VStack flex={1} p={6} bg='gray.600'>
            <Header title='Nova Solicitação' ml={-4} />
            <Input
                placeholder='Titulo do problema'
                mt={4}
                value={patrimony}
                onChangeText={setPatrimony}
            />

            <Input
                placeholder='Descrição do problema'
                mt={5}
                flex={1}
                multiline
                textAlignVertical='top'
                value={description}
                onChangeText={setDescription}
            />

            <Button
                title='Cadastrar'
                mt={5}
                isLoading={isLoading}
                onPress={handleNewOrderRegister}
            />
        </VStack>
    )
}
