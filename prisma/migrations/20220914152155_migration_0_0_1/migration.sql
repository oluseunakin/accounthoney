-- CreateTable
CREATE TABLE "Product" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "price" INTEGER NOT NULL DEFAULT 0,
    "categoryName" TEXT NOT NULL,
    "stockId" INTEGER NOT NULL,
    CONSTRAINT "Product_categoryName_fkey" FOREIGN KEY ("categoryName") REFERENCES "Category" ("name") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Product_stockId_fkey" FOREIGN KEY ("stockId") REFERENCES "Stock" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Category" (
    "name" TEXT NOT NULL PRIMARY KEY
);

-- CreateTable
CREATE TABLE "Stock" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "date" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "OrderedProduct" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "price" INTEGER NOT NULL,
    "value" INTEGER NOT NULL,
    "orderId" INTEGER NOT NULL,
    CONSTRAINT "OrderedProduct_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Order" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "date" TEXT NOT NULL,
    "customerName" TEXT NOT NULL,
    CONSTRAINT "Order_customerName_fkey" FOREIGN KEY ("customerName") REFERENCES "Customer" ("name") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL DEFAULT 'Guest',
    "password" TEXT NOT NULL DEFAULT 'guest',
    "type" TEXT NOT NULL DEFAULT 'customer',
    "customerName" TEXT,
    CONSTRAINT "User_customerName_fkey" FOREIGN KEY ("customerName") REFERENCES "Customer" ("name") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Customer" (
    "name" TEXT NOT NULL PRIMARY KEY
);

-- CreateIndex
CREATE UNIQUE INDEX "Stock_date_key" ON "Stock"("date");

-- CreateIndex
CREATE UNIQUE INDEX "User_name_password_key" ON "User"("name", "password");

-- CreateIndex
CREATE UNIQUE INDEX "User_customerName_key" ON "User"("customerName");
