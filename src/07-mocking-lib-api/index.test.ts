// Uncomment the code below and write your tests
import axios from 'axios';
import { throttledGetDataFromApi } from './index';

describe('throttledGetDataFromApi', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  jest.mock('axios');

  test('should create instance with provided base url', async () => {
    const axiosClientSpy = jest.spyOn(axios, 'create');
    const baseURL = {
      baseURL: 'https://jsonplaceholder.typicode.com',
    };

    await throttledGetDataFromApi('/users');

    jest.runAllTimers();
    expect(axiosClientSpy).toHaveBeenCalledWith(baseURL);
    axiosClientSpy.mockClear();
  });

  test('should perform request to correct provided url', async () => {
    const axiosClientGetSpy = jest.spyOn(axios.Axios.prototype, 'get');

    await throttledGetDataFromApi('/users');

    jest.runAllTimers();
    expect(axiosClientGetSpy).toHaveBeenCalledTimes(1);
    axiosClientGetSpy.mockClear();
  });

  test('should return response data', async () => {
    const usersData = {
      user1: {
        id: 1,
        name: 'Tom',
      },
      user2: {
        id: 2,
        name: 'Jerry',
      },
    };
    const axiosClientGetSpy = jest
      .spyOn(axios.Axios.prototype, 'get')
      .mockResolvedValue({ data: usersData });

    expect(await throttledGetDataFromApi('/users')).toEqual(usersData);

    axiosClientGetSpy.mockClear();
  });
});
