import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import { useNavigation } from '@react-navigation/native';
import React from 'react'
import { Icon } from '@rneui/themed';



export default function TopBar(props) {
  
  
  const navigation = useNavigation();
    
    return (
      <View style={styles.container}>
        
        <View style={styles.spaceContainer}>
          <Text style={styles.textStyle}>{props.pageName}</Text>
        </View>
        
        
      <TouchableOpacity onPress={() => navigation.navigate("ConnectionPage")} style={styles.addIcon}>
       <View style={styles.homeIcon}>
        <Icon name='plus-square' type='feather' size={30}/>
       </View>
      </TouchableOpacity>

    
      </View>
      
    )
}


const styles = StyleSheet.create({
  container:{
    flexDirection: 'row'
  },  
  addIcon: {
      width: '30%',
      height: 100,
      paddingTop: 10,
      flexDirection: "row",
      backgroundColor: '#3ba740',
      alignItems: 'center',
      justifyContent: 'center',
      
    },

    spaceContainer: {
      width: '70%',
      height: 100,
      backgroundColor: 'white',
      alignItems: 'center',
      justifyContent: 'center',
      
    },
    textStyle:{
      marginTop: 10,
      fontSize: 20,
    }
    
  })