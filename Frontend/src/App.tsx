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
  const numberFormatter = new Intl.NumberFormat('en-US');

  useEffect(() => {
    fetch('http://localhost:8000/api/countries')
    .then(res => res.json())
    .then((data: Country[]) => setCountries(data))
    .catch(() => setError("Failed to reach backend"));
  }, []);

  function handleClick(){
    setCountries(prev => [...prev].sort((a, b) => b.Population - a.Population));
  }

  function displayCountries (list: Country[]) {

    return      <table className="main-table">
                <tr>
                  <th>Country</th>
                  <th onClick={handleClick}>Population</th>
                  <th className="gdp-column">GDP_Per_Capita</th>
                </tr>
                {list.map((item) => 
                <tr key={item.Country}>
                  <td>{item.Country}</td>
                  <td >{numberFormatter.format(item.Population)}</td>
                  <td className="gdp-column">{item.GDP_Per_Capita}</td>
                </tr>
                )}</table>
            
              
  }
  
  if(error != ""){
    return error
  }
  
  return displayCountries(countries);

 

  
}


export default App
