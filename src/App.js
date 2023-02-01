import logo from './logo.svg';
import './App.css';
import {useState, useEffect} from 'react';
import searchIcon from "./font-awesome/magnifying-glass.svg";
//https://wizard-world-api.herokuapp.com/Elixirs?Name=Potion

function App() {
  const [searchTerm, setSearchTerm] = useState("Potion");
  const [searchResults, setSearchResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [difficulty, setDifficulty] = useState("");

  useEffect(()=> {
    search(searchTerm);
  },[difficulty]);

  function handleChange(event) {
    setSearchTerm(event.target.value);
  }

  function handleFilterChange(event){
    setDifficulty(event.target.value);
  }

  function handleClick() {
    search(searchTerm);
  }

  async function search(searchText){
    setLoading(true);
    try {
      const request = await fetch(`https://wizard-world-api.herokuapp.com/Elixirs?Name=${encodeURIComponent(searchTerm)}&Difficulty=${encodeURIComponent(difficulty)}`);
      const data = await request.json();
      setSearchResults(data);
    } catch (error) {
      setSearchResults('Error');
    }
    setLoading(false);
  }

  function Title() {
    return (
      <h1>
        Elixir Search
      </h1>
    );
  }

  function Result(props){
    return(
      <li>{props.result.name} <span>{props.result.effect} {difficulty ? `(${difficulty})` : ""}</span></li>
    );
  }

  function SearchResults(){
    if(searchResults == 'Error'){
      return(
        <div>Error accessing the api</div>
      );
    }
    if(searchResults && searchResults.length == 0){
      return(
        <div>
          Query returned 0 results
        </div>
      );
    }
    if(searchResults && searchResults.length > 0){
      return (
        <>
          <p>Search Results ({searchResults.length} total):</p>
          <ul className="searchResults">
            {searchResults.map(
              (result, index) => {
                return(
                  <Result key={`result${index}`} result={result} />
                );
              }
            )}
          </ul>
        </>
      );
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        <Title />
        Name: <input className="searchBox" type="text" name="search" onChange={handleChange} value={searchTerm} />
        <a className="searchButton" onClick={handleClick}>
          <img src={searchIcon} className="searchIcon"/>
        </a>
        <div>
          Filter by Difficulty:
          <select value={difficulty} onChange={handleFilterChange}>
            <option value="">--</option>
            <option value="Unknown">Unknown</option>
            <option value="Advanced">Advanced</option>
            <option value="Moderate">Moderate</option>
            <option value="Beginner">Beginner</option>
            <option value="OrdinaryWizardingLevel">OrdinaryWizardingLevel</option>
            <option value="OneOfAKind">OneOfAKind</option>
          </select>
        </div>
        <div>
          {loading ? "Loading..." : ""}
          <SearchResults/>
        </div>
      </header>
      
    </div>
  );
}

export default App;
