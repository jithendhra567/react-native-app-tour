/* eslint-disable react-native/no-inline-styles */
import * as React from 'react';

import { StyleSheet, View, Text, Button, TouchableOpacity } from 'react-native';
import {
  AppTourItem,
  AppTour,
  startAppTour,
  stopAppTour,
} from 'react-native-app-tour';

export default function App() {
  return (
    <AppTour onOverlayPress={stopAppTour}>
      <View style={styles.container}>
        <AppTourItem
          step={0}
          containerPosition="bottom"
          title="This is a text"
          description="This is a kdbkubvoivndfiv i fbif bfubfovbsovhs odfbfbvfuv bpiunvfibvfhivbdivnf vnpfbvauv bdfbd"
        >
          <Text>Let make this an alignItems</Text>
        </AppTourItem>
        <AppTourItem
          step={1}
          style={{ marginTop: 100 }}
          title="This is a text"
          description="This is a description"
        >
          <Text>Something that can be changed</Text>
        </AppTourItem>

        <AppTourItem
          step={2}
          style={{ marginTop: 100, marginLeft: 200 }}
          title="This is a text"
          description="This is a description"
        >
          <TouchableOpacity style={styles.box}>
            <Text>Something that can be changed</Text>
          </TouchableOpacity>
        </AppTourItem>

        <Button title="Start Tour" onPress={startAppTour} />
      </View>
    </AppTour>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    width: 100,
    height: 100,
    backgroundColor: 'tomato',
  },
});
