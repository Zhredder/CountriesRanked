import { useState, useEffect} from 'react'
import './App.css'

type Country = {
  country: string;
  value: number;
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
                <li key={index}>{item.country}, {item.value}</li>
              )}</ul>;
  }
  
  return displayCountries(countries);
  
}

export default App
