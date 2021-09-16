/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  NativeModules,
  TouchableOpacity,
  FlatList,
  Button,
  ActivityIndicator,
} from 'react-native';

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

const Home = props => {
  const [songs, setSongs] = useState([]);

  const [isLoading, setLoading] = useState(false);

  const [isFilePermission, setFilePermission] = useState(false);

  useEffect(() => {
    onPressOfPermsiion();
  }, []);

  const getAllSongs = async () => {
    const {MusicPlayerModule} = NativeModules;

    setLoading(true);

    const result = await MusicPlayerModule.createMusicEvent('yahh', 'yyaya');

    const songsArr = [];

    const resultKeys = Object.keys(result);

    for (let i = 0; i < resultKeys.length; i++) {
      const songsObj = result[`${i}`];
      songsArr.push(songsObj);
    }

    setSongs(songsArr);

    setLoading(false);

    console.log('ress', result);
  };

  const onPressOfPermsiion = async () => {
    const {MusicPlayerModule} = NativeModules;
    const result = await MusicPlayerModule.getPermission();

    setFilePermission(result);
    if (result) {
      getAllSongs();
    }
    // console.log(result, 'result of permission');
  };

  const renderListHeader = () => {
    if (isLoading || !songs.length) {
      return null;
    }

    return (
      <View>
        <Text style={styles.listHead}>Your songs (tap to play)</Text>
      </View>
    );
  };

  const renderFlatList = () => {
    return (
      <FlatList
        data={songs}
        renderItem={renderItem}
        ListHeaderComponent={renderListHeader}
      />
    );
  };

  const renderItem = ({item, index}) => {
    return (
      <TouchableOpacity
        style={styles.eachSongWrap}
        onPress={() => onPressOfEachRow(index)}>
        <Text style={styles.textWs} numberOfLines={1}>
          {item}
        </Text>
      </TouchableOpacity>
    );
  };

  const onPressOfEachRow = async (index: number) => {
    const {MusicPlayerModule} = NativeModules;

    const resultDuration = await MusicPlayerModule.playSong(index);

    const params = {
      songs: songs,
      songName: songs[index],
      duration: resultDuration,
      index: index,
    };
    console.log(resultDuration, 'resultt');
    return props.navigation.navigate('MusicPlayer', params);
  };

  const renderLoader = () => {
    return <ActivityIndicator color="#FF5733" size="large" />;
  };

  const renderStorageButton = () => {
    return (
      <Button
        title="Enable storage permission"
        onPress={onPressOfPermsiion}
        color="purple"
        disabled={isFilePermission}
      />
    );
  };

  return (
    <SafeAreaView
      style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      {isFilePermission ? null : renderStorageButton()}
      {isLoading ? renderLoader() : null}
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
  eachSongWrap: {
    flexDirection: 'row',
    padding: 10,
    borderRadius: 10,
    marginHorizontal: 20,
    marginVertical: 5,
    backgroundColor: '#023020',
    borderColor: '#A9A9A9',
  },
  textWs: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6082B6',
  },

  listHead: {
    fontSize: 20,
    fontWeight: '800',
    color: '#DAF7A6',
    marginLeft: 20,
    marginBottom: 20,
    marginTop: 20,
  },
});

export default Home;
