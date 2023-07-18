import {NavigationContainer} from "@react-navigation/native";
import {useEffect, useState} from "react";
import SignIn from "../Screens/SignIn";
import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth"
import Loading from "../components/Loading";
import {AppRoutes} from "./app.routes";

export function Routes() {
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState<FirebaseAuthTypes.User>();

    useEffect(() => {
        return auth()
            .onAuthStateChanged(response => {
                setUser(response);
                setIsLoading(false);
            });
    }, []);

    if (isLoading) {
        return <Loading />
    }

    return (
        <NavigationContainer>
            { user ? <AppRoutes /> : <SignIn /> }
        </NavigationContainer>
    )
}
