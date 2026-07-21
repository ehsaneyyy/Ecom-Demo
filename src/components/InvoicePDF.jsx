import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'

const styles = StyleSheet.create({
  page: { padding: 40, fontSize: 9, fontFamily: 'Helvetica', color: '#1a1a1a' },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 30 },
  brand: { fontSize: 18, fontWeight: 'bold', letterSpacing: 2 },
  invoiceTitle: { fontSize: 14, fontWeight: 'bold', textAlign: 'right', color: '#555' },
  section: { marginBottom: 20 },
  label: { fontSize: 7, textTransform: 'uppercase', letterSpacing: 1.5, color: '#999', marginBottom: 4 },
  value: { fontSize: 10, color: '#333' },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6, borderBottomWidth: 0.5, borderBottomColor: '#e5e5e5' },
  rowHeader: { backgroundColor: '#f5f5f5', borderBottomWidth: 1, borderBottomColor: '#ddd' },
  colProduct: { width: '45%' },
  colQty: { width: '15%', textAlign: 'center' },
  colPrice: { width: '20%', textAlign: 'right' },
  colTotal: { width: '20%', textAlign: 'right' },
  bold: { fontWeight: 'bold' },
  totals: { marginTop: 10 },
  totalRow: { flexDirection: 'row', justifyContent: 'flex-end', paddingVertical: 3 },
  totalLabel: { width: 120, textAlign: 'right', fontSize: 9 },
  totalValue: { width: 80, textAlign: 'right', fontSize: 9 },
  grandTotalRow: { borderTopWidth: 1, borderTopColor: '#333', marginTop: 4, paddingTop: 6 },
  grandTotalLabel: { width: 120, textAlign: 'right', fontSize: 11, fontWeight: 'bold' },
  grandTotalValue: { width: 80, textAlign: 'right', fontSize: 11, fontWeight: 'bold' },
  footer: { marginTop: 40, paddingTop: 15, borderTopWidth: 0.5, borderTopColor: '#ddd', textAlign: 'center' },
  footerText: { fontSize: 7, color: '#999', lineHeight: 1.6 },
  badge: { fontSize: 7, textTransform: 'uppercase', letterSpacing: 1, paddingVertical: 2, paddingHorizontal: 6, borderRadius: 2, alignSelf: 'flex-start' },
  badgeCod: { backgroundColor: '#fef3c7', color: '#92400e' },
  badgeRazorpay: { backgroundColor: '#dbeafe', color: '#1e40af' },
})

function formatDate(d) {
  if (!d) return ''
  const date = new Date(d)
  return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
}

export default function InvoicePDF({ order }) {
  const hasIgst = order.igst > 0

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View>
            <Text style={styles.brand}>ATELIER</Text>
            <Text style={[styles.value, { fontSize: 8, color: '#999', marginTop: 4 }]}>Premium Furniture & Home</Text>
            <Text style={[styles.value, { fontSize: 8, color: '#999' }]}>Kerala, India</Text>
            <Text style={[styles.value, { fontSize: 8, color: '#999' }]}>GSTIN: 32AALCT1234F1Z5</Text>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={styles.invoiceTitle}>TAX INVOICE</Text>
            <Text style={[styles.value, { fontSize: 8, color: '#666', marginTop: 6 }]}>Invoice #: {order.id.slice(0, 12).toUpperCase()}</Text>
            <Text style={[styles.value, { fontSize: 8, color: '#666' }]}>Date: {formatDate(order.createdAt)}</Text>
            <View style={{ marginTop: 6 }}>
              <Text style={[styles.badge, order.payment_method === 'cod' ? styles.badgeCod : styles.badgeRazorpay]}>
                {order.payment_method === 'cod' ? 'Cash on Delivery' : 'Paid via Razorpay'}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Bill To</Text>
          <Text style={styles.value}>{order.userName || 'Customer'}</Text>
          {order.userPhone && <Text style={[styles.value, { fontSize: 8 }]}>Phone: {order.userPhone}</Text>}
          <Text style={[styles.value, { fontSize: 8, color: '#666', marginTop: 2 }]}>{order.shippingAddress}</Text>
        </View>

        <View style={[styles.row, styles.rowHeader, { borderTopWidth: 0.5, borderTopColor: '#ddd' }]}>
          <Text style={[styles.colProduct, styles.bold, { fontSize: 7, textTransform: 'uppercase', letterSpacing: 1, color: '#666' }]}>Product</Text>
          <Text style={[styles.colQty, styles.bold, { fontSize: 7, textTransform: 'uppercase', letterSpacing: 1, color: '#666' }]}>Qty</Text>
          <Text style={[styles.colPrice, styles.bold, { fontSize: 7, textTransform: 'uppercase', letterSpacing: 1, color: '#666' }]}>Price</Text>
          <Text style={[styles.colTotal, styles.bold, { fontSize: 7, textTransform: 'uppercase', letterSpacing: 1, color: '#666' }]}>Total</Text>
        </View>

        {(order.items || []).map((item, i) => (
          <View key={i} style={styles.row}>
            <Text style={styles.colProduct}>{item.product_name || item.productName}</Text>
            <Text style={styles.colQty}>{item.quantity}</Text>
            <Text style={styles.colPrice}>₹{item.price.toFixed(2)}</Text>
            <Text style={styles.colTotal}>₹{(item.price * item.quantity).toFixed(2)}</Text>
          </View>
        ))}

        <View style={styles.totals}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Subtotal</Text>
            <Text style={styles.totalValue}>₹{(order.subtotal || order.total || 0).toFixed(2)}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Shipping</Text>
            <Text style={styles.totalValue}>{order.shipping_cost === 0 ? 'Free' : `₹${(order.shipping_cost || 0).toFixed(2)}`}</Text>
          </View>
          {hasIgst ? (
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>IGST (18%)</Text>
              <Text style={styles.totalValue}>₹{(order.igst || 0).toFixed(2)}</Text>
            </View>
          ) : (
            <>
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>CGST (9%)</Text>
                <Text style={styles.totalValue}>₹{(order.cgst || 0).toFixed(2)}</Text>
              </View>
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>SGST (9%)</Text>
                <Text style={styles.totalValue}>₹{(order.sgst || 0).toFixed(2)}</Text>
              </View>
            </>
          )}
          <View style={[styles.totalRow, styles.grandTotalRow]}>
            <Text style={styles.grandTotalLabel}>Grand Total</Text>
            <Text style={styles.grandTotalValue}>₹{(order.grand_total || order.grandTotal || 0).toFixed(2)}</Text>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>This is a computer-generated invoice and does not require a physical signature.</Text>
          <Text style={styles.footerText}>For support, contact us at hello@atelier.com</Text>
          <Text style={styles.footerText}>Thank you for shopping with Atelier.</Text>
        </View>
      </Page>
    </Document>
  )
}
