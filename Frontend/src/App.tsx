import { useState, useEffect} from 'react'
import './App.css'

type Country = {
  Country: string;
  Population: number;
  GDP_Per_Capita: number;
}

function App() {
  const [countries, setCountries] = useState<Country[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch('http://localhost:8000/api/countries')
    .then(res => res.json())
    .then((data: Country[]) => setCountries(data))
    .catch(() => setError("Failed to reach backend"));
  }, []);

  function displayCountries (list: Country[]) {
    return  <ul>{list.map((item, index) => 
                <li key={index}>{item.Country}, {item.Population}, {item.GDP_Per_Capita}</li>
              )}</ul>;
  }
  
  if(error != ""){
    return error
  }
  
  return displayCountries(countries);
  
}

export default App
