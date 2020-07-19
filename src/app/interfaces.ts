export interface CustomerDTO {
    id?: number,
    firstName: string,
    lastName: string,
    address: string,
    phoneNumber: number,
    ssn: string,
    name?: string
}

export interface CustomerListDTO {
    result: Array<CustomerDTO>
}

export interface AccountDTO {
    id?: number,
    accNo: number,
    type: string,
    amount: number,
    customerId: number,
    currency: number,
    customerName?: string
}

export interface AccountListDTO {
    result: Array<AccountDTO>
}

export interface FundTransferDTO {
    customerId: number,
    fromAccountId: number,
    toAccountId: number,
    amount: number,
    message?: string,
    isError?: boolean
}