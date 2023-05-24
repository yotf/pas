import axiosInstance from '@/services/setup/api';
import ApiService from '../api.service';

const url = '/some_url';
const expected = {
  success: true,
};

describe('api service', () => {
  it('get method', async () => {
    const getSpy = vi.spyOn(axiosInstance, 'get').mockResolvedValueOnce({
      data: expected,
    });

    const result = await ApiService.get(url);

    expect(getSpy).toHaveBeenCalled();
    expect(result.data).toEqual(expected);
  });

  it('get by id method', async () => {
    const getSpy = vi.spyOn(axiosInstance, 'get').mockResolvedValueOnce({
      data: expected,
    });

    const result = await ApiService.getById(url, 1);

    expect(getSpy).toHaveBeenCalled();
    expect(result.data).toEqual(expected);
  });

  it('put method', async () => {
    const putSpy = vi.spyOn(axiosInstance, 'put').mockResolvedValueOnce({
      data: expected,
    });

    const form = {
      name: 'test name',
    };

    const result = await ApiService.put(url, 1, form);

    expect(putSpy).toHaveBeenCalled();
    expect(result.data).toEqual(expected);
  });

  it('post method', async () => {
    const postSpy = vi.spyOn(axiosInstance, 'post').mockResolvedValueOnce({
      data: expected,
    });

    const form = {
      name: 'test name',
    };

    const result = await ApiService.post(url, form);

    expect(postSpy).toHaveBeenCalled();
    expect(result.data).toEqual(expected);
  });

  it('delete method', async () => {
    const deleteSpy = vi.spyOn(axiosInstance, 'delete').mockResolvedValueOnce({
      data: expected,
    });

    const result = await ApiService.delete(url, 1);

    expect(deleteSpy).toHaveBeenCalled();
    expect(result.data).toEqual(expected);
  });
});
