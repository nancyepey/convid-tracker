import React, { useState, useEffect } from 'react';
import { 
  MenuItem,
  FormControl,
  Select,
  Card,
  CardContent
} from "@material-ui/core";
import InfoBox from './InfoBox';
import Map from "./Map";
import Table from './Table';
import './App.css';
import { sortData, prettyPrintStat } from "./util";
import LineGraph from "./LineGraph";
import "leaflet/dist/leaflet.css";

import {ThemeProvider} from "styled-components";
import { GlobalStyles } from "./globalStyles.js";
import { lightTheme, darkTheme } from "./Themes";


function App() {
  // using state
  // state is a short term memory for react
  // state is hpw to write a variable in REACT
  // so here we can say the variable is countries, we have setCountries to basically
  // be able to change the countries variable
  // the initail value here is an empty array (we put it inside the use state)
  const [countries, setCountries] = useState([]);
  // to keep track of the selected option in the drop down
  // making worldwide the default option
  const [country, setCountry] = useState('worldwide');
  const [countryInfo, setCountryInfo] = useState({}); //emtpy object
  const [tableData, setTableData] = useState([]);
  const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796}); //that lat n lng is center of pacific ocean
  const [mapZoom, setMapZoom] = useState(3);
  const [mapCountries, setMapCountries] = useState([]);
  const [casesType, setCasesType] = useState("cases");

  const [theme, setTheme] = useState('light');
  const themeToggler = () => {
      theme === 'light' ? setTheme('dark') : setTheme('light')
  }

  //for when we research the page
  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
      .then((response) => response.json())
      .then((data) => {
        //All of the data from all countries response
        setCountryInfo(data);
      });
  }, []);

  // https://disease.sh/v3/covid-19/countries
  // we make a call to the api ie an api request above with the help of a USEEFFECT useEffect()
  // USEEFFECT = Runs a peice of code based on a given condition
  useEffect(() => {
    // The code inside here will run once when the component loads and not again after
    // async -- send a request, wait for it, do somthing with it

    const getCountriesData = async () => {
      // making an api request
      await fetch("https://disease.sh/v3/covid-19/countries")
      .then((response)  => response.json())
      .then((data) => {
        const countries = data.map((country) => (
          {
            name: country.country, // eg Unites States, United Kingdom
            value: country.countryInfo.iso2 // eg UK, USA, FR
          }
        ));

        const sortedData = sortData(data); //from util js
        setTableData(sortedData);
        setMapCountries(data);
        setCountries(countries);
      });
    };

    getCountriesData();
  }, []);

  const onCountryChange = async (event)  =>  {
    const countryCode = event.target.value;

    // console.log(countryCode);

    setCountry(countryCode);

    //make a call to https://disease.sh/v3/covid-19/countries/all when worldwide is selected
    //making a call to https://disease.sh/v3/covid-19/countries/[COUNTRY_CODE] when a country is selected
    //from drop down
    const url = countryCode === 'worldwide' ? 'https://disease.sh/v3/covid-19/all' 
    : `https://disease.sh/v3/covid-19/countries/${countryCode}`;

    await fetch(url)
      .then(response => response.json())
      .then(data => {
        setCountry(countryCode);

        //All of the data from the country response
        setCountryInfo(data);

        setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
        setMapZoom(4);
      });

  };
  console.log("Country info", countryInfo);

  return (
    <ThemeProvider theme={theme === 'light' ? lightTheme : darkTheme}>
    <div className="app">
      <GlobalStyles/>
      
      <Card className="app__left">
          <CardContent>
            <h3>Live Cases by Country</h3>
            <Table countries={tableData} />
            <h3 className="app__graphTitle">Worldwide new {casesType}</h3>
            {/* Graph */}
            <LineGraph className="app__graph" casesType={casesType} />
        </CardContent>
      </Card>

      <div className="app__right">
        {/* Header */}
        {/* Title + Select input dropdown field */}
          <div className="app__header">
            <h1>COVID 19 TRACKER</h1>

            {/* toggle button */}
            <button className="app__toggle" onClick={themeToggler}>Switch Mode</button>

            <FormControl className="app__dropdown">
              {/* using onChange to listen to a change in the value, when clicked */}
              <Select
              onChange={onCountryChange}
              variant="outlined"
              value={country}
              >
                <MenuItem value="worldwide">Worldwide</MenuItem>
                {/* Loop through all the countries and show a drop down list of the options */}
                {
                  countries.map((country) => (
                    <MenuItem value={country.value}>{country.name}</MenuItem>
                  ))
                }
              </Select>
            </FormControl>
          </div>
          
          <div className="app__stats">
            <InfoBox 
              isRed
              active={casesType === "cases"}
              onClick={(e) => setCasesType("cases")}
              title="Coronavirus Cases" 
              cases={prettyPrintStat(countryInfo.todayCases)} 
              total={prettyPrintStat(countryInfo.cases)} 
            />
            
            <InfoBox 
              active={casesType === "recovered"}
              onClick={(e) => setCasesType("recovered")}
              title="Recovered" 
              cases={prettyPrintStat(countryInfo.todayRecovered)} 
              total={prettyPrintStat(countryInfo.recovered)} 
            />
            
            <InfoBox 
              isRed
              active={casesType === "deaths"}
              onClick={(e) => setCasesType("deaths")}
              title="Deaths" 
              cases={prettyPrintStat(countryInfo.todayDeaths)} 
              total={prettyPrintStat(countryInfo.deaths)} 
            />

          {/* InfoBoxs */}
          {/* InfoBoxs */}
          {/* InfoBoxs */}
          </div>
          {/* Map */}
          <Map
            casesType={casesType}
            countries={mapCountries}
            center={mapCenter}
            zoom={mapZoom}
           />
      </div>

    </div>
    </ThemeProvider>
  );
}

export default App;
