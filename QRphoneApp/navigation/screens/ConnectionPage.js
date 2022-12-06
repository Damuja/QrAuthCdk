import { KeyboardAvoidingView, StyleSheet, TextInput, Text, View, TouchableOpacity } from 'react-native'
import React from 'react'
import NavBarBottom from '../NavBarBottom'
import TopBar from '../../components/TopBar'
import { useNavigation } from '@react-navigation/native';

const ConnectionPage = (props) => {

    const navigation = useNavigation();

    return (
        <>

         
            <TopBar navigation={props.navigation} pageName="Add Connection"/>
      
         
         <KeyboardAvoidingView style={styles.container} behaviour="padding">
             
            

            <View style={styles.inputContainer}>
                <TextInput
                    placeholder='Key'
                    // value={}
                    // onChange={text => }
                    style={styles.input}/>
            </View>

            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    onPress={() => {}}
                    style={styles.button}
                >
                    <Text style={styles.buttonText}>Submit Key</Text>
                </TouchableOpacity>
            <Text style={styles.infoText}>OR Scan Qr here</Text>
                <TouchableOpacity
                    onPress={() => navigation.navigate("ScanQr")}
                    style={[styles.button, styles.buttonOutline]}
                >
                    <Text style={styles.buttonOutlineText}>Scan Qr</Text>
                </TouchableOpacity>

            </View>
         </KeyboardAvoidingView>
         
         <View>
                <NavBarBottom navigation={props.navigation}/>    
            </View>
         </>
        
    )
}

export default ConnectionPage

const styles = StyleSheet.create({
    container: {
        flex: 1,
        
        justifyContent: 'center',
        alignItems: 'center'
    },
    inputContainer: {
        width: '80%'
    },
    input: {
        backgroundColor: 'white',
        paddingHorizontal:12,
        paddingVertical: 12,
        borderRadius: 10,
        marginTop: 200,
        borderColor: '#ababab',
        borderWidth: 1
    },   
    buttonContainer: {
        width: '60%',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 40
    },
    button: {
        backgroundColor: '#3ba740',
        width: '70%',
        padding: 15,
        borderRadius: 10,
        borderColor: '#3ba740',
        borderWidth: 1,
        alignItems: 'center',
        // marginBottom: 50
    },
    infoText: {
        marginTop: 100
    },
    buttonOutline: {
        backgroundColor: 'white',
        marginTop: 3,
        borderColor: '#3ba740',
        borderWidth: 1,
        // marginTop: 100
    },
    buttonText: {
        color: 'white',
        fontWeight: '700'
    },
    buttonOutlineText: {
        fontWeight: '700',
        fontColor: 'green'
    }
})