
 import React, {useState} from 'react';
 import {
   SafeAreaView,
   ScrollView,
   StatusBar,
   StyleSheet,
   Text,
   useColorScheme,
   View,
   NativeModules,
   TouchableOpacity,
   FlatList,
 } from 'react-native';


 const MusicPlayer = (props) =>{
    const songName = props.route?.params?.songName ?? 'yes'
    return(
        <View style={styles.mainType} >
            <Text>Music player</Text>
            <Text>{songName}</Text>
        </View>
    )
 }

 const styles = StyleSheet.create({
     mainType:{
         flex:1,
         justifyContent:'center',
         alignItems:'center'
     }
 })

 export default MusicPlayer;