import { StatusBar } from 'expo-status-bar';
import { Image, StyleSheet, Text, View } from 'react-native';
import TikTokMessages from './components/TikTokMessages';
import { useEffect, useRef, useState } from 'react';
import { ChatItem, generateNewMessage } from './messages.mock';
import SegmentedControl from '@react-native-segmented-control/segmented-control';

const chatSpeed = {
  slow: [1000, 500],
  medium: [500, 500],
  fast: [250, 250],
  insane: [50, 100],
};

export default function App() {
  const [messages, setMessages] = useState<ChatItem[]>([]);
  const timeout = useRef<NodeJS.Timeout | null>(null);
  const [speed, setSpeed] = useState<keyof typeof chatSpeed>('medium');

  const generateData = () => {
    clearTimeout(timeout.current!);
    const selectedSpeed = chatSpeed[speed];
    const timer = Math.random() * selectedSpeed[0] + selectedSpeed[1];

    timeout.current = setTimeout(() => {
      setMessages((prev) => {
        return [generateNewMessage(), ...prev];
      });
      generateData();
    }, timer);
  };

  useEffect(() => {
    generateData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [speed]);

  return (
    <View style={styles.container}>
      <TikTokMessages
        data={messages}
        renderItem={({ item }) => {
          return (
            <View
              style={{
                gap: 4,
                alignItems: 'flex-start',
                padding: 4 * 2,
                borderRadius: 12,
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  gap: 4,
                  justifyContent: 'flex-end',
                  alignItems: 'center',
                }}>
                <Image
                  style={{
                    width: 16,
                    aspectRatio: 1,
                    borderRadius: 24,
                  }}
                  source={{ uri: item.user.avatar }}
                />
                <Text style={{ fontSize: 12 }}>{item.user.name}</Text>
              </View>
              <View
                style={{
                  backgroundColor: '#DDD',
                  padding: 4 * 2,
                  borderRadius: 8,
                }}>
                <Text style={{ fontSize: 12 }}>{item.description}</Text>
              </View>
            </View>
          );
        }}
      />
      <View style={{ height: 200, justifyContent: 'center', alignItems: 'center' }}>
        <SegmentedControl
          values={Object.keys(chatSpeed)}
          style={{ width: 300 }}
          selectedIndex={Object.keys(chatSpeed).indexOf(speed)}
          onChange={(event) => {
            setSpeed(event.nativeEvent.value as keyof typeof chatSpeed);
          }}
        />
      </View>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
