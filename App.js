import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MQTTService from './src/services/mqttService';
import StatusModal from './src/components/StatusModal';
import LightControl from './src/components/LightControl';
import Gauges from './src/components/Gauges';
import History from './src/components/History';

const mqtt = new MQTTService();

export default function App() {
  const [showError, setShowError] = useState(false);
  const [isLightOn, setIsLightOn] = useState(false);
  const [temp, setTemp] = useState(0);
  const [hum, setHum] = useState(0);
  const [history, setHistory] = useState([]);

  const mqttConfig = {
    host: '97ba3cc596e547b7af1bd39e397cf1cd.s1.eu.hivemq.cloud',
    port: 8884,
    path: '/mqtt',
    user: 'giovana',
    pass: 'Gigi2827',
    clientId: 'RN_App_' + Math.random(),
  };

  useEffect(() => {
    loadHistory();
    startConnection();
  }, []);

  const loadHistory = async () => {
    try {
      const saved = await AsyncStorage.getItem('mqtt_history');
      if (saved) setHistory(JSON.parse(saved));
    } catch (e) {}
  };

  const saveHistory = async (newHistory) => {
    try {
      await AsyncStorage.setItem('mqtt_history', JSON.stringify(newHistory));
    } catch (e) {}
  };

  const addToHistory = (topic, message) => {
    const newEntry = {
      topic,
      message,
      time: new Date().toLocaleString('pt-BR'),
    };
    setHistory(prev => {
      const updated = [...prev, newEntry].slice(-50);
      saveHistory(updated);
      return updated;
    });
  };

  const startConnection = () => {
    setShowError(false);
    mqtt.connect(
      mqttConfig,
      (topic, message) => {
        if (topic === 'casa/temp') setTemp(parseFloat(message));
        if (topic === 'casa/umid') setHum(parseFloat(message));
        if (topic === 'casa/luz') setIsLightOn(message === '1');
        addToHistory(topic, message);
      },
      () => {
        mqtt.subscribe('casa/temp');
        mqtt.subscribe('casa/umid');
        mqtt.subscribe('casa/luz');
      },
      () => setShowError(true)
    );
  };

  const toggleLight = () => {
    mqtt.publish('casa/luz', isLightOn ? '0' : '1');
  };

  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.container}>
        <Text style={styles.header}>Smart Home IoT</Text>
        <LightControl isLightOn={isLightOn} onToggle={toggleLight} />
        <Gauges temp={temp} hum={hum} />
        <History data={history} />
        <StatusModal
          visible={showError}
          onRetry={startConnection}
          onLater={() => setShowError(false)}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: '#121212',
  },
  container: {
    padding: 20,
    alignItems: 'center',
  },
  header: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 40,
    marginBottom: 20,
  },
});