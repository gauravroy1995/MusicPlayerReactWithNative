import moment from 'moment';
import React, {useState, useRef, useEffect} from 'react';
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
  Image,
  Button,
  Dimensions,
} from 'react-native';
import {Bar} from 'react-native-progress';

const MusicPlayer = props => {
  const {params} = props?.route ?? {};
  // con params?.songName ?? 'yes';st songName =
  const duration = params?.duration ?? 0;
  // const indexOfSong = params?.index ?? 0;
  const songList = params?.songs ?? [];

  const [timer, setTimer] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [indexOfSong, setSongindex] = useState(params?.index ?? 0);
  const [durationOfSong, setDurationOfSong] = useState(duration);
  const [songName, setSongName] = useState(params?.songName ?? 'yes');
  const [maxVolume, setMaxVolume] = useState(1);
  const [currentVolume, setCurrentvolume] = useState(0);

  const countRef = useRef(null);

  // React.useLayoutEffect(() => {
  //   props.navigation.setOptions({
  //     headerLeft: () => (
  //       <Button
  //         onPress={() => {
  //           onPressStop();
  //           onBackPress();
  //         }}
  //         title="Back"
  //       />
  //     ),
  //   });
  // }, [props.navigation]);

  const onBackPress = () => {
    clearInterval(countRef.current);
    props.navigation.goBack();
  };

  const onPressStop = () => {
    const {MusicPlayerModule} = NativeModules;
    const result = MusicPlayerModule.stopSong();
    //  console.log(result,"result of permission");
  };

  const getVolumeLevel = async () => {
    const {MusicPlayerModule} = NativeModules;
    const allPromise = Promise.all([
      MusicPlayerModule.getCurrentVolume(),
      MusicPlayerModule.getMaxVolume(),
    ]);
    const [currentVolume, maxVolume] = await allPromise;
    // console.log(currentVolume, maxVolume, 'dadada');
    setMaxVolume(maxVolume);
    setCurrentvolume(currentVolume);

    // console.log(result, 'resss of volume');
  };

  useEffect(() => {
    // Your code here
    handleStart();
    getVolumeLevel();
    return () => {
      onPressStop();
      clearInterval(countRef.current);
    };
  }, []);

  const handleStart = () => {
    setIsActive(true);
    setIsPaused(true);
    countRef.current = setInterval(() => {
      setTimer(timer => timer + 1);
    }, 1000);
  };

  const onPauseResume = () => {
    if (isPaused) {
      handlePause();
    } else {
      handleResume();
    }
  };

  const handlePause = () => {
    clearInterval(countRef.current);
    setIsPaused(false);
    const {MusicPlayerModule} = NativeModules;
    const result = MusicPlayerModule.pauseSong();
  };

  const handleResume = () => {
    const {MusicPlayerModule} = NativeModules;
    const result = MusicPlayerModule.pauseSong();
    setIsPaused(true);
    countRef.current = setInterval(() => {
      setTimer(timer => timer + 1);
    }, 1000);
  };

  const handleReset = () => {
    clearInterval(countRef.current);
    setIsActive(false);
    setIsPaused(false);
    setTimer(0);
  };

  const increaseVolume = async () => {
    const {MusicPlayerModule} = NativeModules;
    const result = await MusicPlayerModule.increaseVolume();
    setCurrentvolume(result);
    // console.log(result, 'resul of increase');
  };

  const momentTime = moment.utc(durationOfSong).format('mm:ss');

  const progressOfBar = timer / (durationOfSong / 1000) ?? 0;
  // console.log(progressOfBar, timer, duration, 'commm');

  const pauseText = isPaused ? 'Pause' : 'Resume';

  const isLastSong = indexOfSong === songList.length - 1;

  const onNextPressOfSong = async () => {
    if (isLastSong) {
      return null;
    }

    onPressStop();
    clearInterval(countRef.current);
    setTimer(0);

    const newIndex = indexOfSong + 1;

    setSongindex(newIndex);

    const {MusicPlayerModule} = NativeModules;

    const resultDuration = await MusicPlayerModule.playSong(newIndex);

    setSongName(songList[newIndex]);

    setDurationOfSong(resultDuration);

    handleStart();
  };

  const onPrevioustPressOfSong = async () => {
    if (indexOfSong === 0) {
      return null;
    }

    onPressStop();
    clearInterval(countRef.current);
    setTimer(0);

    const newIndex = indexOfSong - 1;

    setSongindex(newIndex);

    const {MusicPlayerModule} = NativeModules;

    const resultDuration = await MusicPlayerModule.playSong(newIndex);

    setSongName(songList[newIndex]);

    setDurationOfSong(resultDuration);

    handleStart();
  };

  const computeVolumePercent = () => {
    // console.log('hhh');
    return currentVolume / maxVolume;
  };

  const decreaseVolume = async () => {
    const {MusicPlayerModule} = NativeModules;
    const result = await MusicPlayerModule.decreaseVolume();
    setCurrentvolume(result);
  };

  return (
    <View style={styles.mainType}>
      <View style={styles.musicW}>
        <Image
          source={{uri: 'https://source.unsplash.com/featured/?music'}}
          style={styles.musicWrap}
        />
        <View style={styles.ebads}>
          <Bar
            style={{transform: [{rotate: '-90deg'}]}}
            // style={{overflow: 'hidden', height: 5}}
            width={100}
            height={20}
            progress={computeVolumePercent()}
            useNativeDriver={true}
            color={'#842df7'}
          />
          <View>
            <Text style={styles.prevText} onPress={increaseVolume}>
              + vol
            </Text>

            <Text style={styles.prevText} onPress={decreaseVolume}>
              - vol
            </Text>
          </View>
        </View>
      </View>
      <Text style={styles.textSty}>{songName}</Text>
      <View style={styles.muiscTime}>
        <Bar
          style={{overflow: 'hidden', height: 5}}
          width={Dimensions.get('window').width - 40}
          height={5}
          progress={progressOfBar}
          useNativeDriver={true}
          color={'#842df7'}
        />
        <Text style={styles.textSty2}>Duration: {momentTime}</Text>
      </View>
      <View style={styles.wras}>
        <Text style={styles.prevText} onPress={onPrevioustPressOfSong}>
          Previous
        </Text>
        <Text style={styles.pauseTex} onPress={onPauseResume}>
          {pauseText}
        </Text>
        {!isLastSong ? (
          <Text onPress={onNextPressOfSong} style={styles.prevText}>
            Next
          </Text>
        ) : (
          <View />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainType: {
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
  },
  muiscTime: {
    // flexDirection: 'row',
    marginTop: 40,
    marginHorizontal: 20,
    alignItems: 'center',
    // flex: 1,
  },
  musicWrap: {
    height: 200,
    width: 150,
    borderRadius: 20,
  },
  ebads: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    flexDirection: 'row',
  },
  musicW: {
    marginHorizontal: 20,
    marginVertical: 50,
    borderRadius: 20,
    shadowColor: '#fff',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,

    elevation: 14,
    flexDirection: 'row',
  },
  textSty: {
    textAlign: 'center',
    marginHorizontal: 20,
    fontSize: 14,
    fontWeight: '700',
    color: '#FF5733',
  },
  textSty2: {
    textAlign: 'center',
    // marginLeft: 20,
    fontSize: 12,
    fontWeight: '700',
    color: '#BA4635',
    marginTop: 20,
  },
  prevText: {
    textAlign: 'center',
    // marginLeft: 20,
    fontSize: 16,
    fontWeight: '700',
    color: '#2995BB',
    marginVertical: 20,
  },
  pauseTex: {
    textAlign: 'center',

    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c8a45',
  },
  wras: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    marginTop: 30,
    alignItems: 'center',
  },
});

export default MusicPlayer;
