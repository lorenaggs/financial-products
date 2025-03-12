import { TestBed } from '@angular/core/testing';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { CommonHttpService } from './common-http.service';
import { of, throwError } from 'rxjs';

describe('CommonHttpService', () => {
  let service: CommonHttpService;
  let httpClientMock: jest.Mocked<HttpClient>;

  // Datos de prueba
  const mockUrl = 'https://api.test.com/endpoint';
  const mockData = { id: 1, name: 'Test' };
  const mockOptions = { headers: { 'Content-Type': 'application/json' } };
  const mockError = new HttpErrorResponse({
    error: 'test error',
    status: 404,
    statusText: 'Not Found'
  });

  beforeEach(() => {
    // Crear mock del HttpClient
    httpClientMock = {
      get: jest.fn(),
      post: jest.fn(),
      put: jest.fn(),
      delete: jest.fn()
    } as any;

    TestBed.configureTestingModule({
      providers: [
        CommonHttpService,
        { provide: HttpClient, useValue: httpClientMock }
      ]
    });

    service = TestBed.inject(CommonHttpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('GET requests', () => {
    it('should make a successful GET request', (done) => {
      httpClientMock.get.mockReturnValue(of(mockData));

      service.get(mockUrl).subscribe({
        next: (response) => {
          expect(response).toEqual(mockData);
          expect(httpClientMock.get).toHaveBeenCalledWith(mockUrl, undefined);
          done();
        }
      });
    });

    it('should make a GET request with options', (done) => {
      httpClientMock.get.mockReturnValue(of(mockData));

      service.get(mockUrl, mockOptions).subscribe({
        next: (response) => {
          expect(response).toEqual(mockData);
          expect(httpClientMock.get).toHaveBeenCalledWith(mockUrl, mockOptions);
          done();
        }
      });
    });

    it('should handle GET request error', (done) => {
      httpClientMock.get.mockReturnValue(throwError(() => mockError));
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      service.get(mockUrl).subscribe({
        error: (error) => {
          expect(error).toBe(mockError);
          expect(consoleSpy).toHaveBeenCalled();
          consoleSpy.mockRestore();
          done();
        }
      });
    });
  });

  describe('POST requests', () => {
    it('should make a successful POST request', (done) => {
      httpClientMock.post.mockReturnValue(of(mockData));

      service.post(mockUrl, mockData).subscribe({
        next: (response) => {
          expect(response).toEqual(mockData);
          expect(httpClientMock.post).toHaveBeenCalledWith(mockUrl, mockData, undefined);
          done();
        }
      });
    });

    it('should make a POST request with options', (done) => {
      httpClientMock.post.mockReturnValue(of(mockData));

      service.post(mockUrl, mockData, mockOptions).subscribe({
        next: (response) => {
          expect(response).toEqual(mockData);
          expect(httpClientMock.post).toHaveBeenCalledWith(mockUrl, mockData, mockOptions);
          done();
        }
      });
    });

    it('should handle POST request error', (done) => {
      httpClientMock.post.mockReturnValue(throwError(() => mockError));
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      service.post(mockUrl, mockData).subscribe({
        error: (error) => {
          expect(error).toBe(mockError);
          expect(consoleSpy).toHaveBeenCalled();
          consoleSpy.mockRestore();
          done();
        }
      });
    });
  });

  describe('PUT requests', () => {
    it('should make a successful PUT request', (done) => {
      httpClientMock.put.mockReturnValue(of(mockData));

      service.put(mockUrl, mockData).subscribe({
        next: (response) => {
          expect(response).toEqual(mockData);
          expect(httpClientMock.put).toHaveBeenCalledWith(mockUrl, mockData, undefined);
          done();
        }
      });
    });

    it('should make a PUT request with options', (done) => {
      httpClientMock.put.mockReturnValue(of(mockData));

      service.put(mockUrl, mockData, mockOptions).subscribe({
        next: (response) => {
          expect(response).toEqual(mockData);
          expect(httpClientMock.put).toHaveBeenCalledWith(mockUrl, mockData, mockOptions);
          done();
        }
      });
    });

    it('should handle PUT request error', (done) => {
      httpClientMock.put.mockReturnValue(throwError(() => mockError));
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      service.put(mockUrl, mockData).subscribe({
        error: (error) => {
          expect(error).toBe(mockError);
          expect(consoleSpy).toHaveBeenCalled();
          consoleSpy.mockRestore();
          done();
        }
      });
    });
  });

  describe('DELETE requests', () => {
    it('should make a successful DELETE request', (done) => {
      httpClientMock.delete.mockReturnValue(of(mockData));

      service.delete(mockUrl).subscribe({
        next: (response) => {
          expect(response).toEqual(mockData);
          expect(httpClientMock.delete).toHaveBeenCalledWith(mockUrl, undefined);
          done();
        }
      });
    });

    it('should make a DELETE request with options', (done) => {
      httpClientMock.delete.mockReturnValue(of(mockData));

      service.delete(mockUrl, mockOptions).subscribe({
        next: (response) => {
          expect(response).toEqual(mockData);
          expect(httpClientMock.delete).toHaveBeenCalledWith(mockUrl, mockOptions);
          done();
        }
      });
    });

    it('should handle DELETE request error', (done) => {
      httpClientMock.delete.mockReturnValue(throwError(() => mockError));
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      service.delete(mockUrl).subscribe({
        error: (error) => {
          expect(error).toBe(mockError);
          expect(consoleSpy).toHaveBeenCalled();
          consoleSpy.mockRestore();
          done();
        }
      });
    });
  });

  describe('Error handling', () => {
    it('should log error to console and return error observable', (done) => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      // Acceder al método privado handleError a través de cualquier método público
      httpClientMock.get.mockReturnValue(throwError(() => mockError));

      service.get(mockUrl).subscribe({
        error: (error) => {
          expect(error).toBe(mockError);
          expect(consoleSpy).toHaveBeenCalledWith('Error en la petición HTTP:', mockError);
          consoleSpy.mockRestore();
          done();
        }
      });
    });
  });
});
