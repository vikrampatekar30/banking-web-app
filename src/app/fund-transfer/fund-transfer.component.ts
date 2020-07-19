import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AccountDTO, CustomerDTO, FundTransferDTO } from '../interfaces';
import { AccountService } from '../services/account.service';
import { CustomerService } from '../services/customer.service';
import { finalize } from 'rxjs/operators';
import { FundTransferService } from '../services/fund-transfer.service';

@Component({
  selector: 'app-fund-transfer',
  templateUrl: './fund-transfer.component.html',
  styleUrls: ['./fund-transfer.component.css']
})
export class FundTransferComponent implements OnInit {

  form: FormGroup;
  isError: boolean = false;
  isResultFetched: boolean = false;
  isAmountValid: boolean = true;
  isFromAccountValid: boolean = true;
  isToAccountValid: boolean = true;
  isCustomerValid: boolean = true;
  accounts: Array<AccountDTO> =[];
  customers: Array<CustomerDTO> =[];
  resultMessage: string;
  selectedFromAccountId: number;

  constructor(private fundTransferService: FundTransferService, private accountService: AccountService, private customerService: CustomerService) {
    this.listCustomers();
  }

  ngOnInit(): void {
    this.form = new FormGroup({
      'customer': new FormControl(null, Validators.required),
      'fromAccount': new FormControl(null, Validators.required),
      'toAccount': new FormControl(null, Validators.required),
      'amount': new FormControl(null, Validators.required)
    });
    this.form.valueChanges.subscribe(() => this.isResultFetched = false);
  }

  onSubmit() {
    if(this.form.valid) {
      let fundTransferDTO: FundTransferDTO = {
        'customerId' : this.form.get('customer').value,
        'fromAccountId' : this.form.get('fromAccount').value,
        'toAccountId' : this.form.get('toAccount').value,
        'amount' : this.form.get('amount').value,
      };
      this.fundTransferService.transfer(fundTransferDTO).subscribe(response => {
        this.form.reset();
        this.isResultFetched = true;
        this.isError = response.isError;
        this.resultMessage = response.message;
      });
    } else {
      this.markNotValid();  
    }
  }

  markNotValid() {
    this.isFromAccountValid = false;
    this.isToAccountValid = false;
    this.isAmountValid = false;
    this.isCustomerValid = false;
  }

  listCustomerAccounts(customerId: number) {
    this.accountService.listCustomerAccounts(customerId).subscribe(response => {
      this.accounts = response
      // for(let account of this.accounts) {
      //   for(let customer of this.customers) {
      //     if(account.customerId === customer.id) {
      //       account.customerName = customer.name
      //       break;
      //     }
      //   }
      // }
    });
  }

  onCustomerChange(event) {
    let customerId = event.target.value;
    this.listCustomerAccounts(customerId);
  }

  onFromAccountChange(event) {
    this.selectedFromAccountId = event.target.value;
  }

  listCustomers() {
    this.customerService.list().pipe(finalize(()=> {
      for(let customer of this.customers) {
        customer.name = customer.firstName + " " + customer.lastName
      }
      //this.listCustomerAccounts();
    })).subscribe(response => this.customers = response);
  }
}
