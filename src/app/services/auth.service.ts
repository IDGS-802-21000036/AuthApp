import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { map, Observable } from 'rxjs';
import { AuthResponse } from '../interfaces/auth-response';
import { LoginRequest } from '../interfaces/login-request';
import { HttpClient } from '@angular/common/http';
import { jwtDecode } from 'jwt-decode';
import { RegisterRequest } from '../interfaces/register-request';
import { UserDetail } from '../interfaces/user-detail';
import { ResetPasswordRequest } from '../interfaces/reset-password-request';
import { ChangePasswordRequest } from '../interfaces/change-password-request';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  apiUrl: string = environment.apiUrl;
  private userKey = 'user';

  constructor(private http: HttpClient) { }


  login(data: LoginRequest):Observable<AuthResponse>{
    return this.http.post<AuthResponse>(`${this.apiUrl}Account/login`, data).pipe(
      map((response: AuthResponse) => {
        if (response.isSuccess) {
          localStorage.setItem(this.userKey, response.token);
        }
        return response;
      })
    );
  }

  register(data: RegisterRequest):Observable<AuthResponse>{
    return this.http.post<AuthResponse>(`${this.apiUrl}Account/register`, data).pipe(
      map((response: AuthResponse) => {
        if (response.isSuccess) {
          localStorage.setItem(this.userKey, response.token);
        }
        return response;
      })
    );
  }

  getDetails = (): Observable<UserDetail> => 
    this.http.get<UserDetail>(`${this.apiUrl}Account/detail`);

  forgotPassword = (email: string): Observable<AuthResponse> =>
    this.http.post<AuthResponse>(`${this.apiUrl}Account/forgot-password`, {
      email,
    });

  changePassword = (data: ChangePasswordRequest): Observable<AuthResponse> =>
      this.http.post<AuthResponse>(`${this.apiUrl}Account/change-password`, data);

  resetPassword = (data: ResetPasswordRequest): Observable<AuthResponse> =>
    this.http.post<AuthResponse>(`${this.apiUrl}Account/reset-password`, data);

  getUserDetail = () => {
    const token = this.getToken();
    if (!token)
      return null;
    const decoded:any = jwtDecode(token);
    const userDetail = {
      id : decoded.nameid,
      fullName: decoded.name,
      email: decoded.email,
      roles: decoded.role || []
    };
    return userDetail;
  }

  getRoles = (): string[] | null => {
    const token = this.getToken();
    if (!token) return null;

    const decodedToken: any = jwtDecode(token);
    return decodedToken.role || null;
  };

  isLoggedIn = (): boolean => {
    const token = this.getToken();
    if(!token)
      return false;
    
    return !this.isTokenExpired();
  }

  private isTokenExpired(){
    const token = this.getToken();
    if(!token)
      return true;
    const decoded = jwtDecode(token);
    const isTokenExpired = Date.now() >= decoded['exp']! * 1000;
    if (isTokenExpired)
      this.logout();
    return isTokenExpired;

  }

  logout = (): void => {
    localStorage.removeItem(this.userKey);
  }

  getAll = (): Observable<UserDetail[]> =>
    this.http.get<UserDetail[]>(`${this.apiUrl}Account`);

  refreshToken = (data: {
    email: string;
    token: string;
    refreshToken: string;
  }): Observable<AuthResponse> =>
    this.http.post<AuthResponse>(`${this.apiUrl}account/refresh-token`, data);


  getToken = (): string | null => localStorage.getItem(this.userKey) || null;

  getRefreshToken = (): string | null => {
    const user = localStorage.getItem(this.userKey);
    if (!user) return null;
    const userDetail: AuthResponse = JSON.parse(user);
    return userDetail.refreshToken;
  };
}
