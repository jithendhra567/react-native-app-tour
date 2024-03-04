/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useRef } from 'react';
import { Dimensions } from 'react-native';
import { StyleSheet } from 'react-native';
import { Pressable } from 'react-native';
import { Animated } from 'react-native';
import type { IAppTourItemProps } from './AppTourItem';
import { Easing } from 'react-native';
import { Text } from 'react-native';
import { View } from 'react-native';
import Triangle from './components/Trangle';

type OverlayProps = {
  onOverlayPress?: () => void;
  activeStep: number;
  itemData?: IAppTourItemProps;
  showAppTour?: boolean;
  setActiveStep: (step: number) => void;
};

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;

const Overlay = (props: OverlayProps) => {
  const { onOverlayPress, activeStep, itemData, setActiveStep } = props;

  const DURATION = 500;

  const animtedOffset = useRef(new Animated.Value(activeStep)).current;
  const prevDimRef = useRef({
    yAxis: [0],
    xAxis: [0],
    width: [0],
    height: [0],
    bottomHeight: [0],
    infoAxis: [0],
  });
  const inputRange = useRef([activeStep + 1]).current;

  useEffect(() => {
    if (activeStep >= 0) {
      Animated.timing(animtedOffset, {
        toValue: activeStep + 1,
        duration: DURATION,
        easing: Easing.bezier(0, 0.99, 0, 0.99),
        useNativeDriver: false,
      }).start();
    } else {
      animtedOffset.setValue(0);
      // Animated.timing(animtedOffset, {
      //   toValue: 0,
      //   duration: DURATION,
      //   easing: Easing.elastic(0.4),
      //   useNativeDriver: false,
      // }).start();
    }
  }, [activeStep, animtedOffset, inputRange]);

  const { x = 0, y = 0, width: w = 0, height: h = 0 } = itemData?.data || {};
  const {
    containerOffset = 180,
    containerPosition = 'top',
    pointerOffset = 0,
  } = itemData || {};

  const yAxis = activeStep >= 0 ? y : 0;
  const xAxis = activeStep >= 0 ? x : 0;
  const width = activeStep >= 0 ? w : 0;
  const height = activeStep >= 0 ? h : 0;

  if (activeStep >= 0) {
    prevDimRef.current.yAxis[activeStep + 1] = yAxis;
    prevDimRef.current.xAxis[activeStep + 1] = xAxis;
    prevDimRef.current.width[activeStep + 1] = WIDTH - xAxis - width;
    prevDimRef.current.height[activeStep + 1] = height;
    prevDimRef.current.bottomHeight[activeStep + 1] = HEIGHT - yAxis - height;
    const val = containerPosition === 'top' ? yAxis : HEIGHT - yAxis - height;
    prevDimRef.current.infoAxis[activeStep + 1] = val - containerOffset;
  }

  inputRange[activeStep + 1] = activeStep + 1;

  if (!(inputRange.length > 1)) return null;

  const animatedYAxis = animtedOffset.interpolate({
    inputRange: inputRange,
    outputRange: prevDimRef.current.yAxis,
  });
  const animatedXAxis = animtedOffset.interpolate({
    inputRange,
    outputRange: prevDimRef.current.xAxis,
  });
  const animatedHeight = animtedOffset.interpolate({
    inputRange,
    outputRange: prevDimRef.current.height,
  });
  const animatedBottomHeight = animtedOffset.interpolate({
    inputRange,
    outputRange: prevDimRef.current.bottomHeight,
  });
  const animatedWidth = animtedOffset.interpolate({
    inputRange,
    outputRange: prevDimRef.current.width,
  });
  const animatedInfoAxis = animtedOffset.interpolate({
    inputRange: inputRange,
    outputRange: prevDimRef.current.infoAxis,
  });
  // if (!showAppTour) return null;
  const traingleStyles = {
    left: pointerOffset || (xAxis + width / 2) * 0.8,
    bottom: containerPosition === 'top' ? -20 : undefined,
    top: containerPosition === 'top' ? undefined : -20,
  };

  const renderInfo = () => {
    if (activeStep < 0) return null;
    return (
      <Animated.View
        style={[
          styles.infoContainer,
          {
            [containerPosition]: animatedInfoAxis,
          },
        ]}
        // onLayout={this.onLayout}
      >
        <Text style={styles.titleStyle}>{itemData?.title}</Text>
        <Text style={styles.descStyle}>{itemData?.description}</Text>
        <View style={styles.footerStyles}>
          {activeStep > 0 && (
            <Pressable
              onPress={() => setActiveStep(activeStep - 1)}
              style={styles.prevButton}
            >
              <Text
                style={{ fontSize: 14, fontWeight: '600', color: '#04a860' }}
              >
                Prev
              </Text>
            </Pressable>
          )}
          {activeStep === 0 && <View />}
          <Pressable
            onPress={() => setActiveStep(activeStep + 1)}
            style={styles.nextButton}
          >
            <Text style={{ color: 'white', fontSize: 14, fontWeight: '600' }}>
              Next
            </Text>
          </Pressable>
        </View>
        <View style={[{ position: 'absolute' }, traingleStyles]}>
          <Triangle pointDownwards={containerPosition === 'top'} />
        </View>
      </Animated.View>
    );
  };

  return (
    <>
      <Animated.View
        style={[
          styles.viewStyles,
          styles.topStyles,
          {
            height: animatedYAxis,
          },
        ]}
      >
        <Pressable
          style={{ width: '100%', height: '100%' }}
          onPress={onOverlayPress}
        />
      </Animated.View>
      <Animated.View
        style={[
          styles.viewStyles,
          styles.bottomStyles,
          {
            height: animatedBottomHeight,
          },
        ]}
      >
        <Pressable
          style={{ width: '100%', height: '100%' }}
          onPress={onOverlayPress}
        />
      </Animated.View>
      <Animated.View
        style={[
          styles.viewStyles,
          styles.leftStyles,
          {
            width: animatedXAxis,
            height: animatedHeight,
            top: animatedYAxis,
          },
        ]}
      >
        <Pressable
          style={{ width: '100%', height: '100%' }}
          onPress={onOverlayPress}
        />
      </Animated.View>
      <Animated.View
        style={[
          styles.viewStyles,
          styles.rightStyles,
          {
            width: animatedWidth,
            height: animatedHeight,
            top: animatedYAxis,
          },
        ]}
      >
        <Pressable
          style={{ width: '100%', height: '100%' }}
          onPress={onOverlayPress}
        />
      </Animated.View>
      {renderInfo()}
    </>
  );
};

const styles = StyleSheet.create({
  viewStyles: {
    position: 'absolute',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  topStyles: {
    top: 0,
    width: '100%',
  },
  bottomStyles: {
    bottom: 0,
    width: '100%',
  },
  leftStyles: {
    left: 0,
    height: 0,
    width: 0,
  },
  rightStyles: {
    right: 0,
    height: 0,
    width: 0,
  },
  infoContainer: {
    position: 'absolute',
    backgroundColor: 'white',
    width: '80%',
    padding: 16,
    borderRadius: 6,
    left: '10%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
  },
  footerStyles: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  prevButton: {
    padding: 10,
    borderRadius: 6,
  },
  nextButton: {
    backgroundColor: '#04a860',
    padding: 10,
    borderRadius: 6,
  },
  titleStyle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  descStyle: {
    fontSize: 12,
    marginTop: 8,
  },
});

export default Overlay;
