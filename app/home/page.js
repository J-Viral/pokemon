"use client";
import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

function HomeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [allPokemons, setAllPokemons] = useState([]); // Store all Pokémon
  const [filteredPokemons, setFilteredPokemons] = useState([]); // Pokémon after search filtering
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const limit = 20;
  const totalPages = Math.ceil(filteredPokemons.length / limit);
  const [page, setPage] = useState(parseInt(searchParams.get("page")) || 1);

  useEffect(() => {
    const fetchAllPokemons = async () => {
      setLoading(true);
      try {
        const res = await fetch("https://pokeapi.co/api/v2/pokemon?limit=1200"); // Fetch all Pokémon
        const data = await res.json();
        setAllPokemons(data.results);
        setFilteredPokemons(data.results); // Initially, filteredPokemons = allPokemons
      } catch (error) {
        console.error("Failed to fetch Pokémon:", error);
      }
      setLoading(false);
    };

    fetchAllPokemons();
  }, []);

  // Handle Search
  useEffect(() => {
    const query = search.toLowerCase();
    const filtered = allPokemons.filter((pokemon) => pokemon.name.includes(query));
    setFilteredPokemons(filtered);
    setPage(1); // Reset to first page after search
  }, [search, allPokemons]);

  // Get paginated Pokémon from filtered list
  const paginatedPokemons = filteredPokemons.slice((page - 1) * limit, page * limit);

  const handlePagination = (newPage) => {
    setPage(newPage);
    router.push(`/?page=${newPage}`, { scroll: false });
    window.scrollTo(0, 0); // Scroll to top when changing pages
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-red-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-red-600 inline-block">
            Pokédex
          </h1>
          <p className="text-gray-600 mt-2">Discover and explore your favorite Pokémon</p>
        </div>

        {/* Search Bar with Icon */}
        <div className="mb-8 flex justify-center">
          <div className="relative w-full max-w-md">
            <input
              type="text"
              placeholder="Search Pokémon"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-4 py-3 pl-10 border-2 border-gray-200 rounded-full focus:outline-none focus:border-blue-500 shadow-sm transition-all"
            />
            <div className="absolute left-3 top-3.5 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Loader */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
          </div>
        ) : (
          <>
            {/* Empty state */}
            {filteredPokemons.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-500 text-xl">No Pokémon found matching "{search}"</div>
                <button
                  onClick={() => setSearch("")}
                  className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition"
                >
                  Clear search
                </button>
              </div>
            )}

            {/* Pokemon Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {paginatedPokemons.map((pokemon, index) => {
                const pokemonId = pokemon.url.split("/")[6];

                return (
                  <Link key={index} href={`/pokemon/${pokemon.name}`}>
                    <div className="bg-white rounded-2xl shadow-md hover:shadow-xl p-6 text-center cursor-pointer transform transition-all duration-300 hover:-translate-y-2 overflow-hidden relative">
                      <div className={`absolute inset-0 opacity-10 bg-gradient-to-br from-blue-100 to-red-100`}></div>
                      <div className="relative">
                        <div className="text-xs font-bold text-gray-400 mb-1">#{pokemonId.padStart(3, "0")}</div>
                        <div className="bg-gray-100 rounded-full p-4 mb-4 w-32 h-32 mx-auto flex items-center justify-center">
                          <img
                            src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png`}
                            alt={pokemon.name}
                            className="w-24 h-24 transform hover:scale-110 transition-transform duration-300"
                          />
                        </div>
                        <p className="mt-2 text-lg font-bold capitalize text-gray-800">{pokemon.name.replace(/-/g, " ")}</p>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HomeContent />
    </Suspense>
  );
}
