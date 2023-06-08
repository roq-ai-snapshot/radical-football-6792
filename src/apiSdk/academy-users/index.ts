import axios from 'axios';
import queryString from 'query-string';
import { AcademyUserInterface } from 'interfaces/academy-user';
import { GetQueryInterface } from '../../interfaces';

export const getAcademyUsers = async (query?: GetQueryInterface) => {
  const response = await axios.get(`/api/academy-users${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createAcademyUser = async (academyUser: AcademyUserInterface) => {
  const response = await axios.post('/api/academy-users', academyUser);
  return response.data;
};

export const updateAcademyUserById = async (id: string, academyUser: AcademyUserInterface) => {
  const response = await axios.put(`/api/academy-users/${id}`, academyUser);
  return response.data;
};

export const getAcademyUserById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/academy-users/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteAcademyUserById = async (id: string) => {
  const response = await axios.delete(`/api/academy-users/${id}`);
  return response.data;
};
