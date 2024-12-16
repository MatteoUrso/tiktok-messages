import { FlatListProps, ListRenderItem } from 'react-native';
import React from 'react';
import Animated, {
  FadeInDown,
  interpolate,
  LinearTransition,
  useAnimatedStyle,
  useDerivedValue,
  withSpring,
} from 'react-native-reanimated';
import { MAX_MESSAGES } from '~/messages.mock';

type Props<T> = FlatListProps<T> & {
  renderItem: ListRenderItem<T>;
};

export default function TikTokMessages<T>({ renderItem, ...props }: Props<T>) {
  return (
    <Animated.FlatList
      {...props}
      inverted
      itemLayoutAnimation={LinearTransition.springify().damping(80).stiffness(200)}
      renderItem={(props) => {
        return <AnimatedItem index={props.index}>{renderItem(props)}</AnimatedItem>;
      }}
    />
  );
}

const AnimatedItem = ({ index, children }: { index: number; children: React.ReactNode }) => {
  const newIndex = useDerivedValue(() => withSpring(index, { damping: 80, stiffness: 200 }));

  const stylez = useAnimatedStyle(() => {
    return {
      opacity: interpolate(newIndex.value, [0, 1], [1, 1 - 1 / MAX_MESSAGES]),
    };
  });

  return (
    <Animated.View
      entering={FadeInDown.springify()
        .damping(80)
        .stiffness(200)
        .withInitialValues({
          opacity: 0,
          transform: [{ translateY: 100 }],
        })}>
      <Animated.View style={[stylez]}>{children}</Animated.View>
    </Animated.View>
  );
};
