import './HomePage.css'
import axios from 'axios'
import { useState } from 'react'

const apiKey = "9f049588121d9ab5edba6bc86d738feb"

const HomePage = () => {
  const [inputVal, setInputVal] = useState("")
  const [cities, setCities] = useState([])
  const [errorMsg, setErrorMsg] = useState("")

  const handleSubmit = e => {
  e.preventDefault()

  if (!inputVal) {
    setErrorMsg("Please enter a city name")
    return;
  }

  axios.get(`${process.env.REACT_APP_API_URL}/weather?q=${inputVal}&appid=${apiKey}&units=metric`)
    .then(response => {
      const { main, name, sys, weather } = response.data
      const icon = `https://s3-us-west-2.amazonaws.com/s.cdpn.io/162656/${weather[0]["icon"]}.svg`

      const newCity = {
        name,
        country: sys.country,
        temp: Math.round(main.temp),
        feels_like: Math.round(main.feels_like),
        temp_max: Math.round(main.temp_max),
        temp_min: Math.round(main.temp_min),
        description: weather[0]["description"],
        icon
      };

      const cityExists = cities.some(city => city.name === newCity.name)

      if (cityExists) {
        return setErrorMsg(`${newCity.name} is already added 😉`)
      }

      setCities(prevCities => [...prevCities, newCity])
      setInputVal("")
      setErrorMsg("")
    })
    .catch(() => {
      setErrorMsg("Type a valid city name 😉")
    })
}

  const handleInputChange = e => {
    setInputVal(e.target.value)
  }

  return (
    <div className='HomePage'>
      <section className="top-banner">
        <div className="container">
          <h1 className="heading">Current Weather</h1>
          <form onSubmit={handleSubmit}>
            <input 
              type="text" 
              placeholder="Search for a city     🌎"  
              value={inputVal} 
              onChange={handleInputChange} 
              className='search' 
              style={{height: "50px"}}
            />
            <button 
              type="submit" 
              className="btn btn-info">
              CHECK WEATHER
            </button>
            <span className="msg">{errorMsg}</span>
          </form>
        </div>
      </section>
      <section className="ajax-section">
        <div className="container">
          <ul className="cities">
            {cities.length > 0 && cities.map(city => (
              <li key={city.name}>
                <div className="card single-card" style={{width: "14rem", height: "400px"}}>
                  <img className="city-icon" src={city.icon} alt={city.description} style={{width: "75px"}}/>
                  <div className="card-body single-card-body">
                    <h5 className="city-name">
                      <span className="card-title name-city">{city.name}</span>
                      <sup>{city.country}</sup>
                    </h5>
                    <div className="city-temp">{city.temp}<sup>°C</sup></div>
                    <figcaption className='name-city'>{city.description}</figcaption>
                    <p className="feelsLike">Feels Like: {city.feels_like} <sup>°C</sup></p>
                    <div className="min-max">
                      <p className="feelsLike">Max: {city.temp_max} <sup>°C</sup></p>
                      <p className="feelsLike">Min: {city.temp_min} <sup>°C</sup></p>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <footer className="page-footer">
        <div className="container">
          <small>Created by <a href="https://github.com/weslleypmfortunato" target="_blank" rel='noreferrer'>WPMF</a></small>
        </div>
      </footer>
    </div>
  )
}

 
export default HomePage;