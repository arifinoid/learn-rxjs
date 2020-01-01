import React, { useState, useEffect } from "react";
import { BehaviorSubject, from } from "rxjs";
import {
  filter,
  debounceTime,
  distinctUntilChanged,
  mergeMap
} from "rxjs/operators";

const getPokemonByName = async name => {
  let arr;
  const { result: allPokemons } = await fetch(
    "https://pokeapi.co/api/v2/pokemon/?limit=1000"
  )
    .then(res => res.json())
    .then(data => (arr = data.results));

  return arr.filter(pokemon => pokemon.name.includes(name));
};

let searchSubject = new BehaviorSubject("");
let searchResultObservable = searchSubject.pipe(
  filter(val => val.length > 1),
  debounceTime(150),
  distinctUntilChanged(),
  mergeMap(val => from(getPokemonByName(val)))
);

const useObservable = (observable, setter) => {
  useEffect(() => {
    let subscription = observable.subscribe(result => {
      setter(result);
    });

    return () => subscription.unsubscribe();
  }, [observable, setter]);
};

const Search = () => {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);

  useObservable(searchResultObservable, setResults);

  const handleSearchChange = e => {
    const newValue = e.target.value;

    setSearch(newValue);
    searchSubject.next(newValue);
  };

  return (
    <div>
      <form>
        <input
          type="text"
          value={search}
          onChange={handleSearchChange}
          placeholder="Search..."
        />
      </form>
      <div style={{ margin: "2rem", display: "flex", flexDirection: "column" }}>
        {results.map((result, i) => {
          return <code key={i}>{result.name}</code>;
        })}
      </div>
    </div>
  );
};

export default Search;
