<script setup lang="ts">
definePageMeta({
  layout: 'dashboard',
})

import { ref, computed } from 'vue'
import type { TableColumn } from '#ui/types'

interface Product {
  CategoryID: number
  CategoryName: string
  Description: string
  Price: number
  StockQuantity: number
}

const products: Product[] = [
  { CategoryID: 1, CategoryName: 'Electronics', Description: 'Smartphone with 128GB storage', Price: 699.99, StockQuantity: 50 },
  { CategoryID: 2, CategoryName: 'Books', Description: 'Hardcover novel', Price: 19.99, StockQuantity: 120 },
  { CategoryID: 3, CategoryName: 'Clothing', Description: 'Cotton T-shirt', Price: 9.99, StockQuantity: 200 }
]

const columns: TableColumn<Product>[] = [
  { accessorKey: 'CategoryID', header: 'Category ID' },
  { accessorKey: 'CategoryName', header: 'Category Name' },
  { accessorKey: 'Description', header: 'Description' },
  { accessorKey: 'Price', header: 'Price' },
  { accessorKey: 'StockQuantity', header: 'Stock Quantity' }
]

// search
const search = ref('')
const filtered = computed(() =>
  products.filter(p =>
    Object.values(p).some(val =>
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
  <AppPageHeader
    title="Products"
    description="A list of all products in your catalog including category, description, price, and stock quantity."
    buttonLabel="Add Product"
    :onButtonClick="() => console.log('Add product clicked')"
  />

  <!-- Table -->
  <AppDataTable
    :data="paginated"
    :columns="columns"
    :page-size="5"
    searchable
  />
</template>
