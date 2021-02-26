import { dataService } from "./data";

export type SaleOrderState = "draft" | "sent" | "sale" | "done" | "cancel";
export interface SaleOrder {
  id: number;
  name: string;
  amountTax: number;
  amountTotal: number;
  amountUntaxed: number;
  commitmentDate: string;
  companyId: [number, string];
  partnerId: [number, string];
  createDate: string;
  expectedDate: string;
  invoiceStatus: "to invoice" | "upselling" | "invoiced" | "no";
  state: SaleOrderState;
  teamId: [number, string];
  userId: [number, string];
  warehouseId: [number, string];
}

export const saleOrderStateMap: Record<SaleOrderState, string> = {
  draft: "Lên báo giá",
  sent: "Đã gửi báo giá",
  sale: "Đã xác nhận",
  cancel: "Đã huỷ",
  done: "Hoàn thành",
};
export const saleOrderService = {
  getSaleOrders(): Promise<SaleOrder[]> {
    return dataService.searchRead({
      model: "sale.order",
      fields: [
        "message_needaction",
        "name",
        "create_date",
        "commitment_date",
        "expected_date",
        "partner_id",
        "user_id",
        "team_id",
        "warehouse_id",
        "company_id",
        "amount_untaxed",
        "amount_tax",
        "amount_total",
        "currency_id",
        "state",
        "invoice_status",
        "activity_exception_decoration",
        "activity_exception_icon",
      ],
      domain: [],
      limit: 200,
    });
  },
};
