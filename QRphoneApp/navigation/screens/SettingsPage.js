import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import TopBar from '../../components/TopBar'
import NavBarBottom from '../NavBarBottom'

const SettingsPage = (props) => {
  return (

    <View style={styles.container}>
        <View>
            <TopBar navigation={props.navigation} pageName="Settings"/>
        </View>

      <View>
      <NavBarBottom navigation={props.navigation}/>
      </View>

    </View>
  )
}

export default SettingsPage

const styles = StyleSheet.create({

  container:{
    flex: 1,
    justifyContent: 'space-between'
  } 
})