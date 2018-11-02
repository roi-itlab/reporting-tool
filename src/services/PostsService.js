import api from '@/services/api'
export default {
  fetchSQL () {
    return api().get('sql')
  },
  fetchCsv () {
    return api().get('csv')
  },
  fetchXml () {
    return api().get('xml')
  }
}
