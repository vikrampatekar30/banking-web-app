import { Component, OnInit } from '@angular/core';
import { CustomerDTO } from '../interfaces';
import { CustomerService } from '../services/customer.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css']
})
export class CustomerComponent implements OnInit {

  form: FormGroup;
  isUpdate: boolean = false;
  isFirstNameValid: boolean = true;
  isLastNameValid: boolean = true;
  isAddressValid: boolean = true;
  isPhoneNumberValid: boolean = true;
  isSSNValid: boolean = true
  customers: Array<CustomerDTO> =[];
  customerId: number;
  constructor(private customerService: CustomerService) {
    this.listCustomers();
  }

  ngOnInit(): void {
    this.form = new FormGroup({
      'firstName': new FormControl(null, Validators.required),
      'lastName': new FormControl(null, Validators.required),
      'address': new FormControl(null, Validators.required),
      'phoneNumber': new FormControl(null, Validators.required),
      'ssn': new FormControl(null, Validators.required)
    });
  }

  onSubmit() {
    if(this.form.valid) {
      const customerDTO:CustomerDTO = {
        'firstName': this.form.get('firstName').value,
        'lastName': this.form.get('lastName').value,
        'address': this.form.get('address').value,
        'phoneNumber': this.form.get('phoneNumber').value,
        'ssn': this.form.get('ssn').value
      };
  
      if(this.isUpdate) {
        customerDTO.id = this.customerId;
      }
  
      this.customerService.save(customerDTO).pipe(finalize(() => {
        this.listCustomers();
      })).subscribe(response => response);
      this.isUpdate = false;
      this.form.reset();
    } else {
      this.markNotValid();  
    }
  }

  markNotValid() {
    this.isFirstNameValid = false;
    this.isLastNameValid = false;
    this.isAddressValid = false;
    this.isPhoneNumberValid = false;
    this.isSSNValid = false;
  }

  onEditPopulateToForm(index: number) {
    this.isUpdate = true;
    this.customerId = this.customers[index].id;
    this.form.setValue({
      'firstName': this.customers[index].firstName,
      'lastName': this.customers[index].lastName,
      'address': this.customers[index].address,
      'phoneNumber': this.customers[index].phoneNumber,
      'ssn': this.customers[index].ssn
    });
  }

  onDeleteCustomer(index: number) {
    if(confirm("Confirm delete customer?")) {
      this.customerService.delete(this.customers[index].id).pipe(finalize(() => {
        this.listCustomers();
      })).subscribe(response => response);
      this.isUpdate = false;
      this.form.reset();
    }
  }

  listCustomers() {
    this.customerService.list().subscribe(response => this.customers = response);
  }
}
