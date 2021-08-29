/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React,{useState} from 'react';
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
  FlatList
} from 'react-native';



const onPressOfPermsiion = async() => {
  const {MusicPlayerModule} = NativeModules
 const result = await MusicPlayerModule.getPermission();
 console.log(result,"result of permission");
}

const onPressplay = () => {
  const {MusicPlayerModule} = NativeModules
 const result =  MusicPlayerModule.playSong(0);
//  console.log(result,"result of permission");
}


const App = () => {

  const [songs,setSongs] = useState([]);

  const onPress = async() => {
    const {MusicPlayerModule} = NativeModules

   const result = await MusicPlayerModule.createMusicEvent("yahh","yyaya");
  
   const songsArr = [];

   const resultKeys = Object.keys(result);

   for(let i=0;i<resultKeys.length;i++){
     const songsObj = result[`${i}`];
     songsArr.push(songsObj)
   }

   setSongs(songsArr);

   console.log("ress",result);
  
  }

  const renderFlatList = () => {
    return(
      <FlatList 
      data={songs}
      renderItem={renderItem}
      />
    )
  }

  const renderItem = ({item,index}) => {
    return(
      <TouchableOpacity 
      onPress={() => onPressOfEachRow(index)}
      >
        <Text>{item}</Text>
      </TouchableOpacity>
    )
  }


  const onPressOfEachRow = (index) => {
    const {MusicPlayerModule} = NativeModules
    const result =  MusicPlayerModule.playSong(index);
  }


  

  return (
    <SafeAreaView style={{flex:1,alignItems:'center',justifyContent:'center'}}>
      <TouchableOpacity onPress={onPress}
      style={styles.sectionContainer}
      >
        <Text>Press here</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={onPressOfPermsiion}
       style={styles.sectionContainer}
      >
        <Text>Press permisison</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={onPressplay}
       style={styles.sectionContainer}
      >
        <Text>Play song</Text>
      </TouchableOpacity>

      {renderFlatList()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
