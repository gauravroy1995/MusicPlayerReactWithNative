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
} from 'react-native';
import {Bar} from 'react-native-progress';

const MusicPlayer = props => {
  const {params} = props?.route ?? {};
  const songName = params?.songName ?? 'yes';
  const duration = params?.duration ?? 0;

  const [timer, setTimer] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const countRef = useRef(null);

  useEffect(() => {
    // Your code here
    handleStart();
  }, []);

  const handleStart = () => {
    setIsActive(true);
    setIsPaused(true);
    countRef.current = setInterval(() => {
      setTimer(timer => timer + 1);
    }, 1000);
  };

  const handlePause = () => {
    clearInterval(countRef.current);
    setIsPaused(false);
  };

  const handleResume = () => {
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

  const momentTime = moment.utc(duration).format('mm:ss');

  const progressOfBar = timer / (duration / 1000) ?? 0;
  console.log(progressOfBar, timer, duration, 'commm');
  return (
    <View style={styles.mainType}>
      <Text>Music player</Text>
      <Text>{songName}</Text>
      <View style={styles.muiscTime}>
        <Bar
          width={150}
          height={20}
          progress={progressOfBar}
          useNativeDriver={true}
        />
        <Text>{momentTime}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainType: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  muiscTime: {
    flexDirection: 'row',
    marginTop: 40,
  },
});

export default MusicPlayer;
