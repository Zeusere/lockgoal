import React from 'react';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {StyleSheet, View, Text, ScrollView} from 'react-native';
import {AppNavigator} from './src/navigation';

// Error boundary to catch runtime errors and show them on screen
class ErrorBoundary extends React.Component<
  {children: React.ReactNode},
  {hasError: boolean; error: Error | null}
> {
  constructor(props: {children: React.ReactNode}) {
    super(props);
    this.state = {hasError: false, error: null};
  }

  static getDerivedStateFromError(error: Error) {
    return {hasError: true, error};
  }

  render() {
    if (this.state.hasError) {
      return (
        <ScrollView
          style={{flex: 1, backgroundColor: '#FAF7F2', padding: 24}}
          contentContainerStyle={{paddingTop: 60}}>
          <Text style={{fontSize: 24, fontWeight: '700', color: '#1A1A1A'}}>
            Something went wrong
          </Text>
          <Text
            style={{
              fontSize: 14,
              color: '#F44336',
              marginTop: 16,
              fontFamily: 'monospace',
            }}>
            {this.state.error?.message}
          </Text>
          <Text
            style={{
              fontSize: 12,
              color: '#6B6B6B',
              marginTop: 8,
              fontFamily: 'monospace',
            }}>
            {this.state.error?.stack}
          </Text>
        </ScrollView>
      );
    }
    return this.props.children;
  }
}

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <GestureHandlerRootView style={styles.root}>
        <SafeAreaProvider>
          <AppNavigator />
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </ErrorBoundary>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});

export default App;
