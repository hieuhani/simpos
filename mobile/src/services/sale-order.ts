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
  orderLine: number[];
}

export interface SaleOrderDetails extends SaleOrder {}

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
  getSaleOrder(soId: number): Promise<SaleOrderDetails | null> {
    return dataService
      .call(
        "sale.order",
        "read",
        [
          [soId],
          [
            "authorized_transaction_ids",
            "state",
            "picking_ids",
            "delivery_count",
            "invoice_count",
            "name",
            "partner_id",
            "partner_invoice_id",
            "partner_shipping_id",
            "sale_order_template_id",
            "validity_date",
            "date_order",
            "pricelist_id",
            "currency_id",
            "payment_term_id",
            "order_line",
            "note",
            "amount_untaxed",
            "amount_tax",
            "amount_total",
            "sale_order_option_ids",
            "user_id",
            "team_id",
            "company_id",
            "require_signature",
            "require_payment",
            "reference",
            "client_order_ref",
            "fiscal_position_id",
            "analytic_account_id",
            "invoice_status",
            "warehouse_id",
            "incoterm",
            "picking_policy",
            "commitment_date",
            "expected_date",
            "effective_date",
            "origin",
            "campaign_id",
            "medium_id",
            "source_id",
            "signed_by",
            "signed_on",
            "signature",
            "__last_update",
            "message_follower_ids",
            "activity_ids",
            "message_ids",
            "message_attachment_count",
            "display_name",
          ],
        ],
        {}
      )
      .then((entities: any) => {
        if (Array.isArray(entities) && entities.length > 0) {
          return entities[0];
        }
        return null;
      });
  },
};
