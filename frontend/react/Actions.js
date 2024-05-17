
import axios from 'axios';

export const fetchImages = () => async (dispatch) => {
  try {
    const response = await axios.get('http://localhost:8000/images');
    dispatch({ type: 'SET_IMAGES', payload: response.data });
  } catch (error) {
    console.error('Error fetching images:', error);
  }
};