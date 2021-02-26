import { dataService } from "./data";

export interface SaleOrderLine {
  id: number;
  name: string;
  productId: [number, string];
  qtyAvailableToday: number;
  qtyDelivered: number;
  qtyDeliveredManual: number;
  qtyInvoiced: number;
  qtyToDeliver: number;
  qtyToInvoice: number;
  priceSubtotal: number;
  priceTax: number;
  priceTotal: number;
  priceUnit: number;
  productUomQty: number;
  productUom: [number, string];
}

export const saleOrderLineService = {
  getSaleOrderLines(lineIds: number[]): Promise<SaleOrderLine[]> {
    return dataService.call(
      "sale.order.line",
      "read",
      [
        lineIds,
        [
          "sequence",
          "display_type",
          "product_uom_category_id",
          "product_updatable",
          "product_id",
          "product_template_id",
          "name",
          "analytic_tag_ids",
          "route_id",
          "product_uom_qty",
          "product_type",
          "virtual_available_at_date",
          "qty_available_today",
          "free_qty_today",
          "scheduled_date",
          "warehouse_id",
          "qty_to_deliver",
          "is_mto",
          "display_qty_widget",
          "qty_delivered",
          "qty_delivered_manual",
          "qty_delivered_method",
          "qty_invoiced",
          "qty_to_invoice",
          "product_uom",
          "customer_lead",
          "product_packaging",
          "price_unit",
          "tax_id",
          "discount",
          "price_subtotal",
          "price_total",
          "state",
          "invoice_status",
          "currency_id",
          "price_tax",
          "company_id",
        ],
      ],
      {}
    );
  },
};
