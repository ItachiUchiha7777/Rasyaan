import nodemailer from 'nodemailer';

const createTransporter = () => {
  if (process.env.EMAIL_USER && process.env.EMAIL_PASSWORD) {
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: Number(process.env.EMAIL_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });
  }
  return null;
};

export const sendOTPEmail = async (email, otp) => {
  const subject = `Your Rasyaan Order Verification Code [${otp}]`;
  const html = `
    <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #FDFBF7; border: 1px solid #E5E0D8; border-radius: 12px; overflow: hidden;">
      <div style="background-color: #1B3B2B; padding: 24px; text-align: center;">
        <h1 style="color: #FDFBF7; font-size: 28px; margin: 0; letter-spacing: 2px; font-weight: 700;">RASYAAN</h1>
        <p style="color: #E08A3C; font-size: 13px; margin: 4px 0 0 0; text-transform: uppercase; letter-spacing: 1px;">Pahad ka swaad, ghar tak</p>
      </div>
      <div style="padding: 32px; color: #1F2421;">
        <h2 style="color: #1B3B2B; margin-top: 0;">Verify Your Order</h2>
        <p style="font-size: 15px; line-height: 1.6; color: #4A5568;">Use the verification code below to complete your checkout process. This code is valid for 10 minutes.</p>
        <div style="background-color: #F4EFE6; padding: 20px; border-radius: 8px; text-align: center; margin: 24px 0; border: 1px dashed #C85A32;">
          <span style="font-size: 36px; font-weight: 800; letter-spacing: 8px; color: #1B3B2B;">${otp}</span>
        </div>
        <p style="font-size: 13px; color: #718096; line-height: 1.5;">If you did not request this code, please ignore this email. Never share your OTP with anyone.</p>
      </div>
      <div style="background-color: #1B3B2B; padding: 16px; text-align: center; color: #A0AEC0; font-size: 12px;">
        <p style="margin: 0;">Made with ❤️ from Uttarakhand | Authentic Himalayan Produce</p>
      </div>
    </div>
  `;

  console.log(`\n========================================`);
  console.log(`[EMAIL OTP VERIFICATION]`);
  console.log(`To: ${email}`);
  console.log(`OTP Code: ${otp}`);
  console.log(`========================================\n`);

  try {
    const transporter = createTransporter();
    if (transporter) {
      await transporter.sendMail({
        from: `"Rasyaan" <${process.env.EMAIL_USER}>`,
        to: email,
        subject,
        html
      });
      console.log(`[EMAIL SENT] OTP successfully sent to ${email}`);
    }
  } catch (error) {
    console.error(`[EMAIL ERROR] Failed to send OTP email: ${error.message}`);
  }
};

export const sendOrderConfirmationEmail = async (order) => {
  const subject = `Order Confirmed - #${order.orderNumber} | Rasyaan`;
  const itemsHtml = order.items
    .map(
      (item) => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #E2E8F0;">${item.name}</td>
        <td style="padding: 10px; border-bottom: 1px solid #E2E8F0; text-align: center;">${item.quantity}</td>
        <td style="padding: 10px; border-bottom: 1px solid #E2E8F0; text-align: right;">₹${item.price * item.quantity}</td>
      </tr>
    `
    )
    .join('');

  const html = `
    <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #FDFBF7; border: 1px solid #E5E0D8; border-radius: 12px; overflow: hidden;">
      <div style="background-color: #1B3B2B; padding: 24px; text-align: center;">
        <h1 style="color: #FDFBF7; font-size: 28px; margin: 0; letter-spacing: 2px;">RASYAAN</h1>
        <p style="color: #E08A3C; font-size: 13px; margin: 4px 0 0 0; text-transform: uppercase;">Pahad ka swaad, ghar tak</p>
      </div>
      <div style="padding: 32px; color: #1F2421;">
        <h2 style="color: #1B3B2B; margin-top: 0;">Thank You for Your Order!</h2>
        <p style="font-size: 15px; color: #4A5568;">Your order <strong>#${order.orderNumber}</strong> has been received and is being prepared with love from the hills of Uttarakhand.</p>
        
        <div style="background-color: #FFFFFF; border: 1px solid #E5E0D8; border-radius: 8px; padding: 20px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #1B3B2B; border-bottom: 2px solid #E08A3C; padding-bottom: 8px;">Order Details</h3>
          <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
            <thead>
              <tr style="background-color: #F4EFE6;">
                <th style="padding: 8px; text-align: left;">Item</th>
                <th style="padding: 8px; text-align: center;">Qty</th>
                <th style="padding: 8px; text-align: right;">Price</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>
          <div style="margin-top: 16px; text-align: right; font-size: 14px;">
            <p style="margin: 4px 0;">Subtotal: <strong>₹${order.subtotal}</strong></p>
            <p style="margin: 4px 0;">Delivery Fee: <strong>${order.shippingFee === 0 ? 'FREE' : '₹' + order.shippingFee}</strong></p>
            <p style="margin: 8px 0; font-size: 18px; color: #1B3B2B;">Total Amount: <strong>₹${order.total}</strong> (${order.paymentMethod})</p>
          </div>
        </div>

        <div style="background-color: #F4EFE6; padding: 16px; border-radius: 8px;">
          <h4 style="margin: 0 0 8px 0; color: #1B3B2B;">Shipping Address</h4>
          <p style="margin: 0; font-size: 14px; color: #4A5568; line-height: 1.5;">
            ${order.shippingAddress.name}<br/>
            ${order.shippingAddress.house}, ${order.shippingAddress.street}<br/>
            ${order.shippingAddress.city}, ${order.shippingAddress.district}, ${order.shippingAddress.state} - ${order.shippingAddress.pincode}<br/>
            Phone: ${order.shippingAddress.phone}
          </p>
        </div>
      </div>
      <div style="background-color: #1B3B2B; padding: 16px; text-align: center; color: #A0AEC0; font-size: 12px;">
        <p style="margin: 0;">Rasyaan E-Commerce | Himalayan Heritage & Produce</p>
      </div>
    </div>
  `;

  console.log(`\n========================================`);
  console.log(`[ORDER CONFIRMATION EMAIL]`);
  console.log(`To: ${order.shippingAddress.email}`);
  console.log(`Order Number: ${order.orderNumber}`);
  console.log(`Total: ₹${order.total}`);
  console.log(`========================================\n`);

  try {
    const transporter = createTransporter();
    if (transporter) {
      await transporter.sendMail({
        from: `"Rasyaan" <${process.env.EMAIL_USER}>`,
        to: order.shippingAddress.email,
        subject,
        html
      });
      console.log(`[EMAIL SENT] Order confirmation sent to ${order.shippingAddress.email}`);
    }
  } catch (error) {
    console.error(`[EMAIL ERROR] Failed to send order confirmation email: ${error.message}`);
  }
};

export const sendOrderStatusEmail = async (order, newStatus) => {
  const subject = `Order Status Update - #${order.orderNumber} is now ${newStatus} | Rasyaan`;
  const html = `
    <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #FDFBF7; border: 1px solid #E5E0D8; border-radius: 12px; overflow: hidden;">
      <div style="background-color: #1B3B2B; padding: 24px; text-align: center;">
        <h1 style="color: #FDFBF7; font-size: 28px; margin: 0; letter-spacing: 2px;">RASYAAN</h1>
      </div>
      <div style="padding: 32px; color: #1F2421;">
        <h2 style="color: #1B3B2B;">Order Status Update</h2>
        <p style="font-size: 15px;">Your order <strong>#${order.orderNumber}</strong> has been updated to status: <span style="color: #C85A32; font-weight: bold;">${newStatus}</span>.</p>
        <p style="font-size: 14px; color: #718096;">You can log in to your account at Rasyaan to track your package step-by-step.</p>
      </div>
    </div>
  `;

  try {
    const transporter = createTransporter();
    if (transporter) {
      await transporter.sendMail({
        from: `"Rasyaan" <${process.env.EMAIL_USER}>`,
        to: order.shippingAddress.email,
        subject,
        html
      });
    }
  } catch (error) {
    console.error(`[EMAIL ERROR] Failed to send order status update email: ${error.message}`);
  }
};
