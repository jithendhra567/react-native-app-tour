import React from 'react';
import type { LayoutChangeEvent } from 'react-native';
import type { ViewStyle } from 'react-native';
import { View } from 'react-native';
import { triggerEvent } from './EventManager';
import type { LayoutRectangle } from 'react-native';

export interface IAppTourItemProps {
  children?: React.ReactNode;
  style?: ViewStyle;
  step: number;
  title?: string;
  description?: string;
  data?: LayoutRectangle;
  containerPosition?: 'top' | 'bottom';
  containerOffset?: number;
  pointerOffset?: number;
}

export const AppTourItem: React.FC<IAppTourItemProps> = (props) => {
  const onLayout = (event: LayoutChangeEvent) => {
    const data = event.nativeEvent.layout;
    const propsFilter = {
      ...props,
    };
    delete propsFilter.style;
    delete propsFilter.children;
    triggerEvent('onLayout', { data, ...propsFilter });
  };

  return (
    <View style={props.style} onLayout={onLayout}>
      {props.children}
    </View>
  );
};
