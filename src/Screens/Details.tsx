import {HStack, Text, VStack, useTheme, ScrollView, Box} from 'native-base';
import {Header} from "../components/Header";
import {OrderProps} from "../components/Order";
import Loading from "../components/Loading";
import Button from "../components/Button";
import Input from "../components/Input";
import {CardDetails} from "../components/CardDetails";
import {CircleWavyCheck, Hourglass, DesktopTower, ClipboardText} from 'phosphor-react-native';

import { useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";
import firestore from "@react-native-firebase/firestore";
import {OrderFirestoreDTO} from "../DTOs/OrderFirestoreDTO";
import {dateFormat} from "../utils/firestoreDateFormat";
import {Alert} from "react-native";
import { useNavigation } from "@react-navigation/native";

type RouteParams = {
    orderId: string
};

type OrderDetails = OrderProps & {
    description: string,
    solution: string,
    closed: string
}

export function Details() {
    const [order, setOrder] = useState<OrderDetails>({} as OrderDetails);
    const [solution, setSolution] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    const { colors } = useTheme();
    const navigation = useNavigation();

    const route = useRoute();
    const { orderId } = route.params as RouteParams;

    function handleOrderClose() {
        if (!solution) {
            return Alert.alert("Solicitação", "Informe a solução para encerrar a solicitação");
        }

        firestore()
            .collection("orders")
            .doc(orderId)
            .update({
                status: 'closed',
                solution,
                closed_at: firestore.FieldValue.serverTimestamp()
            })
            .then(() => {
                Alert.alert("Solicitação", "Solicitação encerrada");
                navigation.goBack();
            })
            .catch((error) => {
                console.log(error);
                Alert.alert("Solicitação", "Não foi possível encerrar a solicitação");
            })
    }

    useEffect(() => {
        firestore()
            .collection<OrderFirestoreDTO>("orders")
            .doc(orderId)
            .onSnapshot((doc) => {
                const { patrimony, description, status, created_at, closed_at, solution } = doc.data();
                const closed = closed_at ? dateFormat(closed_at) : null;

                setOrder({
                    id: doc.id,
                    patrimony,
                    description,
                    solution,
                    status,
                    when: dateFormat(created_at),
                    closed
                });
                setIsLoading(false);
            })
    }, []);


    if (isLoading) {
        return <Loading />
    }

    return (
        <VStack flex={1} bg='gray.700'>
            <Box p={6} bg='gray.600'>
                <Header title='Solicitação' ml={-4} />
            </Box>

            <HStack bg='gray.500' justifyContent='center' p={4}>
                {
                    order.status === 'closed'
                        ? <CircleWavyCheck size={22} color={colors.green[300]} />
                        : <Hourglass size={22} color={colors.secondary[700]} />
                }

                <Text
                    fontSize='sm'
                    color={order.status === 'closed' ? colors.green[300] : colors.secondary[700]}
                    ml={2}
                    textTransform='uppercase'
                >
                    {
                        order.status === 'closed' ? 'finalizado' : 'em andamento'
                    }
                </Text>
            </HStack>

            <ScrollView mx={5} showsVerticalScrollIndicator={false}>
                <CardDetails
                    title='Equipamento'
                    description={`Patrimônio ${order.patrimony}`}
                    icon={DesktopTower}
                    footer={order.when}
                />

                <CardDetails
                    title='Descrição do problema'
                    description={order.description}
                    icon={ClipboardText}
                />

                <CardDetails
                    title='solucção'
                    description={order.solution}
                    icon={CircleWavyCheck}
                    footer={order.closed && `Encerrado em ${order.closed}`}
                >
                    { order.status === 'open' &&
                        <Input
                            placeholder='Descrição da solução'
                            onChangeText={setSolution}
                            textAlignVertical='top'
                            multiline
                            h={24}
                        />
                    }
                </CardDetails>
            </ScrollView>

            {
                order.status === 'open' &&
                <Button
                    title='Encerrar Solicitação'
                    m={5}
                    onPress={handleOrderClose}
                />
            }
        </VStack>
    );
}
