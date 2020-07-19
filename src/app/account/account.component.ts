import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AccountDTO, CustomerDTO } from '../interfaces';
import { AccountService } from '../services/account.service';
import { finalize } from 'rxjs/operators';
import { CustomerService } from '../services/customer.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {
  
  form: FormGroup;
  isUpdate: boolean = false;
  isAmountValid: boolean = true;
  isAccNoValid: boolean = true;
  isTypeValid: boolean = true;
  isCustomerValid: boolean = true;
  isCurrencyValid: boolean = true;
  accounts: Array<AccountDTO> =[];
  customers: Array<CustomerDTO> =[];
  accountId: number;
  accountTypes = ['Savings', 'Current', 'Money market'];
  currencyCodes = ['USD', 'INR'];

  constructor(private accountService: AccountService, private customerService: CustomerService) {
    this.listCustomers();
  }

  ngOnInit(): void {
    this.form = new FormGroup({
      'accNo': new FormControl(null, Validators.required),
      'type': new FormControl(null, Validators.required),
      'amount': new FormControl(null, Validators.required),
      'customer': new FormControl(null, Validators.required),
      'currency': new FormControl(null, Validators.required)
    });
  }

  onSubmit() {
    if(this.form.valid) {
      const accountDTO:AccountDTO = {
        'accNo': this.form.get('accNo').value,
        'type': this.form.get('type').value,
        'amount': this.form.get('amount').value,
        'customerId': this.form.get('customer').value,
        'currency': this.form.get('currency').value
      };
  
      if(this.isUpdate) {
        accountDTO.id = this.accountId;
      }
  
      this.accountService.save(accountDTO).pipe(finalize(() => {
        this.listAccounts();
      })).subscribe(response => response);
      this.isUpdate = false;
      this.form.reset();
    } else {
      this.markNotValid();  
    }
  }

  markNotValid() {
    this.isAccNoValid = false;
    this.isTypeValid = false;
    this.isAmountValid = false;
    this.isCustomerValid = false;
    this.isCurrencyValid = false;
  }

  onEditPopulateToForm(index: number) {
    this.isUpdate = true;
    this.accountId = this.accounts[index].id;
    let customerToBeSelected: CustomerDTO;
    for(let customer of this.customers) {
      if(this.accounts[index].customerId === customer.id) {
        customerToBeSelected = customer;
        break;
      }
    }
    
    this.form.setValue({
      'accNo': this.accounts[index].accNo,
      'type': this.accounts[index].type,
      'amount': this.accounts[index].amount,
      'customer': customerToBeSelected.id,
      'currency': this.accounts[index].currency
    });
  }

  onDeleteAccount(index: number) {
    if(confirm("Confirm delete account?")) {
      this.accountService.delete(this.accounts[index].id).pipe(finalize(() => {
        this.listAccounts();
      })).subscribe(response => response);
      this.isUpdate = false;
      this.form.reset();
    }
  }

  listAccounts() {
    this.accountService.list().subscribe(response => {
      this.accounts = response
      for(let account of this.accounts) {
        for(let customer of this.customers) {
          if(account.customerId === customer.id) {
            account.customerName = customer.name
            break;
          }
        }
      }
    });
  }

  listCustomers() {
    this.customerService.list().pipe(finalize(()=> {
      for(let customer of this.customers) {
        customer.name = customer.firstName + " " + customer.lastName
      }
      this.listAccounts();
    })).subscribe(response => this.customers = response);
  }
}