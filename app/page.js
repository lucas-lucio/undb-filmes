"use client";

import { useState, useEffect } from "react";
import styles from "./page.module.css";

export default function Home() {
  const [movies, setMovies] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState("catalog");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`https://www.omdbapi.com/?s=${query}&apikey=fc2bded`)
      .then((res) => res.json())
      .then((data) => {
        setMovies(data.Search || []);
        setLoading(false);
      });
  }, [query]);

  const handleSearch = () => {
    if (search.trim()) setQuery(search.trim());
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  const toggleFavorite = (movie) => {
    const isFav = favorites.some((f) => f.imdbID === movie.imdbID);
    if (isFav) {
      setFavorites(favorites.filter((f) => f.imdbID !== movie.imdbID));
    } else {
      setFavorites([...favorites, movie]);
    }
  };

  const isFavorite = (id) => favorites.some((f) => f.imdbID === id);

  const renderCard = (movie) => (
    <div key={movie.imdbID} className={styles.card}>
      {movie.Poster && movie.Poster !== "N/A" ? (
        <img src={movie.Poster} alt={movie.Title} width={150} />
      ) : (
        <div className={styles.noPoster}>Sem imagem</div>
      )}
      <div className={styles.cardBody}>
        <h3>{movie.Title}</h3>
        <p>{movie.Year}</p>
        <button onClick={() => toggleFavorite(movie)}>
          {isFavorite(movie.imdbID) ? "★ Remover" : "☆ Favoritar"}
        </button>
      </div>
    </div>
  );

  return (
    <main className={styles.main}>
      <h1>Catálogo de Filmes</h1>

      <div className={styles.searchBar}>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Buscar filmes..."
        />
        <button onClick={handleSearch}>Buscar</button>
      </div>

      <div className={styles.tabs}>
        <button
          className={tab === "catalog" ? styles.activeTab : ""}
          onClick={() => setTab("catalog")}
        >
          Catálogo
        </button>
        <button
          className={tab === "favorites" ? styles.activeTab : ""}
          onClick={() => setTab("favorites")}
        >
          Favoritos ({favorites.length})
        </button>
      </div>

      {tab === "catalog" && (
        <div className={styles.grid}>
          {loading && <p>Carregando...</p>}
          {!loading && movies.length === 0 && <p>Nenhum filme encontrado.</p>}
          {movies.map(renderCard)}
        </div>
      )}

      {tab === "favorites" && (
        <div className={styles.grid}>
          {favorites.length === 0 && <p>Nenhum favorito ainda.</p>}
          {favorites.map(renderCard)}
        </div>
      )}
    </main>
  );
}