import axios from 'axios'
export default () => {
  return axios.create({
    baseURL: 'http://localhost:8090?config=configs/pie_config_2.json'
  })
}
