import { Link } from 'expo-router';
import { useEffect, useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

type Pokemon = {
  name: string;
  image: string;
  imageBack: string;
  types: PokemonType[];
};

interface PokemonType {
  type: {
    name: string;
    url: string;
  };
}
const ColorByType = {
  grass: '#94d8af',
  fire: '#e8a7a1',
  water: '#90CAF9',
  bug: '#ceefa8',
  normal: '#d6d5d5',
  poison: '#CE93D8',
  electric: '#FFE082',
  ground: '#a98d71',
  fairy: '#f16565',
  fighting: '#f26767',
  psychic: '#8fe8f4',
  rock: '#97847e',
  ghost: '#6943b1',
  ice: '#15aff6',
  dragon: '#9e1280',
  dark: '#483a35',
  steel: '#545b5e',
  flying: '#c6cd48',
};

function hexToRgb(hex: string) {
  const h = hex.replace('#', '');

  return {
    r: parseInt(h.substring(0, 2), 16),
    g: parseInt(h.substring(2, 4), 16),
    b: parseInt(h.substring(4, 6), 16),
  };
}

function rgbToHex(r: number, g: number, b: number) {
  return (
    '#' +
    [r, g, b]
      .map(v =>
        Math.max(0, Math.min(255, Math.round(v)))
          .toString(16)
          .padStart(2, '0'),
      )
      .join('')
  );
}
function getPokemonColor(types: PokemonType[]) {
  const first = hexToRgb(ColorByType[types[0].type.name as keyof typeof ColorByType]);

  if (types.length === 1) {
    return rgbToHex(first.r, first.g, first.b);
  }

  const second = hexToRgb(ColorByType[types[1].type.name as keyof typeof ColorByType]);

  // Weighted average
  let r = first.r * 0.75 + second.r * 0.25;
  let g = first.g * 0.75 + second.g * 0.25;
  let b = first.b * 0.75 + second.b * 0.25;

  // Increase contrast
  const avg = (r + g + b) / 3;

  r = avg + (r - avg) * 1.25;
  g = avg + (g - avg) * 1.25;
  b = avg + (b - avg) * 1.25;

  // Slight brightness boost
  r += 8;
  g += 8;
  b += 8;

  return rgbToHex(r, g, b);
}

export default function Home() {
  const [pokemons, setPokemon] = useState<Pokemon[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const response = await fetch('https://pokeapi.co/api/v2/pokemon/?limit=20');

      const data = await response.json();

      const detailedPokemons = await Promise.all(
        data.results.map(async (pokemon: any) => {
          const res = await fetch(pokemon.url);
          const details = await res.json();

          return {
            name: details.name,
            image: details.sprites.front_default,
            imageBack: details.sprites.back_default,
            types: details.types,
          };
        }),
      );

      setPokemon(detailedPokemons);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {pokemons.map(pokemon => {
        const backgroundColor = getPokemonColor(pokemon.types);

        return (
          <Link
            key={pokemon.name}
            href={{
              pathname: '/details',
              params: {
                name: pokemon.name,
              },
            }}
            asChild
          >
            <Pressable style={styles.card}>
              <View style={[StyleSheet.absoluteFill, { backgroundColor }]} />

              <View style={styles.content}>
                <Image source={{ uri: pokemon.image }} style={styles.image} />

                <Text style={styles.name}>{pokemon.name}</Text>

                <Text style={styles.type}>
                  Types: {pokemon.types.map(type => type.type.name).join(', ')}
                </Text>
              </View>
            </Pressable>
          </Link>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
    padding: 16,
  },

  card: {
    height: 260,
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
  },

  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },

  image: {
    width: 150,
    height: 150,
  },

  name: {
    fontSize: 28,
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },

  type: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#666',
    textTransform: 'capitalize',
  },
});
