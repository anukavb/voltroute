// App.js
import { StyleSheet, Text, View } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>VoltRoute</Text>
      <Text style={styles.subtitle}>Backend engine — test screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121214',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: '#00FF87',
    fontSize: 32,
    fontWeight: 'bold',
  },
  subtitle: {
    color: '#8A8A8E',
    fontSize: 14,
    marginTop: 8,
  },
});