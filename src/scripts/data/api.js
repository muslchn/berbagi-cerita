import CONFIG from '../config';

const ENDPOINTS = {
  STORIES: `${CONFIG.BASE_URL}/stories`,
  LOGIN: `${CONFIG.BASE_URL}/login`,
  REGISTER: `${CONFIG.BASE_URL}/register`,
};

export async function getStories(page = 1, location = false) {
  const url = location 
    ? `${ENDPOINTS.STORIES}?page=${page}&location=true`
    : `${ENDPOINTS.STORIES}?page=${page}`;
    
  const fetchResponse = await fetch(url);
  return await fetchResponse.json();
}

export async function addStory({ description, lat, lon, photo }) {
  const formData = new FormData();
  formData.append('description', description);
  formData.append('lat', lat);
  formData.append('lon', lon);
  formData.append('photo', photo);

  const token = localStorage.getItem('token');
  
  const response = await fetch(ENDPOINTS.STORIES, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: formData,
  });
  
  return await response.json();
}

export async function register({ name, email, password }) {
  const response = await fetch(ENDPOINTS.REGISTER, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, email, password }),
  });
  
  return await response.json();
}

export async function login({ email, password }) {
  const response = await fetch(ENDPOINTS.LOGIN, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });
  
  return await response.json();
}
