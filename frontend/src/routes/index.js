import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Welcome, SignIn, ApiTest, Home, Profile, Pokemon, Register } from '../pages';

const Stack = createNativeStackNavigator();

export default function Routes(){
    return(
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
                animation: 'none',
            }}>
            <Stack.Screen
                name="Welcome"
                component={Welcome}
            />
            <Stack.Screen
                name="SignIn"
                component={SignIn}
            />
            <Stack.Screen
                name="ApiTest"
                component={ApiTest}
            />
            <Stack.Screen
                name="Home"
                component={Home}
            />
            <Stack.Screen
                name="Profile"
                component={Profile}
            />
            <Stack.Screen
                name="Pokemon"
                component={Pokemon}
            />
            <Stack.Screen
                name="Register"
                component={Register}
            />
        </Stack.Navigator>
    )
}