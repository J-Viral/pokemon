"use client";
import React from 'react';
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

export default function PokemonDetail() {
  const { name } = useParams(); // Get Pokémon name from URL
  const [pokemon, setPokemon] = useState(null);
  const [evolution, setEvolution] = useState([]);
  const [evolutionIds, setEvolutionIds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPokemonData = async () => {
      try {
        // Fetch Pokémon basic details
        const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
        const data = await res.json();
        
        // Fetch Pokémon species data (for evolution chain)
        const speciesRes = await fetch(data.species.url);
        const speciesData = await speciesRes.json();

        // Fetch evolution chain
        const evolutionRes = await fetch(speciesData.evolution_chain.url);
        const evolutionData = await evolutionRes.json();
        
        setPokemon({
          ...data,
          evolution_chain: evolutionData,
        });

        // Extract evolution details
        let evoChain = [];
        let evoIds = [];
        let evoData = evolutionData.chain;

        while (evoData) {
          evoChain.push(evoData.species.name);
          
          // Get the ID from the species URL
          const speciesUrl = evoData.species.url;
          const idMatch = speciesUrl.match(/\/pokemon-species\/(\d+)\//);
          const pokemonId = idMatch ? idMatch[1] : null;
          evoIds.push(pokemonId);
          
          evoData = evoData.evolves_to[0]; // Move to next evolution (if exists)
        }

        setEvolution(evoChain);
        setEvolutionIds(evoIds);
      } catch (error) {
        console.error("Error fetching Pokémon data:", error);
      }
      setLoading(false);
    };

    if (name) fetchPokemonData();
  }, [name]);

  if (loading) return <div className="text-center text-xl font-bold">Loading...</div>;

  if (!pokemon) return <div className="text-center text-red-500">Pokémon not found!</div>;

  const getTypeColor = (type) => {
    const typeColors = {
      normal: "bg-gray-400",
      fire: "bg-red-500",
      water: "bg-blue-500",
      electric: "bg-yellow-500",
      grass: "bg-green-500",
      ice: "bg-blue-200",
      fighting: "bg-red-700",
      poison: "bg-purple-500",
      ground: "bg-yellow-700",
      flying: "bg-indigo-300",
      psychic: "bg-pink-500",
      bug: "bg-green-400",
      rock: "bg-yellow-800",
      ghost: "bg-purple-700",
      dragon: "bg-indigo-700",
      dark: "bg-gray-800",
      steel: "bg-gray-500",
      fairy: "bg-pink-300"
    };
    return typeColors[type] || "bg-gray-400";
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-red-50 py-10 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Back Button - Top */}
        <div className="mb-6">
          <Link href="/">
            <button className="flex items-center px-4 py-2 bg-white text-gray-700 rounded-full shadow-md hover:bg-gray-50 transition">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Pokédex
            </button>
          </Link>
        </div>

        {/* Hero Section */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
          <div 
            className={`h-32 ${getTypeColor(pokemon.types[0].type.name)} bg-opacity-70 flex items-center justify-center relative`}
          >
            <div className="absolute left-6 top-6 flex flex-col items-start">
              <span className="bg-white bg-opacity-30 text-white px-3 py-1 rounded-full text-sm font-bold">
                #{String(pokemon.id).padStart(3, '0')}
              </span>
            </div>
            
            <div className="absolute right-6 top-6 flex flex-row space-x-2">
              {pokemon.types.map(type => (
                <span 
                  key={type.type.name} 
                  className={`text-white px-3 py-1 rounded-full text-sm font-bold ${getTypeColor(type.type.name)}`}
                >
                  {type.type.name}
                </span>
              ))}
            </div>
          </div>
          
          <div className="relative -mt-24 text-center pb-6">
            <img
              src={pokemon.sprites?.other["official-artwork"].front_default}
              alt={pokemon.name}
              className="w-48 h-48 mx-auto drop-shadow-lg transform hover:scale-105 transition-transform duration-300"
            />
            <h1 className="text-4xl font-bold capitalize mt-4">
              {pokemon.name}
            </h1>
            
            <div className="flex justify-center space-x-8 mt-4">
              <div className="flex flex-col items-center">
                <span className="text-gray-500 text-sm">Height</span>
                <span className="font-bold">{pokemon.height / 10} m</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-gray-500 text-sm">Weight</span>
                <span className="font-bold">{pokemon.weight / 10} kg</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Stats Section */}
          <div className="bg-white rounded-2xl shadow-md p-6">
            <h2 className="text-2xl font-bold mb-4 text-gray-700">Base Stats</h2>
            <div className="space-y-4">
              {pokemon.stats.map(stat => {
                // Calculate percentage for stat bar (max stat value typically 255)
                const percentage = Math.min(100, (stat.base_stat / 255) * 100);
                // Determine color based on stat value
                let color = "bg-red-500";
                if (stat.base_stat > 70) color = "bg-green-500";
                else if (stat.base_stat > 40) color = "bg-yellow-500";
                
                return (
                  <div key={stat.stat.name}>
                    <div className="flex justify-between mb-1">
                      <span className="text-gray-700 font-medium capitalize">
                        {stat.stat.name.replace('-', ' ')}
                      </span>
                      <span className="font-bold">{stat.base_stat}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className={`${color} h-2.5 rounded-full transition-all duration-1000`} 
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          
          {/* Abilities Section */}
          <div className="bg-white rounded-2xl shadow-md p-6">
            <h2 className="text-2xl font-bold mb-4 text-gray-700">Abilities</h2>
            <div className="space-y-2">
              {pokemon.abilities.map(item => (
                <div 
                  key={item.ability.name} 
                  className="bg-gray-100 rounded-lg p-3 text-gray-800 capitalize"
                >
                  {item.ability.name.replace('-', ' ')}
                </div>
              ))}
            </div>
            
            {/* Evolution Chain */}
            <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-700">Evolution Chain</h2>
            <div className="flex items-center justify-center">
              {evolution.map((evo, index) => (
                <React.Fragment key={evo}>
                  {index !== 0 && (
                    <svg className="h-6 w-6 mx-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  )}
                  <Link href={`/pokemon/${evo}`}>
                    <div className="flex flex-col items-center group">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center group-hover:bg-gray-200 transition">
                        <img 
                          src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${
                            evolutionIds[index]
                          }.png`} 
                          alt={evo} 
                          className="w-12 h-12"
                        />
                      </div>
                      <span className="mt-1 capitalize text-sm group-hover:text-blue-500">{evo}</span>
                    </div>
                  </Link>
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
        
        {/* Moves Section */}
        <div className="bg-white rounded-2xl shadow-md p-6 mt-6">
          <h2 className="text-2xl font-bold mb-4 text-gray-700">Moves</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {pokemon.moves.slice(0, 12).map(move => (
              <div 
                key={move.move.name} 
                className="bg-gray-100 rounded-lg p-2 text-gray-800 capitalize text-center hover:bg-gray-200 transition"
              >
                {move.move.name.replace('-', ' ')}
              </div>
            ))}
          </div>
          
          {pokemon.moves.length > 12 && (
            <div className="text-center mt-4">
              <button className="text-blue-500 hover:text-blue-700 font-medium transition">
                Show More Moves
              </button>
            </div>
          )}
        </div>
        
        {/* Back Button - Bottom */}
        <div className="mt-8 text-center">
          <Link href="/">
            <button className="px-6 py-3 bg-blue-500 text-white rounded-full shadow-md hover:bg-blue-600 transition">
              Back to Pokédex
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}