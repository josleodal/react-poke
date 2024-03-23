import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const PokemonFinder = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let timeoutId;

    const fetchPokemonData = async () => {
      if (searchTerm.trim() !== '') {
        setLoading(true);
        try {
          const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${searchTerm.toLowerCase()}`);
          const data = response.data;
          setSearchResults([data]);
          setError(null);
        } catch (error) {
          console.error('Error fetching data:', error);
          setError('Ha ocurrido un error buscando el pokemon');
        } finally {
          setLoading(false);
        }
      } else {
        setSearchResults([]);
        setError(null);
      }
    };

    clearTimeout(timeoutId);
    if (searchTerm.trim() !== '') {
      timeoutId = setTimeout(fetchPokemonData, 500); 
    }

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const handleSearchTermChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="pokemon-search-container">
      <h2>Buscador de Pokémon</h2>
      <form onSubmit={(e) => e.preventDefault()}>
        <input
          type="text"
          placeholder="Ingrese el nombre del Pokémon"
          value={searchTerm}
          onChange={handleSearchTermChange}
        />
      </form>
      {loading && <p>Cargando...</p>}
      {error && <p>{error}</p>}
      {searchResults.length > 0 && !loading && !error && (
        <div className="pokemon-result-container">
          {searchResults.map((pokemon) => (
            <div key={pokemon.id} className="pokemon-card">
              <img src={pokemon.sprites.front_default} alt={pokemon.name} />
              <h3>{pokemon.name}</h3>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PokemonFinder;
