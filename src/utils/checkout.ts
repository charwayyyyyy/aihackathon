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
  // Clean phone number (remove spaces, etc.) and handle leading zero for Ghana
  let cleanNumber = merchantNumber.replace(/\D/g, '');
  if (cleanNumber.startsWith('0') && cleanNumber.length === 10) {
    cleanNumber = '233' + cleanNumber.substring(1);
  }
  return `https://wa.me/${cleanNumber}?text=${encodedMessage}`;
};
