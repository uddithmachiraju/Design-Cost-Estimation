/**
 * Estimation Service
 * This module handles all API interactions related to cost estimation.
 * Keeping API logic separate from UI components for better maintainability.
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

export const estimationService = {
  /**
   * Fetch a quick cost estimate for a design element.
   * @param {Object} data - Element details (type, specs, quantity)
   */
  async getEstimate(data) {
    console.log('API CALL: POST /estimate/quick', data);
    
    // Simulate API call for demonstration
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          estimatedCost: 1250.00,
          currency: 'USD',
          confidence: 0.95,
          breakdown: {
            material: 800,
            labor: 300,
            overhead: 150
          }
        });
      }, 800);
    });

    /* 
    // Production implementation:
    const response = await fetch(`${API_BASE_URL}/estimate/quick`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to fetch estimate');
    return response.json();
    */
  },

  /**
   * Fetch details for specific mechanical categories (e.g., Motors)
   */
  async getCategories() {
    console.log('API CALL: GET /categories');
    return ['Motors', 'Pumps', 'Valves', 'Sensors', 'Mechanical Links'];
  },

  /**
   * Fetch all estimations for the authenticated user
   */
  async getAllEstimations() {
    const token = localStorage.getItem('access_token');
    // Adjust base URL if it contains /v1 since the route is /api/estimations
    const baseUrl = API_BASE_URL.replace('/v1', '');
    const response = await fetch(`${baseUrl}/estimations`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : ''
      }
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || 'Failed to fetch estimations');
    }

    return response.json();
  },

  /**
   * Create a new estimation request
   * @param {Object} data - Contains component_name, material, process
   */
  async createEstimation(data) {
    const token = localStorage.getItem('access_token');
    const baseUrl = API_BASE_URL.replace('/v1', '');
    const response = await fetch(`${baseUrl}/estimations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : ''
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || 'Failed to create estimation');
    }

    return response.json();
  },

  /**
   * Get a presigned URL for uploading a design file
   * @param {string} estimationId - The UUID of the estimation
   * @param {string} filename - The name of the file
   * @param {string} contentType - The MIME type of the file
   */
  async getPresignedUrl(estimationId, filename, contentType) {
    const token = localStorage.getItem('access_token');
    const baseUrl = API_BASE_URL.replace('/v1', '');
    const response = await fetch(`${baseUrl}/upload-url`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : ''
      },
      body: JSON.stringify({ estimation_id: estimationId, filename, content_type: contentType })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || 'Failed to generate upload URL');
    }

    return response.json();
  },

  /**
   * Uploads a file directly to S3 using a presigned URL
   * @param {string} presignedUrl - The S3 presigned URL
   * @param {File} file - The file object to upload
   */
  async uploadFileToS3(presignedUrl, file) {
    console.log('Uploading file to S3...', presignedUrl);
    // Convert to ArrayBuffer to prevent browser from injecting dynamic Content-Type
    // which breaks AWS Signature verification if it wasn't signed for a specific type!
    const buffer = await file.arrayBuffer();

    const response = await fetch(presignedUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': file.type
      },
      body: buffer
    });

    if (!response.ok) {
      throw new Error('Failed to upload file to S3');
    }

    return true;
  }
};
