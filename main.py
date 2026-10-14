from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import httpx

# Indicator = a metric. E.g population, GDP per capita, birt rate, etc. 

WB = "https://api.worldbank.org/v2"

app = FastAPI()

# allows communication between the frontend and backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/countries")
def countries():
    # Fetch all the countries and leave out the aggregates (non countries)
    def fetch_countries_only():
        r = httpx.get(f"{WB}/country", params={"format":"json", "per_page": 400})
        r.raise_for_status()
        # list of dictionaries
        rows = r.json()[1]

        return {
            # adding the region 'id' json field of each country to the set
            c["id"] 
            # c is each entry in the dictionary. Each one represents a country or aggregate.
            for c in rows
            # add only the countries that are not aggregates
            if c["region"]["id"] != "NA"      # not "Aggregates"
        }

    # Fetch data for indicator for a specific year (includes aggregates)
    def fetch_indicator_year(ind_code: str, year: int):
        r = httpx.get(f"{WB}/country/all/indicator/{ind_code}",
                    params={"date": year, "format": "json", "per_page": 20000}
        )
        r.raise_for_status()
        return r.json()[1]

    # Get indicator values for approved countries only (non aggregates)
    def countries_indicator(ind_code: str, year: int):
        allowed_countries = fetch_countries_only()
        rows = fetch_indicator_year(ind_code, year)

        return [
            {
                "iso3": row["countryiso3code"],
                "country": row["country"],
                "year": int(row["date"]),
                "value": row["value"],
            }

            for row in rows
            if row["countryiso3code"] in allowed_countries

        ]
    
    population = countries_indicator("SP.POP.TOTL", 2024)
    gdp = countries_indicator("NY.GDP.PCAP.CD", 2024)

    def population_lookup(country_code):

        country_code = country_code.upper()

        for country in population:
            if country.get("iso3") == country_code:
                return country.get("value")
            
        return 'Country code not found'
    

    def gdp_lookup(country_code):

        country_code = country_code.upper()

        for country in gdp:
            if country.get("iso3") == country_code:
                raw_value = country.get("value")

                if raw_value is not None:
                    rounded_value = round(raw_value)
                    return rounded_value
                else:
                    rounded_value = 0
                    
            
        return '0'
    
    def final_dict():
        dict_list = []
        for country in population:
            new_dict = {"Country": country['country']['value'],
                        "Population" : population_lookup(country['iso3']), 
                        "GDP_Per_Capita" : gdp_lookup(country['iso3'])}
            dict_list.append(new_dict)

        return dict_list

    dictionary = final_dict()

    return dictionary
    
    

  






























    



