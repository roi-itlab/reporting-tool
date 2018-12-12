import api from '@/services/api'
export default {
  fetchQuery (config) {
    return api().get('?config=' + config)
  }
}
