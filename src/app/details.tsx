import { Stack, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type PokemonDetails = {
  name: string;
  height: number;
  weight: number;
  sprites: {
    front_default: string;
    back_default: string;
  };
  types: {
    type: {
      name: string;
    };
  }[];
  abilities: {
    ability: {
      name: string;
    };
  }[];
  stats: {
    base_stat: number;
    stat: {
      name: string;
    };
  }[];
};

export default function Details() {
  const params = useLocalSearchParams();

  const nameParam = Array.isArray(params.name) ? params.name[0] : (params.name ?? '');

  const [pokemonDetails, setPokemonDetails] = useState<PokemonDetails | null>(null);

  useEffect(() => {
    if (nameParam) {
      fetchDataByName(nameParam);
    }
  }, [nameParam]);

  async function fetchDataByName(name: string) {
    try {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);

      const data = await response.json();

      setPokemonDetails(data);
    } catch (error) {
      console.error(error);
    }
  }

  if (!pokemonDetails) {
    return (
      <SafeAreaView style={styles.loading}>
        <Text>Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack.Screen
        options={{
          title: pokemonDetails.name.charAt(0).toUpperCase() + pokemonDetails.name.slice(1),
        }}
      />

      <ScrollView contentContainerStyle={styles.container}>
        <Image
          source={{
            uri: pokemonDetails.sprites.front_default,
          }}
          style={styles.image}
        />

        <View style={styles.card}>
          <Text style={styles.title}>Types</Text>

          <Text style={styles.text}>
            {pokemonDetails.types.map(type => type.type.name).join(', ')}
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.title}>Information</Text>

          <Text style={styles.text}>Height: {pokemonDetails.height / 10} m</Text>

          <Text style={styles.text}>Weight: {pokemonDetails.weight / 10} kg</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.title}>Abilities</Text>

          {pokemonDetails.abilities.map(item => (
            <Text key={item.ability.name} style={styles.text}>
              {item.ability.name}
            </Text>
          ))}
        </View>

        <View style={styles.card}>
          <Text style={styles.title}>Stats</Text>

          {pokemonDetails.stats.map(stat => (
            <View key={stat.stat.name} style={styles.statRow}>
              <Text style={styles.text}>{stat.stat.name}</Text>

              <Text style={styles.text}>{stat.base_stat}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },

  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  container: {
    padding: 20,
    alignItems: 'center',
    gap: 16,
  },

  name: {
    fontSize: 36,
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },

  image: {
    marginTop: 30,
    width: 220,
    height: 220,
  },

  card: {
    width: '100%',
    padding: 16,
    borderRadius: 16,
    backgroundColor: '#eee',
  },

  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
  },

  text: {
    fontSize: 18,
    textTransform: 'capitalize',
  },

  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 4,
  },
});
