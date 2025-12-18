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


result = countries_indicator("SP.POP.TOTL", 2024)

#Put the indicator values in the list 
test_list = []
for countries in result:
    test_list.append((countries['country']['value'], countries['value']))
    
#Print the indicators
for item in test_list:
   country = f"Country: {item[0]}, Population: {item[1]}"
   print(country)

# print(result[0]['country']['value'])




























    



