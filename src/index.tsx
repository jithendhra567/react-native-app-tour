/* eslint-disable react-native/no-inline-styles */
import React, { createRef } from 'react';
import { AppTourItem, type IAppTourItemProps } from './AppTourItem';
import { addListener, removeListener } from './EventManager';
import { View } from 'react-native';
import { StyleSheet } from 'react-native';
import { Dimensions } from 'react-native';
import { Text } from 'react-native';
import { Pressable } from 'react-native';
import type { LayoutChangeEvent } from 'react-native';
import type { LayoutRectangle } from 'react-native';
import { Animated } from 'react-native';
import Triangle from './components/Trangle';
import Overlay from './Overlay';

interface IAppTourProps {
  children: React.ReactNode;
  onOverlayPress?: () => void;
}

interface IAppTourState {
  showAppTour: boolean;
  activeStep: number;
  infoDimensions?: LayoutRectangle;
  tourData: {
    [key: string]: IAppTourItemProps;
  };
  animationValue: Animated.Value;
}

const appTourRef = createRef<any>();
const WIDTH = Dimensions.get('window').width;

class AppTourClass extends React.Component<IAppTourProps, IAppTourState> {
  constructor(props: IAppTourProps) {
    super(props);
    this.state = {
      showAppTour: false,
      activeStep: -1,
      tourData: {},
      animationValue: new Animated.Value(0),
    };
  }

  componentDidMount(): void {
    addListener('onLayout', (item: IAppTourItemProps) => {
      this.setState({
        tourData: {
          ...this.state.tourData,
          [item.step]: item,
        },
      });
    });
  }

  componentDidUpdate(
    prevProps: Readonly<IAppTourProps>,
    prevState: Readonly<IAppTourState>
  ): void {
    const { activeStep, tourData } = this.state;
    if (prevState.activeStep !== activeStep) {
      if (activeStep === -1 || !tourData[activeStep]) {
        this.stopTour();
      }
    }
  }

  componentWillUnmount(): void {
    removeListener('onLayout');
  }

  startTour = () => {
    this.setState({
      showAppTour: true,
      activeStep: 0,
    });
  };

  stopTour = () => {
    this.setState({
      showAppTour: false,
      activeStep: -1,
    });
  };

  setActiveStep = (step: number) => {
    this.setState({
      activeStep: step,
    });
  };

  onLayout = (event: LayoutChangeEvent) => {
    const data = event.nativeEvent.layout;
    this.setState({
      infoDimensions: data,
    });
  };

  renderTourInfo = () => {
    const { activeStep } = this.state;
    if (!this.state.showAppTour) return null;
    const itemData = this.state.tourData[this.state.activeStep];
    if (!itemData?.title || !itemData?.data) return null;

    // const moveUp = itemData.data.y - (infoDimensions?.height || 200);

    const traingleStyles = {
      left: itemData.pointerOffset || WIDTH * 0.4 - 10,
      bottom: -20,
    };

    return (
      <Animated.View
        style={[styles.infoContainer, { top: itemData.data.y - 200 }]}
        onLayout={this.onLayout}
      >
        <Text style={styles.titleStyle}>{itemData.title}</Text>
        <Text style={styles.descStyle}>{itemData.description}</Text>
        <View style={styles.footerStyles}>
          {activeStep > 0 && (
            <Pressable
              onPress={() => this.setActiveStep(activeStep - 1)}
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
            onPress={() => this.setActiveStep(activeStep + 1)}
            style={styles.nextButton}
          >
            <Text style={{ color: 'white', fontSize: 14, fontWeight: '600' }}>
              Next
            </Text>
          </Pressable>
        </View>
        <View style={[styles.triangleContainer, traingleStyles]}>
          <Triangle />
        </View>
      </Animated.View>
    );
  };

  render() {
    const { children } = this.props;
    const { tourData, activeStep, showAppTour } = this.state;

    return (
      <>
        {children}
        {/* {this.renderOverlay()} */}
        <Overlay
          onOverlayPress={this.props.onOverlayPress}
          activeStep={activeStep}
          itemData={tourData[activeStep]}
          showAppTour={showAppTour}
          setActiveStep={this.setActiveStep}
        />
        {/* {this.renderTourInfo()} */}
      </>
    );
  }
}

const styles = StyleSheet.create({
  viewStyles: {
    position: 'absolute',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
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
  triangleContainer: {
    position: 'absolute',
  },
});

const AppTour = (props: IAppTourProps) => {
  return <AppTourClass ref={appTourRef} {...props} />;
};

const startAppTour = () => appTourRef?.current?.startTour();
const stopAppTour = () => appTourRef?.current?.stopTour();
const setActiveStep = (step: number) =>
  appTourRef?.current?.setActiveStep(step);

export { AppTour, AppTourItem, startAppTour, stopAppTour, setActiveStep };
