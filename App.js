/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import { transformFileAsync } from '@babel/core';
import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  NativeModules,
  TouchableOpacity
} from 'react-native';

const onPress = async() => {
  const {MusicPlayerModule} = NativeModules
 const result = await MusicPlayerModule.createMusicEvent("yahh","yyaya");

 console.log("ress",result);

}

const onPressOfPermsiion = async() => {
  const {MusicPlayerModule} = NativeModules
 const result = await MusicPlayerModule.getPermission();
 console.log(result,"result of permission");
}

const onPressplay = () => {
  const {MusicPlayerModule} = NativeModules
 const result =  MusicPlayerModule.playSong();
//  console.log(result,"result of permission");
}

const App = () => {


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
