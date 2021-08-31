/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

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

 
 const onPressOfPermsiion = async () => {
   const {MusicPlayerModule} = NativeModules;
   const result = await MusicPlayerModule.getPermission();
   console.log(result, 'result of permission');
 };
 
 const onPressplay = () => {
   const {MusicPlayerModule} = NativeModules;
   const result = MusicPlayerModule.playSong(0);
   //  console.log(result,"result of permission");
 };
 
 const onPressPause = () => {
   const {MusicPlayerModule} = NativeModules;
   const result = MusicPlayerModule.pauseSong();
   //  console.log(result,"result of permission");
 };
 
 const onPressStop = () => {
   const {MusicPlayerModule} = NativeModules;
   const result = MusicPlayerModule.stopSong();
   //  console.log(result,"result of permission");
 };
 
 const Home = (props) => {
   const [songs, setSongs] = useState([]);
 
   const onPress = async () => {
     const {MusicPlayerModule} = NativeModules;
 
     const result = await MusicPlayerModule.createMusicEvent('yahh', 'yyaya');
 
     const songsArr = [];
 
     const resultKeys = Object.keys(result);
 
     for (let i = 0; i < resultKeys.length; i++) {
       const songsObj = result[`${i}`];
       songsArr.push(songsObj);
     }
 
     setSongs(songsArr);
 
     console.log('ress', result);
   };
 
   const renderFlatList = () => {
     return <FlatList data={songs} renderItem={renderItem} />;
   };
 
   const renderItem = ({item, index}) => {
     return (
       <TouchableOpacity onPress={() => onPressOfEachRow(index)}>
         <Text>{item}</Text>
       </TouchableOpacity>
     );
   };
 
   const onPressOfEachRow = (index:number) => {
     const {MusicPlayerModule} = NativeModules;

     const params = {
         songs:songs,
         songName:songs[index]
     };

     MusicPlayerModule.playSong(index);

    return props.navigation.navigate("MusicPlayer",params);

     
   };
 
   return (
     <SafeAreaView
       style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
       <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
         <TouchableOpacity onPress={onPress} style={styles.sectionContainer}>
           <Text>Press here</Text>
         </TouchableOpacity>
 
         <TouchableOpacity
           onPress={onPressOfPermsiion}
           style={styles.sectionContainer}>
           <Text>Press permisison</Text>
         </TouchableOpacity>
 
         <TouchableOpacity onPress={onPressplay} style={styles.sectionContainer}>
           <Text>Play song</Text>
         </TouchableOpacity>
 
         <TouchableOpacity
           onPress={onPressPause}
           style={styles.sectionContainer}>
           <Text>Pause/Resume song</Text>
         </TouchableOpacity>
         <TouchableOpacity onPress={onPressStop} style={styles.sectionContainer}>
           <Text>Stop</Text>
         </TouchableOpacity>
       </View>
 
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
 
 export default Home;
 