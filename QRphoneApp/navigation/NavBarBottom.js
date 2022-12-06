import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import { useNavigation } from '@react-navigation/native';
import React from 'react'
import { Icon } from '@rneui/themed';

export default function NavBarBottom(props) {

    const navigation = useNavigation();

  return (
    <View style={styles.container}>
        
        <TouchableOpacity onPress={() => navigation.navigate("Home")} style={styles.homeIcon}>
          <View style={styles.homeIcon}>
           <Icon name='home' type='feather' size={30}/>
              
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("Settings")} style={styles.homeIcon}>
           <View style={styles.AddConnectionButton}>
           <Icon name='settings' type='feather' size={30}/>
           </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("Help")} style={styles.homeIcon}>
            <View style={styles.homeIcon}>
             <Icon name='help-circle' type='feather' size={30}/>
              
            </View>
        </TouchableOpacity>

        </View>
  )
}

const styles = StyleSheet.create({

    container: {
       marginTop: 700,
        flexDirection: "row",
        marginTop: 'auto'
      },
      title: {
        height:100,
        width: '33.33%',
        backgroundColor: '#3ba740',
        justifyContent: 'center',
        alignItems: 'center', 
        paddingBottom: 20
      },
      AddConnectionButton: {
        height:100,
        width: '33.33%',
        // backgroundColor: '#3ba740',
        backgroundColor: '#3ba740',
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: 10
      },
      homeIcon: {
          width: '33.33%',
          justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#3ba740',
        paddingBottom: 10
      },
      buttonText: {
          fontSize: 60,
          color: 'white',
          paddingLeft: 15
      },
      textStyle:{
          paddingTop: 20,
          fontSize: 25
      },
      
})