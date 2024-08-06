import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Role } from '../interfaces/role';
import { RoleCreateRequest } from '../interfaces/role-create-request';

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  apiUrl: string = environment.apiUrl;
  constructor(private http: HttpClient) { }

  getRoles = (): Observable<Role[]> => {
    return this.http.get<Role[]>(`${this.apiUrl}Roles`);
  }

  createRole = (role: RoleCreateRequest): Observable<{ message: string }> =>
    this.http.post<{ message: string }>(`${this.apiUrl}Roles`, role);

  delete = (id: string): Observable<{ message: string }> =>
    this.http.delete<{ message: string }>(`${this.apiUrl}Roles/${id}`);

  assignRole = (
    userId: string,
    roleId: string
  ): Observable<{ message: string }> =>
    this.http.post<{ message: string }>(`${this.apiUrl}Roles/assign`, {
      userId,
      roleId,
  });
}
