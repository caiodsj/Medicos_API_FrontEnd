import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class CepCorreiosService {

  constructor(private _http: HttpClient) { }

  readonly _url:string = 'https://h-apigateway.conectagov.estaleiro.serpro.gov.br/api-cep/v1/consulta/cep/'

  completeAddress(cep: string): Observable<any> {
    return this._http.get(this._url + cep);
  }
}