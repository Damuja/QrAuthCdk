import { StatusBar } from 'expo-status-bar';
import { Settings, StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SettingsPage from './navigation/screens/SettingsPage';
import ConnectionPage from './navigation/screens/ConnectionPage';
import AuthenticatePage from './navigation/screens/AuthenticatePage';
import ScanQrPage from './navigation/screens/ScanQrPage';
import HelpPage from './navigation/screens/HelpPage';
import { useEffect, useState } from 'react';
import * as LocalAuthentication from 'expo-local-authentication'
import ScanAuthQrPage from './navigation/screens/ScanAuthQrPage';


const Stack = createNativeStackNavigator(); 



export default function App() {

  const [isAuthenticated, setIsAuthenticated] = useState(false);



  useEffect(()=>{
  
//
  async function AuthenticateApp(){
    const result = await LocalAuthentication.authenticateAsync()
    setIsAuthenticated(result.success)
    console.log(result.success)
  }
  AuthenticateApp()  
 
}, [])

  return (
    
      <NavigationContainer>
    { isAuthenticated ? 
    <Stack.Navigator>
    <Stack.Screen options={{headerShown: false }} name="Home" component={AuthenticatePage} />  
    <Stack.Screen options={{headerShown: false }} name="Help" component={HelpPage}/>
    <Stack.Screen options={{headerShown: false }} name="ConnectionPage" component={ConnectionPage} />
    <Stack.Screen options={{headerShown: false }}  name="Settings" component={SettingsPage} />
    <Stack.Screen options={{headerShown: false }}  name="ScanQr" component={ScanQrPage} />
    <Stack.Screen options={{headerShown: false }}  name="ScanAuthQrPage" component={ScanAuthQrPage} />
    </Stack.Navigator> : <Text>"</Text>}
     </NavigationContainer> 

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
