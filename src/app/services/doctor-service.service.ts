import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DoctorServiceService {

  constructor(private _http:HttpClient) { }

  readonly _url:string = 'https://localhost:7038/api/Doctors/'

  addDoctor(data:any):Observable<any>{
    return this._http.post(this._url,data)
  }
  getDoctors():Observable<any>{
    return this._http.get(this._url)
  }
  deleteDoctor(id:number):Observable<any>{
    return this._http.delete(this._url+id)
  }
  updateDoctor(id:number,data:any):Observable<any>{
    return this._http.put(this._url+id, data)
  }
  updateAdress(id:number, data:any):Observable<any>{
    return this._http.put('https://localhost:7038/api/Adresses/'+id, data)
  }
  getAdressByDoctorId(id:number):Observable<any>{
    return this._http.get('https://localhost:7038/api/Adresses/'+id)
  }
}
