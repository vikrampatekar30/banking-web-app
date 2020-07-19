import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { AccountDTO, AccountListDTO } from "../interfaces";
import { map } from 'rxjs/operators';

@Injectable({
    providedIn : "root"
})
export class AccountService {

    baseURL:string = "http://localhost:8443/api/account/";
    constructor(private http:HttpClient) {

    }

    list() : Observable<Array<AccountDTO>> {
        return this.http.get(this.baseURL + "list")
        .pipe(
            map(
                (response : AccountListDTO) => { 
                    return response && response.result ? response.result : []
                }
            )
        );
    }

    save(accountDTO: AccountDTO) : Observable<AccountDTO> {
        return this.http.put(this.baseURL + "save", accountDTO).pipe(map((response: AccountDTO) => response));
    }

    delete(id: number): Observable<any> {
        return this.http.delete(this.baseURL + id);
    }

    listCustomerAccounts(customerId: number) : Observable<Array<AccountDTO>> {
        return this.http.get(this.baseURL + "listCustomerAccounts/" + customerId)
        .pipe(
            map(
                (response: AccountListDTO) => {
                    return response && response.result ? response.result : []
                }
            )
        );
    }
} 