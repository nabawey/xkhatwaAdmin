<script setup lang="ts">
definePageMeta({
    layout: 'dashboard',
});

import { ref, computed, h } from 'vue';
import type { TableColumn } from '#ui/types';
import AppShowDetailsButton from '@/components/app/showDetailsButton.vue';

const selectedInvoice = ref<Invoice | null>(null);
const isOpen = ref(false);


interface Invoice {
    InvoiceID: number;
    InvoiceDate: string;
    CustomerName: string;
    SellerName: string;
    TotalAmount: number;
}

interface InvoiceDetail {
    InvoiceDetailID: number;
    InvoiceID: number;
    CategoryID: number;
    Quantity: number;
    UnitPrice: number;
    LineTotal: number;
}

const invoices: Invoice[] = [
    { InvoiceID: 1001, InvoiceDate: '2026-02-01', CustomerName: 'Alice Johnson', SellerName: 'Mohamed Nabwey', TotalAmount: 250.75 },
    { InvoiceID: 1002, InvoiceDate: '2026-02-03', CustomerName: 'Bob Smith', SellerName: 'Courtney Henry', TotalAmount: 120.0 },
    { InvoiceID: 1003, InvoiceDate: '2026-02-05', CustomerName: 'Charlie Davis', SellerName: 'Tom Cook', TotalAmount: 560.4 },
];

const invoiceDetails: InvoiceDetail[] = [
    { InvoiceDetailID: 1, InvoiceID: 1001, CategoryID: 10, Quantity: 2, UnitPrice: 50, LineTotal: 100 },
    { InvoiceDetailID: 2, InvoiceID: 1001, CategoryID: 12, Quantity: 3, UnitPrice: 50.25, LineTotal: 150.75 },
    { InvoiceDetailID: 3, InvoiceID: 1002, CategoryID: 15, Quantity: 1, UnitPrice: 120, LineTotal: 120 },
];



const columns: TableColumn<Invoice>[] = [
    { accessorKey: 'InvoiceDate', header: 'Date' },
    { accessorKey: 'CustomerName', header: 'Customer' },
    { accessorKey: 'SellerName', header: 'Seller' },
    { accessorKey: 'TotalAmount', header: 'Total Amount' },
    {
        header: 'Details',
        cell: ({ row }) => h(AppShowDetailsButton, {
            title: `Invoice #${row.original.InvoiceID} Details`,
            data: JSON.stringify(invoiceDetails.filter(detail => detail.InvoiceID === row.original.InvoiceID), null, 2)
        })
    }
];

const search = ref('');
const filtered = computed(() =>
    invoices.filter(inv =>
        [inv.InvoiceDate, inv.CustomerName, inv.SellerName, inv.TotalAmount.toString()]
            .some(val => val.toLowerCase().includes(search.value.toLowerCase()))
    )
);

const page = ref(1);
const pageSize = 5;
const paginated = computed(() =>
    filtered.value.slice((page.value - 1) * pageSize, page.value * pageSize)
);

</script>

<template>
    <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-4">
        <AppPageHeader title="Invoices"
            description="A list of all the invoices in your account including their details." />
        <NuxtLink href="/addInvoice">
            <UButton label="Add New Invoice"
                class="flex items-center justify-center rounded-md bg-green-800 hover:bg-green-600 px-4 py-2 text-sm font-semibold text-white shadow-sm w-full sm:w-auto" />
        </NuxtLink>
    </div>

    <AppDataTable :data="paginated" :columns="columns" :page-size="5" searchable />
</template>
