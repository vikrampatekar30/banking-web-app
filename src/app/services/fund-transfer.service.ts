import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { FundTransferDTO } from "../interfaces";
import { map } from 'rxjs/operators';

@Injectable({
    providedIn : "root"
})
export class FundTransferService {

    baseURL:string = "http://localhost:8443/api/fundtransfer/";
    constructor(private http:HttpClient) {

    }

    transfer(fundTransferDTO: FundTransferDTO) : Observable<FundTransferDTO> {
        return this.http.post(this.baseURL + "transfer", fundTransferDTO)
        .pipe(
            map(
                (response : FundTransferDTO) => response
            )
        );
    }
} 