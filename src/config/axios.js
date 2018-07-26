import axios from 'axios'

const API_URL = process.env.API_URL || 'http://localhost:3000'
// const API_URL = process.env.API_URL || 'https://api.placewise.com'

export default axios.create({
  baseURL: API_URL
})
