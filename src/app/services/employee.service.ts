import { HttpClient, HttpEvent, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Employee } from '../modele/employee';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  baseurlemp :string = environment.baseurl +"/employee"
  constructor(private http:HttpClient) { }
  saveemployee(emp:Employee):Observable<Employee>{
    return  this.http.post(`${this.baseurlemp}/save`, emp)
    .pipe(
      map((response:any) => response as Employee)
    );
  }
  getList(): Observable<Employee[]> {
    return this.http.get<Employee[]>(`${this.baseurlemp}/lister`)
    .pipe(
      map((response:any) => response as Employee[])
    );
    
  }
  findEmpById(id: number): Observable<Employee> {
    return this.http.get(`${this.baseurlemp}/listerbyid/${id}`).pipe(
      map((response:any) => response as Employee)
    );
  }

  uploadEmpImage(id:number,image:File): Observable<HttpEvent<{}>> {
    const formData:FormData=new FormData();
    formData.append(`image`,image)
    let url=this.baseurlemp+"/uploadEmployeeImage/"+id;
    const req=new HttpRequest('POST',url,formData,{reportProgress:true,responseType:'text'})
    return this.http.request(req);
  }
  deleteEmploye(id: any): Observable<any> {
    return this.http.delete(`${this.baseurlemp}/delete/${id}`,{ responseType: 'text' });
  }
 
  }

