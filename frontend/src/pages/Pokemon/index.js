import React, { useState } from 'react';
import { View, Text, StyleSheet, Button, TouchableOpacity, Image, ImageBackground  } from 'react-native';
import { Footer, Navbar } from '../../components';

import pokeBallImage from '../../assets/pokeball.png';
import backgroundGif from '../../assets/pokemonBackground.gif'; 

export default function Pokemon({ navigation }) {
  const [pokemon, setPokemon] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchRandomPokemon = async () => {
    setLoading(true);
    try {
      const randomId = Math.floor(Math.random() * 800) + 1; // Gerar id aleatório
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${randomId}`);
      const data = await response.json();
      setPokemon(data);
    } catch (error) {
      console.error('Erro ao buscar Pokémon', error);
    } finally {
      setLoading(false);
    }
  };

  const renderPokemonDetails = () => {
    if (!pokemon) return null;
    return (
      <View style={styles.pokemonContainer}>
        <Image style={styles.pokemonImage} source={{ uri: pokemon.sprites.front_default }} />
        <Text style={styles.pokemonName}>{pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</Text>
        <Text style={styles.pokemonInfo}>Peso: {pokemon.weight}</Text>
        <Text style={styles.pokemonInfo}>Altura: {pokemon.height}</Text>
        {pokemon.abilities && (
          <View>
            <Text style={styles.abilitiesHeader}>Habilidades:</Text>
            {pokemon.abilities.map((ability, index) => (
              <Text key={index} style={styles.pokemonInfo}>{ability.ability.name}</Text>
            ))}
          </View>
        )}
      </View>
    );
  };

  return (
    <ImageBackground source={backgroundGif} style={styles.container} resizeMode="cover">
      <View style={styles.container}>
        <Navbar
          title="POKEMON!!"
          onBack={() => navigation.goBack()} 
          showBackButton={false} 
        />
        <View style={styles.content}>
          {loading ? (
            <Text style={styles.loadingText}>Carregando...</Text>
          ) : (
            renderPokemonDetails()
          )}
        </View>

        <TouchableOpacity style={styles.pokeButton} onPress={fetchRandomPokemon}>
          <Image source={pokeBallImage} style={styles.pokeBallImage} />
        </TouchableOpacity>
        <Footer setSelected={4} />
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: '#fff',
    padding: 20,
  },
  pokemonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    padding: 20,
    borderRadius: 8,
    width: '90%',
    marginBottom: 90,
    alignItems: 'left',
  },
  pokemonImage: {
    width: 200,
    height: 150,
    marginBottom: 15,
  },
  pokemonName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000',
  },
  pokemonInfo: {
    fontSize: 16,
    color: '#000',
  },
  abilitiesHeader: {
    fontWeight: 'bold',
    fontSize: 16,
    marginTop: 10,
  },
  pokeButton: {
    position: 'absolute',
    bottom: 80,
    left: '38%',
  },
  pokeBallImage:{
    width: 90,
    height: 90
  }
});
