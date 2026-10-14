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
  const [isPopulationDescending, setIsPopulationDescending] = useState(false);
  const [isGDPDescending, setIsGDPDescending] = useState(false);
  const [indicatorSelected, setIsIndicatorSelected] = useState(false);

  useEffect(() => {
    fetch('http://localhost:8000/api/countries')
    .then(res => res.json())
    .then((data: Country[]) => setCountries(data))
    .catch(() => setError("Failed to reach backend"));
  }, []);

  function handleClickPopulation(){

    if (!isPopulationDescending){
      setCountries(prev => [...prev].sort((a, b) => b.Population - a.Population));
      setIsPopulationDescending(true);
    }
    else {
      setCountries(prev => [...prev].sort((a, b) => a.Population - b.Population));
      setIsPopulationDescending(false);
    }
    
  }

   function handleClickGDP(){
    if (!isGDPDescending){
      setCountries(prev => [...prev].sort((a, b) => b.GDP_Per_Capita - a.GDP_Per_Capita));
      setIsGDPDescending(true);
    }
    else {
      setCountries(prev => [...prev].sort((a, b) => a.GDP_Per_Capita - b.GDP_Per_Capita));
      setIsGDPDescending(false);
    }

    
  }

  function displayCountries (list: Country[]) {
    const [activeHeader, setActiveHeader] = useState('name');

    return      <table>
                  <thead>
                  <th>Country</th>
                  <th 
                    onClick = {() => {
                    setActiveHeader('Population')
                    handleClickPopulation();
                    }}
                    className={activeHeader === 'Population' ? 'indicator-clicked' : 'population-column'}
                    >Population</th>
                  <th 
                    onClick = {() => {
                    setActiveHeader('GDP Per Capita')
                    handleClickGDP();
                    }}
                    className={activeHeader === 'GDP Per Capita' ? 'indicator-clicked-gdp' : 'gdp-column'}
                    >GDP Per Capita</th>
                  </thead>
                  <tbody>
                   {list.map((item) => 
                    <tr key={item.Country}>
                      <td>{item.Country}</td>
                      <td>{numberFormatter.format(item.Population)}</td>
                      <td className="gdp-column">{item.GDP_Per_Capita}</td>
                    </tr>
                   )}
                  </tbody>
                </table> 
          
  }
  
  
  if(error != ""){
    return error
  }
  
  return displayCountries(countries);

 

  
}


export default App
