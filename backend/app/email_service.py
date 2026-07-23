import logging

from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail

from app.config import settings

logger = logging.getLogger(__name__)

ORDER_STATUS_DESCRIPTIONS = {
    "pending": "Your order has been received and is awaiting processing.",
    "processing": "Your order is now being prepared and will be shipped soon.",
    "shipped": "Your order has been shipped and is on its way to you!",
    "delivered": "Your order has been delivered. We hope you love your purchase!",
    "cancelled": "Your order has been cancelled. If you have questions, please contact us.",
}


def _build_order_confirmation_html(customer_name: str, order_id: str, items: list[dict], total: float, shipping_address: str) -> str:
    items_html = ""
    for item in items:
        name = item.get("product_name", "Product")
        qty = item.get("quantity", 1)
        price = item.get("price", 0)
        items_html += f"""
        <tr>
          <td style="padding:12px 0;border-bottom:1px solid #f0f0f0;font-size:14px;color:#333;">{name}</td>
          <td style="padding:12px 0;border-bottom:1px solid #f0f0f0;font-size:14px;color:#666;text-align:center;">{qty}</td>
          <td style="padding:12px 0;border-bottom:1px solid #f0f0f0;font-size:14px;color:#666;text-align:right;">₹{price * qty:.2f}</td>
        </tr>"""

    return f"""
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
    <body style="margin:0;padding:0;background-color:#fafafa;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
      <div style="max-width:600px;margin:0 auto;padding:40px 20px;">
        <div style="text-align:center;padding:30px 0;border-bottom:2px solid #1a1a1a;">
          <h1 style="margin:0;font-size:24px;letter-spacing:4px;color:#1a1a1a;">ATELIER</h1>
        </div>
        <div style="background:#fff;padding:40px;border:1px solid #e5e5e5;margin-top:20px;">
          <h2 style="margin:0 0 8px;font-size:20px;color:#1a1a1a;">Order Confirmed</h2>
          <p style="margin:0 0 24px;font-size:14px;color:#666;">Thank you, {customer_name}. Your order has been placed successfully.</p>
          <div style="background:#f9f9f9;padding:16px;margin-bottom:24px;border-left:3px solid #1a1a1a;">
            <p style="margin:0;font-size:12px;color:#999;text-transform:uppercase;letter-spacing:1px;">Order ID</p>
            <p style="margin:4px 0 0;font-size:14px;color:#333;font-family:monospace;">{order_id[:12].upper()}</p>
          </div>
          <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
            <thead>
              <tr>
                <th style="padding:8px 0;text-align:left;font-size:11px;color:#999;text-transform:uppercase;letter-spacing:1px;border-bottom:1px solid #e5e5e5;">Product</th>
                <th style="padding:8px 0;text-align:center;font-size:11px;color:#999;text-transform:uppercase;letter-spacing:1px;border-bottom:1px solid #e5e5e5;">Qty</th>
                <th style="padding:8px 0;text-align:right;font-size:11px;color:#999;text-transform:uppercase;letter-spacing:1px;border-bottom:1px solid #e5e5e5;">Total</th>
              </tr>
            </thead>
            <tbody>{items_html}</tbody>
          </table>
          <div style="text-align:right;padding-top:8px;border-top:2px solid #1a1a1a;">
            <p style="margin:0;font-size:18px;font-weight:bold;color:#1a1a1a;">Total: ₹{total:.2f}</p>
          </div>
          <div style="margin-top:24px;padding:16px;background:#f9f9f9;">
            <p style="margin:0;font-size:11px;color:#999;text-transform:uppercase;letter-spacing:1px;">Shipping To</p>
            <p style="margin:4px 0 0;font-size:14px;color:#333;">{shipping_address}</p>
          </div>
        </div>
        <div style="text-align:center;padding:30px 0;">
          <p style="margin:0;font-size:12px;color:#999;">Questions? Reply to this email or contact us at {settings.store_email}</p>
          <p style="margin:8px 0 0;font-size:12px;color:#ccc;">© 2026 Ecom Demo. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>"""


def _build_status_update_html(customer_name: str, order_id: str, new_status: str) -> str:
    description = ORDER_STATUS_DESCRIPTIONS.get(new_status, f"Your order status has been updated to {new_status}.")

    return f"""
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
    <body style="margin:0;padding:0;background-color:#fafafa;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
      <div style="max-width:600px;margin:0 auto;padding:40px 20px;">
        <div style="text-align:center;padding:30px 0;border-bottom:2px solid #1a1a1a;">
          <h1 style="margin:0;font-size:24px;letter-spacing:4px;color:#1a1a1a;">ATELIER</h1>
        </div>
        <div style="background:#fff;padding:40px;border:1px solid #e5e5e5;margin-top:20px;">
          <h2 style="margin:0 0 8px;font-size:20px;color:#1a1a1a;">Order Update</h2>
          <p style="margin:0 0 24px;font-size:14px;color:#666;">Hi {customer_name}, here's the latest on your order.</p>
          <div style="background:#f9f9f9;padding:20px;margin-bottom:24px;border-left:3px solid #1a1a1a;">
            <p style="margin:0;font-size:11px;color:#999;text-transform:uppercase;letter-spacing:1px;">Order ID</p>
            <p style="margin:4px 0 12px;font-size:14px;color:#333;font-family:monospace;">{order_id[:12].upper()}</p>
            <p style="margin:0;font-size:11px;color:#999;text-transform:uppercase;letter-spacing:1px;">Status</p>
            <p style="margin:4px 0 0;font-size:18px;font-weight:bold;color:#1a1a1a;text-transform:uppercase;letter-spacing:2px;">{new_status}</p>
          </div>
          <p style="font-size:14px;color:#666;line-height:1.6;">{description}</p>
        </div>
        <div style="text-align:center;padding:30px 0;">
          <p style="margin:0;font-size:12px;color:#999;">Questions? Reply to this email or contact us at {settings.store_email}</p>
          <p style="margin:8px 0 0;font-size:12px;color:#ccc;">© 2026 Ecom Demo. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>"""


def send_order_confirmation_email(customer_email: str, customer_name: str, order_id: str, items: list[dict], total: float, shipping_address: str) -> bool:
    if not settings.sendgrid_api_key:
        logger.warning("SendGrid API key not configured — skipping order confirmation email")
        return False

    subject = f"Your Ecom Demo Order #{order_id[:8].upper()} is Confirmed"
    html_content = _build_order_confirmation_html(customer_name, order_id, items, total, shipping_address)

    message = Mail(
        from_email=settings.store_email,
        to_emails=customer_email,
        subject=subject,
        html_content=html_content,
    )

    try:
        client = SendGridAPIClient(settings.sendgrid_api_key)
        client.send(message)
        logger.info(f"Order confirmation email sent to {customer_email} for order {order_id[:8]}")
        return True
    except Exception as e:
        logger.error(f"Failed to send order confirmation email: {e}")
        return False


def send_status_update_email(customer_email: str, customer_name: str, order_id: str, new_status: str) -> bool:
    if not settings.sendgrid_api_key:
        logger.warning("SendGrid API key not configured — skipping status update email")
        return False

    subject = f"Your Ecom Demo Order #{order_id[:8].upper()} — {new_status.title()}"
    html_content = _build_status_update_html(customer_name, order_id, new_status)

    message = Mail(
        from_email=settings.store_email,
        to_emails=customer_email,
        subject=subject,
        html_content=html_content,
    )

    try:
        client = SendGridAPIClient(settings.sendgrid_api_key)
        client.send(message)
        logger.info(f"Status update email sent to {customer_email} for order {order_id[:8]} → {new_status}")
        return True
    except Exception as e:
        logger.error(f"Failed to send status update email: {e}")
        return False
