import { StyleSheet, Text, View, FlatList, TouchableOpacity, navigation} from 'react-native'
import { useState, useEffect } from 'react';
import React from 'react'
import TopBar from '../../components/TopBar'
import NavBarBottom from '../NavBarBottom'
import { useNavigation } from '@react-navigation/native';

const AuthenticatePage = (props) => {
  const navigation = useNavigation();
  const [connections, setConnections] = useState([])
  

  useEffect(() =>{
    postData()
}, [])

  const postData = async(data) => {
    try {
      let res = await fetch('https://6fv7id7el6.execute-api.eu-west-2.amazonaws.com/prod/getUsersConnections', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
         userId: "4ecb937f-703c-4d9e-99b7-a7ae5912c8b7",
        })//
        
      });
      res = await res.json();
      console.log("the response from the api is:", res.Item.Connections)
      setConnections(res.Item.Connections)
    } catch (e) {
      console.error(e);
    }
      console.log(connections)
  }

  return (
    <View style={styles.container}>
        <View>
            <TopBar navigation={props.navigation} pageName="Authentication"/>
        </View>

      
          <FlatList
          data={connections}
           keyExtractor={(item) => item.ConnectionKey}
           renderItem={({ item, index }) => (
            <TouchableOpacity
                    onPress={() => navigation.navigate("ScanAuthQrPage", {item: item, index: index.toString()})}  >
    
            <Text style={styles.item}>{item.Website}</Text>
            </TouchableOpacity>
           )}
          />
          

      <View>
      <NavBarBottom navigation={props.navigation}/>
      </View>

    </View>
  )
}

export default AuthenticatePage

const styles = StyleSheet.create({
  container:{
    flex: 1,
    justifyContent: 'space-between'
  },

  item: {
    marginTop:24,
    padding: 30,
    backgroundColor: 'green',
    fontSize: 24,
    marginHorizontal: 10,
    marginTop: 24
  }
})