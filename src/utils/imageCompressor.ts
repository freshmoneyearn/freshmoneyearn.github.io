/**
 * Client-side image compression utility for transaction payment proof screenshots.
 * Downscales images so they remain crisp and legible while keeping file size under ~150KB,
 * well within Firestore's 1MB document limit.
 */

export interface CompressionResult {
  dataUrl: string;
  originalSizeKb: number;
  compressedSizeKb: number;
  fileName: string;
}

export function compressImageFile(
  file: File,
  maxDimension = 900,
  quality = 0.75
): Promise<CompressionResult> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error('कृपया केवल इमेज फाइल (JPG, PNG, WEBP) अपलोड करें।'));
      return;
    }

    const originalSizeKb = Math.round(file.size / 1024);
    const reader = new FileReader();

    reader.onload = (readerEvent) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('कैनवास इनिशियलाइज़ नहीं हो सका'));
          return;
        }

        // Fill white background for transparent PNGs converted to JPEG
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);

        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        const base64Length = dataUrl.length - (dataUrl.indexOf(',') + 1);
        const compressedSizeKb = Math.round((base64Length * 3) / 4 / 1024);

        resolve({
          dataUrl,
          originalSizeKb,
          compressedSizeKb,
          fileName: file.name,
        });
      };

      img.onerror = () => {
        reject(new Error('इमेज लोड करने में विफल। कृपया दूसरी फाइल चुनें।'));
      };

      img.src = readerEvent.target?.result as string;
    };

    reader.onerror = () => {
      reject(new Error('फाइल पढ़ने में त्रुटि।'));
    };

    reader.readAsDataURL(file);
  });
}

/**
 * Generate a clean mock payment screenshot for demo pending users
 */
export function generateSamplePaymentProof(
  name: string,
  amount: number,
  utrRef: string
): string {
  const canvas = document.createElement('canvas');
  canvas.width = 600;
  canvas.height = 700;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  // Background gradient
  const grad = ctx.createLinearGradient(0, 0, 0, 700);
  grad.addColorStop(0, '#0f172a');
  grad.addColorStop(1, '#1e293b');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 600, 700);

  // Card background
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.roundRect(40, 40, 520, 620, 24);
  ctx.fill();

  // Green success circle
  ctx.fillStyle = '#10b981';
  ctx.beginPath();
  ctx.arc(300, 130, 40, 0, Math.PI * 2);
  ctx.fill();

  // White checkmark
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 6;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(285, 130);
  ctx.lineTo(297, 142);
  ctx.lineTo(320, 118);
  ctx.stroke();

  // Text: Payment Successful
  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 22px system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('भुगतान सफल (Payment Successful)', 300, 205);

  // Amount
  ctx.fillStyle = '#059669';
  ctx.font = 'bold 38px system-ui, sans-serif';
  ctx.fillText(`₹${amount}.00`, 300, 260);

  // Recipient details box
  ctx.fillStyle = '#f8fafc';
  ctx.beginPath();
  ctx.roundRect(70, 290, 460, 210, 16);
  ctx.fill();
  ctx.strokeStyle = '#e2e8f0';
  ctx.lineWidth = 1;
  ctx.stroke();

  // Details inside box
  ctx.textAlign = 'left';
  ctx.fillStyle = '#64748b';
  ctx.font = '13px system-ui, sans-serif';
  ctx.fillText('भुगतान किया गया (Paid to):', 90, 325);
  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 15px system-ui, sans-serif';
  ctx.fillText('FRESH MONEY EARN (freshmoneyearn@upi)', 90, 348);

  ctx.fillStyle = '#64748b';
  ctx.font = '13px system-ui, sans-serif';
  ctx.fillText('प्रेषक (Sender):', 90, 385);
  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 15px system-ui, sans-serif';
  ctx.fillText(name, 90, 408);

  ctx.fillStyle = '#64748b';
  ctx.font = '13px system-ui, sans-serif';
  ctx.fillText('UPI UTR / Ref No:', 90, 445);
  ctx.fillStyle = '#2563eb';
  ctx.font = 'bold 15px monospace';
  ctx.fillText(utrRef, 90, 468);

  // Security footer
  ctx.textAlign = 'center';
  ctx.fillStyle = '#94a3b8';
  ctx.font = '12px system-ui, sans-serif';
  ctx.fillText('Verified Bank Transaction • FRESH MONEY EARN (FME)', 300, 560);
  ctx.fillText('Secure 3-Level Referral System', 300, 585);

  return canvas.toDataURL('image/jpeg', 0.85);
}
