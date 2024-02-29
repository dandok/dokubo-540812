export interface IContractIndex {
  contract_address: string;
  index: string;
}

export interface IToken {
  id?: number;
  index: string;
  contract_address: string;
  current_price: number | null;
}