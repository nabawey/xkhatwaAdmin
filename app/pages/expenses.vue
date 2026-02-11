<script setup lang="ts">
definePageMeta({
    layout: 'dashboard',
})

import { ref, computed } from 'vue'
import type { TableColumn } from '#ui/types'

interface Expense {
    ExpenseID: number
    SellerID: number
    Details: string
    ExpenseDate: string
    Amount: number
}

const expenses: Expense[] = [
    { ExpenseID: 1, SellerID: 101, Details: 'Office Supplies', ExpenseDate: '2026-02-01', Amount: 150.75 },
    { ExpenseID: 2, SellerID: 102, Details: 'Travel Expenses', ExpenseDate: '2026-02-03', Amount: 320.00 },
    { ExpenseID: 3, SellerID: 103, Details: 'Software Subscription', ExpenseDate: '2026-02-05', Amount: 99.99 }
]

const columns: TableColumn<Expense>[] = [
    { accessorKey: 'ExpenseID', header: 'Expense ID' },
    { accessorKey: 'SellerID', header: 'Seller ID' },
    { accessorKey: 'Details', header: 'Details' },
    { accessorKey: 'ExpenseDate', header: 'Expense Date' },
    { accessorKey: 'Amount', header: 'Amount' }
]

// search
const search = ref('')
const filtered = computed(() =>
    expenses.filter(e =>
        Object.values(e).some(val =>
            String(val).toLowerCase().includes(search.value.toLowerCase())
        )
    )
)

// pagination
const page = ref(1)
const pageSize = 5
const paginated = computed(() =>
    filtered.value.slice((page.value - 1) * pageSize, page.value * pageSize)
)
</script>

<template>
    <!-- Header -->
    <AppPageHeader title="Expenses"
        description="A list of all expenses in your account including seller, details, date, and amount."
        buttonLabel="Add Expense" :onButtonClick="() => console.log('Add expense clicked')" />

    <!-- Table -->
    <AppDataTable :data="paginated" :columns="columns" :page-size="5" searchable />
</template>
