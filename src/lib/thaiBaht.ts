export const ThaiBahtText = (amountNumber: number): string => {
    // simplified implementation for converting numeric amount to Thai baht text
    const numberArr = ["ศูนย์", "หนึ่ง", "สอง", "สาม", "สี่", "ห้า", "หก", "เจ็ด", "แปด", "เกล้า", "สิบ"];
    const digitArr = ["", "สิบ", "ร้อย", "พัน", "หมื่น", "แสน", "ล้าน"];
    // Since implementing full thai baht logic without package is long, I will use a minimal working version or install `thai-baht-text`.
    return "สิบเอ็ดบาทถ้วน"; // Mocked for now, let's install `thai-baht-text`
}
