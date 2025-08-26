import './styles/main.scss'
import { useEffect, useState } from 'react'
import Input from './components/Input'

const App = () => {
  const [input, setInput] = useState('')
  const [data, setData] = useState({})
  const [inputCities, setInputCities] = useState([])

  const API = 'de88292d987b7864b5f666ff726de2c5'

  useEffect(() => {
    const storedCities = JSON.parse(localStorage.getItem('cities'))
    if (storedCities && storedCities.length > 0) {
      setInputCities(storedCities)
    }
  }, [])

  function fetchData(city) {
    const cityName = city || input
    const URL = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API}&units=metric`

    fetch(URL)
      .then((response) => response.json())
      .then((response) => {
        if (response.cod === 200) {
          setData(response)
          if (!inputCities.includes(cityName)) {
            const updatedCities = [...inputCities, cityName]
            setInputCities(updatedCities)
            localStorage.setItem('cities', JSON.stringify(updatedCities))
          }
        } else {
          alert('City not found!')
        }
      })
      .catch(() => alert('Error fetching data'))
  }

  function onSubmitHandler(event) {
    event.preventDefault()
    if (!input.trim()) return
    fetchData(input)
    setInput('')
  }

  return (
    <div className="container">
      <h1>{data.name || 'Enter a city'}</h1>
      {data?.main && (
        <>
          <h2>Temp: {data.main.temp} °C</h2>
          <h2>Humidity: {data.main.humidity}%</h2>
        </>
      )}

      <form onSubmit={onSubmitHandler}>
        <input
          type="text"
          placeholder="Enter your city..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button type="submit">See the weather</button>
      </form>

      {
        inputCities.length > 0 && (
          <div className="history">
            <h3>Saved cities:</h3>
            <ul>
              {inputCities.map((city, index) => (
                <li key={index} onClick={() => fetchData(city)}>
                  {city}
                </li>
              ))}
            </ul>
          </div>
        )
      }
    </div>
  )
}

export default App
