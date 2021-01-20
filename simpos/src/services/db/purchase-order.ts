export interface PurchaseOrder {
  id: number;
  amountTotal: number;
  amountUntaxed: number;
  companyId: [number, string];
  currencyId: [number, string];
  dateApprove: string;
  dateOrder: string;
  datePlanned?: string;
  invoiceStatus: 'no' | 'to invoice' | 'invoiced';
  name: string;
  origin?: string;
  partnerId: [number, string];
  state: 'draft' | 'sent' | 'to approve' | 'purchase' | 'done' | 'cancel';
  userId: [number, string];
  partnerRef: string;
  notes?: string;
  pickingTypeId: [number, string];
}
