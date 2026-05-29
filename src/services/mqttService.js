import AsyncStorage from '@react-native-async-storage/async-storage';
import mqtt from 'mqtt';

export default class MQTTService {
  constructor() {
    this.client = null;
  }

  connect(config, onMessage, onConnect, onFailure) {
    const { host, port, path, user, pass, clientId } = config;

    const url = `wss://${host}:${port}${path}`;

    this.client = mqtt.connect(url, {
      username: user,
      password: pass,
      clientId: clientId,
      rejectUnauthorized: false,
    });

    this.client.on('connect', () => {
      onConnect();
    });

    this.client.on('message', (topic, message) => {
      onMessage(topic, message.toString());
    });

    this.client.on('error', (err) => {
      onFailure(err);
    });
  }

  subscribe(topic) {
    this.client.subscribe(topic);
  }

  publish(topic, message) {
    this.client.publish(topic, message);
  }
}