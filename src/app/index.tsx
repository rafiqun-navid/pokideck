import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

type Pokemon = {
  name: string;
};

export default function Index() {
  const [data, setData] = useState<Pokemon[]>([]);

  useEffect(() => {
    // fetch data from pokimon API
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const response = await fetch('https://pokeapi.co/api/v2/pokemon');
      const pokedata = await response.json();
      setData(pokedata.results);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <ScrollView>
      {data.map(item => (
        <View key={item.name}>
          <Text>{item.name}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({});
