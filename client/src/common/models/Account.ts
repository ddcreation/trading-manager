export interface Account {
  accountType: string;
  balances: string[];
  buyerCommission: number;
  canDeposit: boolean;
  canTrade: boolean;
  canWithdraw: boolean;
  makerCommission: number;
  permissions: string[];
  sellerCommission: number;
  takerCommission: number;
  updateTime: number;
}
