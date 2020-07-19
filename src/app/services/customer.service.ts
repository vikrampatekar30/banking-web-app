import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { CustomerDTO, CustomerListDTO } from "../interfaces";
import { map } from 'rxjs/operators';

@Injectable({
    providedIn : "root"
})
export class CustomerService {

    baseURL:string = "http://localhost:8443/api/customer/";
    constructor(private http:HttpClient) {

    }

    list() : Observable<Array<CustomerDTO>> {
        return this.http.get(this.baseURL + "list")
        .pipe(
            map(
                (response : CustomerListDTO) => { 
                    return response && response.result ? response.result : []
                }
            )
        );
    }

    save(customerDTO: CustomerDTO) : Observable<CustomerDTO> {
        return this.http.put(this.baseURL + "save", customerDTO).pipe(map((response: CustomerDTO) => response));
    }

    delete(id: number): Observable<any> {
        return this.http.delete(this.baseURL + id);
    }
} 