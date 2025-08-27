import './styles/main.scss'
import { useEffect, useState } from 'react'
import Input from './components/Input'
import Button from './components/Button'

const App = () => {
  const [input, setInput] = useState('')
  const [data, setData] = useState({})
  const [inputCities, setInputCities] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const API = 'de88292d987b7864b5f666ff726de2c5'

  useEffect(() => {
    const storedCities = JSON.parse(localStorage.getItem('cities')) || []
    setInputCities(storedCities)

    if (storedCities.length > 0) {
      fetchData(storedCities[0])
    } else if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          fetchDataByCoords(latitude, longitude)
        },
        () => {
          fetchData('Madrid')
        }
      )
    } else {
      fetchData('Madrid')
    }
  }, [])

  const fetchData = async (city) => {
    const cityName = city || input
    const URL = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API}&units=metric`

    setLoading(true)
    try {
      const response = await fetch(URL)
      const res = await response.json()

      if (res.cod === 200) {
        setData(res)
        setError('')

        setInputCities((prevCities) => {
          const filtered = prevCities.filter(
            (c) => c.toLowerCase() !== cityName.toLowerCase()
          )
          const updatedCities = [cityName, ...filtered]
          localStorage.setItem('cities', JSON.stringify(updatedCities))
          return updatedCities
        })
      } else {
        setError('City not found!')
      }
    } catch (err) {
      setError('Error fetching data')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const fetchDataByCoords = async (lat, lon) => {
    const URL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API}&units=metric`

    setLoading(true)
    try {
      const response = await fetch(URL)
      const res = await response.json()

      if (res.cod === 200) {
        setData(res)
        setError('')

        setInputCities((prevCities) => {
          const filtered = prevCities.filter(
            (c) => c.toLowerCase() !== res.name.toLowerCase()
          )
          const updatedCities = [res.name, ...filtered]
          localStorage.setItem('cities', JSON.stringify(updatedCities))
          return updatedCities
        })
      } else {
        setError('City not found!')
      }
    } catch (err) {
      setError('Error fetching data')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const onSubmitHandler = (event) => {
    event.preventDefault()
    if (!input.trim()) return
    fetchData(input)
    setInput('')
  }

  const removeCity = (cityToRemove) => {
    setInputCities((prevCities) => {
      const updatedCities = prevCities.filter(
        (c) => c.toLowerCase() !== cityToRemove.toLowerCase()
      )
      localStorage.setItem('cities', JSON.stringify(updatedCities))
      return updatedCities
    })
  }

  const { name, weather, main, coord, wind, visibility } = data

  return (
    <div className="container weather-app" aria-labelledby="weather-app">
      <h1 className="visually-hidden" id="weather-app">Your current city</h1>

      <div className="weather-app__inner">
        {/*{loading && <div className="weather-app__loading">Loading...</div>}*/}
        <div className="weather-app__wrapper">
          <h2 className="weather-app__title">
            {name || 'Weather data'}
            {weather?.[0] && <span className="weather-app__status">{weather[0].main}</span>}
          </h2>

          {weather?.[0] && (
            <img
              className="weather-app__image"
              src={`https://openweathermap.org/img/wn/${weather[0].icon}@2x.png`}
              alt={weather[0].description}
              width="80"
              height="80"
              loading="lazy"
            />
          )}
        </div>

        {main && (
          <div className="weather-app__inner-body">
            {coord && (
              <div className="weather-app__param">
                Coords:&ensp;
                <span>{coord.lon.toFixed(2)}</span>
                &ensp;:&ensp;
                <span>{coord.lat.toFixed(2)}</span>
              </div>
            )}
            <div className="weather-app__param">Temp: <span>{main.temp}</span> °C</div>
            <div className="weather-app__param">Humidity: <span>{main.humidity}</span> %</div>
            <div className="weather-app__param">Pressure: <span>{main.pressure}</span> hPa</div>
            <div className="weather-app__param">Wind: <span>{(wind.speed * 3.6).toFixed(1)}</span> km/h</div>
            <div className="weather-app__param">Visibility: <span>{visibility}</span> m</div>
          </div>
        )}

        {error && <div className="weather-app__error">{error}</div>}

        <form className="weather-app__form" onSubmit={onSubmitHandler}>
          <Input
            type="text"
            placeholder="Madrid..."
            label="Enter a city name"
            value={input}
            id="input-city"
            onChange={(e) => setInput(e.target.value)}
          />
          <Button className="button" type="submit">Get data</Button>
        </form>
      </div>

      {inputCities.length > 0 && (
        <div className="weather-app__history">
          <h2 className="weather-app__title">Recent cities:</h2>
          <ul className="weather-app__history-list">
            {inputCities.map((city) => (
              <li className="weather-app__history-item" key={city}>
                <Button className="button" type="button" onClick={() => fetchData(city)}>
                  {city}
                </Button>
                <Button className="button button--delete" type="button" onClick={() => removeCity(city)}>
                  ❌
                </Button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default App
