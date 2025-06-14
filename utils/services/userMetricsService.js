import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

export const userMetricsService = {
  async fetchUserMetrics() {
    try {
      const response = await axios.get(`${API_URL}/metrics`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error fetching user metrics');
    }
  },

  async updateUserMetrics(metricsData) {
    try {
      const response = await axios.put(`${API_URL}/metrics`, metricsData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error updating user metrics');
    }
  },

  calculateIMC(weight, height) {
    if (!weight || !height) return 0;
    const heightInMeters = height / 100;
    return weight / (heightInMeters * heightInMeters);
  },

  getImcCategory(imc) {
    if (imc < 18.5) return 'Bajo peso';
    if (imc < 25) return 'Peso normal';
    if (imc < 30) return 'Sobrepeso';
    return 'Obesidad';
  },

  getImcColor(imc) {
    if (imc < 18.5) return '#F59E0B';
    if (imc < 25) return '#10B981';
    if (imc < 30) return '#F97316';
    return '#EF4444';
  }
}; 