import { CartItem } from '@/types';

export const formatWhatsAppMessage = (items: CartItem[], total: number, merchantNumber: string) => {
  let message = `*NEW ORDER - MENSAH LUXURY*\n\n`;
  message += `I would like to place an order for the following items:\n\n`;

  items.forEach((item, index) => {
    message += `${index + 1}. *${item.name}*\n`;
    message += `   Size: ${item.selectedSize}\n`;
    message += `   Qty: ${item.quantity}\n`;
    message += `   Price: GHS ${item.price.toLocaleString()}\n\n`;
  });

  message += `*Total Amount: GHS ${total.toLocaleString()}*\n\n`;
  message += `Please confirm availability and shipping details.`;

  const encodedMessage = encodeURIComponent(message);
  // Clean phone number (remove spaces, etc.)
  const cleanNumber = merchantNumber.replace(/\D/g, '');
  return `https://wa.me/${cleanNumber}?text=${encodedMessage}`;
};
