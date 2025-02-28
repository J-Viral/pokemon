"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

export default function Home() {
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

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      // Show all pages if there are fewer than maxVisiblePages
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Always include first page
      pageNumbers.push(1);

      // Calculate start and end of page range around current page
      let startPage = Math.max(2, page - 1);
      let endPage = Math.min(totalPages - 1, page + 1);

      // Adjust if we're near the beginning or end
      if (page <= 3) {
        endPage = Math.min(4, totalPages - 1);
      } else if (page >= totalPages - 2) {
        startPage = Math.max(totalPages - 3, 2);
      }

      // Add ellipsis after first page if needed
      if (startPage > 2) {
        pageNumbers.push('...');
      }

      // Add middle pages
      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }

      // Add ellipsis before last page if needed
      if (endPage < totalPages - 1) {
        pageNumbers.push('...');
      }

      // Always include last page
      if (totalPages > 1) {
        pageNumbers.push(totalPages);
      }
    }

    return pageNumbers;
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
                    onClick={() => setSearch('')}
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
                  // Generate a background color based on pokemonId for visual variety
                  const bgHue = (parseInt(pokemonId) * 40) % 360;

                  return (
                    <Link key={index} href={`/pokemon/${pokemon.name}`}>
                      <div className="bg-white rounded-2xl shadow-md hover:shadow-xl p-6 text-center cursor-pointer transform transition-all duration-300 hover:-translate-y-2 overflow-hidden relative">
                        <div className={`absolute inset-0 opacity-10 bg-gradient-to-br from-blue-100 to-red-100`}></div>
                        <div className="relative">
                          <div className="text-xs font-bold text-gray-400 mb-1">#{pokemonId.padStart(3, '0')}</div>
                          <div className="bg-gray-100 rounded-full p-4 mb-4 w-32 h-32 mx-auto flex items-center justify-center">
                            <img
                              src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png`}
                              alt={pokemon.name}
                              className="w-24 h-24 transform hover:scale-110 transition-transform duration-300"
                            />
                          </div>
                          <p className="mt-2 text-lg font-bold capitalize text-gray-800">{pokemon.name.replace(/-/g, ' ')}</p>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </>
          )}

          {/* New Pokémon-Themed Pagination */}
          {filteredPokemons.length > limit && (
            <div className="mt-12 flex flex-col items-center">
              <div className="flex flex-wrap justify-center items-center gap-2">
                {/* Previous Button */}
                {page > 1 && (
                  <button
                    onClick={() => handlePagination(page - 1)}
                    className="flex items-center justify-center w-10 h-10 rounded-full bg-red-500 text-white shadow hover:bg-red-600 transition transform hover:scale-105"
                    aria-label="Previous page"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                )}

                {/* Page Numbers */}
                {getPageNumbers().map((num, index) => (
                  <button
                    key={index}
                    onClick={() => num !== '...' && handlePagination(num)}
                    disabled={num === '...' || num === page}
                    className={`
                    w-10 h-10 flex items-center justify-center rounded-full text-sm font-medium transition transform
                    ${num === page ?
                        'bg-blue-500 text-white scale-110 shadow-md' :
                        num === '...' ?
                          'bg-transparent cursor-default' :
                          'bg-white text-gray-700 hover:bg-gray-100 hover:scale-105 shadow'
                      }
                  `}
                  >
                    {num}
                  </button>
                ))}

                {/* Next Button */}
                {page < totalPages && (
                  <button
                    onClick={() => handlePagination(page + 1)}
                    className="flex items-center justify-center w-10 h-10 rounded-full bg-red-500 text-white shadow hover:bg-red-600 transition transform hover:scale-105"
                    aria-label="Next page"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                )}
              </div>

              {/* Page indicator */}
              <div className="mt-4 flex items-center justify-center">
                <div className="px-4 py-2 bg-white rounded-full shadow text-sm text-gray-600">
                  Page {page} of {totalPages}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
  );
}