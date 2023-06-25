import { createNativeStackNavigator} from "@react-navigation/native-stack";

import { Home } from '../Screens/Home';
import { Register } from '../Screens/Register';
import { Details } from '../Screens/Details';

const { Navigator, Screen } = createNativeStackNavigator();

export function AppRoutes() {
    return (
        <Navigator screenOptions={{ headerShown: false }}>
            <Screen name='home' component={Home} />
            <Screen name='new' component={Register} />
            <Screen name='details' component={Details} />
        </Navigator>
    )
}