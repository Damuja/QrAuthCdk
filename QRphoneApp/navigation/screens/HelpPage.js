import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import TopBar from '../../components/TopBar'
import NavBarBottom from '../NavBarBottom'

const HelpPage = (props) => {

  return (
    <View style={styles.container}>
        <View>
            <TopBar navigation={props.navigation} pageName="Help"/>
        </View>

      <View>
      <NavBarBottom navigation={props.navigation}/>
      </View>

    </View>
  )
}

export default HelpPage

const styles = StyleSheet.create({

    container:{
        flex: 1,
        justifyContent: 'space-between'
    }
})