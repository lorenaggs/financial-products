import { TestBed } from '@angular/core/testing';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { CommonHttpService } from './common-http.service';
import { of, throwError } from 'rxjs';

describe('CommonHttpService', () => {
  let service: CommonHttpService;
  let httpClientMock: jest.Mocked<HttpClient>;

  // Datos de prueba
  const testUrl = 'https://api.test.com/data';
  const testBody = { name: 'test' };
  const testOptions = { headers: { 'Content-Type': 'application/json' } };
  const testResponse = { id: 1, name: 'test response' };
  const testError = new HttpErrorResponse({
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

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('GET Method', () => {
    it('should make a successful GET request without options', (done) => {
      httpClientMock.get.mockReturnValue(of(testResponse));

      service.get(testUrl).subscribe({
        next: (response) => {
          expect(response).toEqual(testResponse);
          expect(httpClientMock.get).toHaveBeenCalledWith(testUrl, undefined);
          done();
        }
      });
    });

    it('should make a successful GET request with options', (done) => {
      httpClientMock.get.mockReturnValue(of(testResponse));

      service.get(testUrl, testOptions).subscribe({
        next: (response) => {
          expect(response).toEqual(testResponse);
          expect(httpClientMock.get).toHaveBeenCalledWith(testUrl, testOptions);
          done();
        }
      });
    });

    it('should handle GET request error', (done) => {
      httpClientMock.get.mockReturnValue(throwError(() => testError));
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      service.get(testUrl).subscribe({
        error: (error) => {
          expect(error).toBe(testError);
          expect(consoleSpy).toHaveBeenCalledWith('Error en la petición HTTP:', testError);
          consoleSpy.mockRestore();
          done();
        }
      });
    });
  });

  describe('POST Method', () => {
    it('should make a successful POST request without options', (done) => {
      httpClientMock.post.mockReturnValue(of(testResponse));

      service.post(testUrl, testBody).subscribe({
        next: (response) => {
          expect(response).toEqual(testResponse);
          expect(httpClientMock.post).toHaveBeenCalledWith(testUrl, testBody, undefined);
          done();
        }
      });
    });

    it('should make a successful POST request with options', (done) => {
      httpClientMock.post.mockReturnValue(of(testResponse));

      service.post(testUrl, testBody, testOptions).subscribe({
        next: (response) => {
          expect(response).toEqual(testResponse);
          expect(httpClientMock.post).toHaveBeenCalledWith(testUrl, testBody, testOptions);
          done();
        }
      });
    });

    it('should handle POST request error', (done) => {
      httpClientMock.post.mockReturnValue(throwError(() => testError));
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      service.post(testUrl, testBody).subscribe({
        error: (error) => {
          expect(error).toBe(testError);
          expect(consoleSpy).toHaveBeenCalledWith('Error en la petición HTTP:', testError);
          consoleSpy.mockRestore();
          done();
        }
      });
    });
  });

  describe('PUT Method', () => {
    it('should make a successful PUT request without options', (done) => {
      httpClientMock.put.mockReturnValue(of(testResponse));

      service.put(testUrl, testBody).subscribe({
        next: (response) => {
          expect(response).toEqual(testResponse);
          expect(httpClientMock.put).toHaveBeenCalledWith(testUrl, testBody, undefined);
          done();
        }
      });
    });

    it('should make a successful PUT request with options', (done) => {
      httpClientMock.put.mockReturnValue(of(testResponse));

      service.put(testUrl, testBody, testOptions).subscribe({
        next: (response) => {
          expect(response).toEqual(testResponse);
          expect(httpClientMock.put).toHaveBeenCalledWith(testUrl, testBody, testOptions);
          done();
        }
      });
    });

    it('should handle PUT request error', (done) => {
      httpClientMock.put.mockReturnValue(throwError(() => testError));
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      service.put(testUrl, testBody).subscribe({
        error: (error) => {
          expect(error).toBe(testError);
          expect(consoleSpy).toHaveBeenCalledWith('Error en la petición HTTP:', testError);
          consoleSpy.mockRestore();
          done();
        }
      });
    });
  });

  describe('DELETE Method', () => {
    it('should make a successful DELETE request without options', (done) => {
      httpClientMock.delete.mockReturnValue(of(testResponse));

      service.delete(testUrl).subscribe({
        next: (response) => {
          expect(response).toEqual(testResponse);
          expect(httpClientMock.delete).toHaveBeenCalledWith(testUrl, undefined);
          done();
        }
      });
    });

    it('should make a successful DELETE request with options', (done) => {
      httpClientMock.delete.mockReturnValue(of(testResponse));

      service.delete(testUrl, testOptions).subscribe({
        next: (response) => {
          expect(response).toEqual(testResponse);
          expect(httpClientMock.delete).toHaveBeenCalledWith(testUrl, testOptions);
          done();
        }
      });
    });

    it('should handle DELETE request error', (done) => {
      httpClientMock.delete.mockReturnValue(throwError(() => testError));
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      service.delete(testUrl).subscribe({
        error: (error) => {
          expect(error).toBe(testError);
          expect(consoleSpy).toHaveBeenCalledWith('Error en la petición HTTP:', testError);
          consoleSpy.mockRestore();
          done();
        }
      });
    });
  });

  describe('Error Handling', () => {
    it('should properly handle and transform HTTP errors', (done) => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      // Forzar un error en cualquier método para probar el manejo de errores
      httpClientMock.get.mockReturnValue(throwError(() => testError));

      service.get(testUrl).subscribe({
        error: (error) => {
          expect(error).toBe(testError);
          expect(consoleSpy).toHaveBeenCalledWith('Error en la petición HTTP:', testError);
          consoleSpy.mockRestore();
          done();
        }
      });
    });
  });
});
