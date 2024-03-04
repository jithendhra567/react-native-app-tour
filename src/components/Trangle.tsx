import React from 'react';
import { View, StyleSheet } from 'react-native';

const Triangle = ({
  size = 20,
  color = 'white',
  pointDownwards = true,
}: {
  size?: number;
  color?: string;
  pointDownwards?: boolean;
}) => {
  return (
    <View
      style={[
        styles.triangle,
        {
          borderBottomColor: color,
          borderLeftWidth: size / 2,
          borderRightWidth: size / 2,
          borderBottomWidth: size,
          transform: [{ rotate: pointDownwards ? '180deg' : '0deg' }],
        },
      ]}
    />
  );
};

const styles = StyleSheet.create({
  triangle: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
  },
});

export default Triangle;
