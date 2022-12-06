import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import TopBar from '../../components/TopBar'
import NavBarBottom from '../NavBarBottom'
import { useState } from 'react'
import { BarCodeScanner } from 'expo-barcode-scanner'
import { Button } from '@rneui/base'

const ScanQrPage = (props) => {
    const [hasPermission, setHasPermissions] = useState(null)
    const [scanned,setScanned] = useState(false)
    const [qrData, setQrData] = useState('Not Scanned')

    const postData = async(data) => {
          try {
            let res = await fetch('https://6fv7id7el6.execute-api.eu-west-2.amazonaws.com/prod/scanConnectionQr', {
              method: 'POST',
              headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                userId: "4ecb937f-703c-4d9e-99b7-a7ae5912c8b7",
                Website: "BEBO",
                ConnectionKey: qrData
              })
              
            });
            res = await res.json();
            console.log(res)
          } catch (e) {
            console.error(e);
          }
        }
    const askForCameraPermissions = () =>{
        (async () => {
            const {status} = await BarCodeScanner.requestPermissionsAsync()
            setHasPermissions(status === 'granted')
        })
    }

    useEffect(() =>{
        (async () => {
            const {status} = await BarCodeScanner.requestPermissionsAsync()
            setHasPermissions(status === 'granted')
        })();
    }, [])

    const handleBarCodeScanned = ({type, data}) => {
        setScanned(true)
        setQrData(data)
        console.log('Type '+ type, '\nData: ' + data)
    }

    if(hasPermission === null) {
        return (
            <View style={styles.container}>
                <View>
                    <TopBar navigation={props.navigation} pageName="ScanQr"/>
                </View>
                <Text>Requesting for camera permissions </Text>
              <View>
              <NavBarBottom navigation={props.navigation}/>
              </View>
        
            </View>
          )
    }

    
  return (

    <View style={styles.container}>
        <View>
            <TopBar navigation={props.navigation} pageName="ScanQr"/>
        </View>
        <View>
        <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={{height:400, width: 400}}
        />
        </View>
     
       <Text color="black">{qrData}</Text>

        {scanned && <Button title={'scan again?'} onPress={() => {setScanned(false), postData()}} color='tomato'/>} 
       
      <View>
      <NavBarBottom navigation={props.navigation}/>
      </View>

    </View>
  )
}

export default ScanQrPage

const styles = StyleSheet.create({

  container:{
    flex: 1,
    justifyContent: 'space-between'
  } 
})