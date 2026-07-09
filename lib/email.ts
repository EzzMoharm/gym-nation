import { formatPrice } from "@/lib/utils";

interface OrderEmailDetails {
  orderNumber: string;
  total: number;
  items: {
    product_name: string;
    quantity: number;
    unit_price: number;
  }[];
}

/**
 * Sends an email using Resend API. If no api key is provided,
 * it falls back to logging the email to the console.
 */
async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    console.log("\n==================================================");
    console.log("📬 SIMULATED EMAIL NOTIFICATION (RESEND_API_KEY missing)");
    console.log(`To:      ${to}`);
    console.log(`Subject: ${subject}`);
    console.log("--------------------------------------------------");
    console.log("HTML Body Preview:");
    // Simple text cleanup to make it look clean in console logs
    console.log(html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim());
    console.log("==================================================\n");
    return { success: true, simulated: true };
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from: "Gym Nation <onboarding@resend.dev>",
        to,
        subject,
        html,
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Resend API error (${res.status}): ${errText}`);
    }

    const data = await res.json();
    return { success: true, data };
  } catch (err: any) {
    console.error("Error sending email via Resend:", err);
    return { success: false, error: err.message };
  }
}

export async function sendOrderConfirmationEmail(toEmail: string, details: OrderEmailDetails) {
  const itemsHtml = details.items
    .map(
      (item) => `
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;">${item.product_name}</td>
        <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: center;">${item.quantity}</td>
        <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: right;">${formatPrice(item.unit_price)}</td>
      </tr>
    `
    )
    .join("");

  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 12px;">
      <h2 style="color: #ea580c; text-align: center;">Gym Nation</h2>
      <h3 style="text-align: center;">Order Confirmation</h3>
      <p>Hello,</p>
      <p>Thank you for shopping at Gym Nation! We have received your order and are processing it.</p>
      
      <div style="background-color: #f9f9f9; padding: 15px; border-radius: 8px; margin: 20px 0;">
        <p style="margin: 0;"><strong>Order Number:</strong> ${details.orderNumber}</p>
        <p style="margin: 5px 0 0 0;"><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
      </div>

      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
        <thead>
          <tr style="background-color: #f3f4f6;">
            <th style="padding: 8px; text-align: left;">Product</th>
            <th style="padding: 8px; text-align: center;">Qty</th>
            <th style="padding: 8px; text-align: right;">Price</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHtml}
          <tr>
            <td colspan="2" style="padding: 8px; font-weight: bold; text-align: right;">Total:</td>
            <td style="padding: 8px; font-weight: bold; text-align: right; color: #ea580c;">${formatPrice(details.total)}</td>
          </tr>
        </tbody>
      </table>

      <p style="color: #666; font-size: 12px; text-align: center; margin-top: 40px;">
        This is a mock transaction notification. No actual payment has been processed.
      </p>
    </div>
  `;

  return sendEmail({
    to: toEmail,
    subject: `Order Confirmation - ${details.orderNumber}`,
    html,
  });
}

export async function sendSubscriptionConfirmationEmail(toEmail: string, planName: string) {
  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 12px;">
      <h2 style="color: #ea580c; text-align: center;">Gym Nation</h2>
      <h3 style="text-align: center;">Welcome to Your Training Program!</h3>
      <p>Hello,</p>
      <p>Congratulations! You are now subscribed to the <strong>${planName}</strong> program.</p>
      
      <p>Your interactive calendar and training modules are now active inside your client dashboard.</p>

      <div style="text-align: center; margin: 30px 0;">
        <a href="https://gym-nation.vercel.app/dashboard/subscriptions" style="background-color: #ea580c; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold;">
          Go to My Dashboard
        </a>
      </div>

      <p style="color: #666; font-size: 12px; text-align: center; margin-top: 40px;">
        This is a mock subscription confirmation notification.
      </p>
    </div>
  `;

  return sendEmail({
    to: toEmail,
    subject: `Welcome to ${planName} - Gym Nation`,
    html,
  });
}
