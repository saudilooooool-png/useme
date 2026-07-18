import type { Order, PlatformId, RawProduct } from "./types";

/** بيانات منتجات خام تحاكي ملف Excel غير منظّم يرفعه التاجر. */
export const RAW_PRODUCTS: RawProduct[] = [
  { sku: "SKU-1001", rawName: "سماعة بلوتوث لاسلكية أسود 40 مل", cost: 45, stock: 120, extra: { العلامة: "SoundX" } },
  { sku: "SKU-1002", rawName: "شاحن سريع 20W جوال type-c", cost: 22, stock: 300, extra: { القدرة: "20W" } },
  { sku: "SKU-1003", rawName: "قميص قطن رجالي أزرق L", cost: 35, stock: 18, extra: {} },
  { sku: "SKU-1004", rawName: "عطر عود فاخر 100 مل", cost: 90, stock: 60, extra: { الحجم: "100 مل" } },
  { sku: "SKU-1005", rawName: "قهوة عربية مطحونة 500 جم", cost: 28, stock: 210, extra: {} },
  { sku: "SKU-1006", rawName: "كريم ترطيب بشرة 50 مل", cost: 19, stock: 15, extra: {} },
  { sku: "SKU-1007", rawName: "حافظة جوال iphone سيليكون أحمر", cost: 8, stock: 500, extra: {} },
  { sku: "SKU-1008", rawName: "مصباح مكتب LED قابل للطي فضي", cost: 55, stock: 40, extra: {} },
  { sku: "SKU-1009", rawName: "تمر سكري فاخر 1 كجم", cost: 32, stock: 25, extra: {} },
  { sku: "SKU-1010", rawName: "حذاء رياضي أبيض M", cost: 70, stock: 12, extra: {} },
];

/** يولّد طلبات وهمية لمنصة معيّنة لأغراض العرض. */
export function mockOrders(platform: PlatformId): Order[] {
  const base: Omit<Order, "platform">[] = [
    {
      id: "ORD-5001",
      customerName: "خالد العتيبي",
      city: "الرياض",
      items: [
        { sku: "SKU-1001", title: "سماعة بلوتوث لاسلكية", qty: 1, price: 89 },
        { sku: "SKU-1002", title: "شاحن سريع 20W", qty: 1, price: 39 },
      ],
      total: 128,
      status: "new",
      createdAt: "2026-07-15",
    },
    {
      id: "ORD-5002",
      customerName: "نورة القحطاني",
      city: "جدة",
      items: [{ sku: "SKU-1004", title: "عطر عود فاخر", qty: 2, price: 169 }],
      total: 338,
      status: "processing",
      createdAt: "2026-07-15",
    },
    {
      id: "ORD-5003",
      customerName: "سعد الدوسري",
      city: "الدمام",
      items: [
        { sku: "SKU-1001", title: "سماعة بلوتوث لاسلكية", qty: 1, price: 89 },
        { sku: "SKU-1002", title: "شاحن سريع 20W", qty: 1, price: 39 },
        { sku: "SKU-1007", title: "حافظة جوال", qty: 1, price: 19 },
      ],
      total: 147,
      status: "shipped",
      createdAt: "2026-07-16",
    },
    {
      id: "ORD-5004",
      customerName: "ريم الشمري",
      city: "الرياض",
      items: [{ sku: "SKU-1005", title: "قهوة عربية مطحونة", qty: 3, price: 49 }],
      total: 147,
      status: "delivered",
      createdAt: "2026-07-16",
    },
    {
      id: "ORD-5005",
      customerName: "فهد المطيري",
      city: "مكة",
      items: [
        { sku: "SKU-1004", title: "عطر عود فاخر", qty: 1, price: 169 },
        { sku: "SKU-1006", title: "كريم ترطيب بشرة", qty: 1, price: 35 },
      ],
      total: 204,
      status: "new",
      createdAt: "2026-07-17",
    },
  ];
  return base.map((o) => ({ ...o, platform }));
}
