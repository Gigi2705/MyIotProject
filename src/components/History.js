import React from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';

export default function History({ data }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Histórico</Text>
      <ScrollView style={styles.scroll}>
        {data.length === 0 ? (
          <Text style={styles.empty}>Nenhuma mensagem recebida ainda.</Text>
        ) : (
          [...data].reverse().map((item, index) => (
            <View key={index} style={styles.item}>
              <Text style={styles.topic}>{item.topic}</Text>
              <Text style={styles.message}>{item.message}</Text>
              <Text style={styles.time}>{item.time}</Text>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: '#1E1E1E',
    borderRadius: 20,
    padding: 15,
    marginTop: 20,
    maxHeight: 300,
  },
  title: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  scroll: {
    width: '100%',
  },
  empty: {
    color: '#AAA',
    textAlign: 'center',
    marginTop: 10,
  },
  item: {
    backgroundColor: '#2C2C2C',
    borderRadius: 10,
    padding: 10,
    marginBottom: 8,
  },
  topic: {
    color: '#3498DB',
    fontSize: 12,
    fontWeight: 'bold',
  },
  message: {
    color: '#FFF',
    fontSize: 16,
    marginTop: 2,
  },
  time: {
    color: '#AAA',
    fontSize: 11,
    marginTop: 4,
  },
});