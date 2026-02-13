<script setup lang="ts">
definePageMeta({ layout: 'dashboard' })

// --- Types ---
interface Product {
  id: number
  name: string
  price: number
}

interface LineItem {
  id: string | number
  productId: number
  quantity: number
  unitPrice: number
  lineTotal: number
}

// --- Mock Data ---
const products: Product[] = [
  { id: 1, name: 'Product A', price: 50 },
  { id: 2, name: 'Product B', price: 120 },
  { id: 3, name: 'Product C', price: 75 },
  { id: 4, name: 'Service X', price: 200 }
]

const defaultProduct = products[0]!

// --- Unified State ---
const header = reactive({
  date: new Date().toISOString().slice(0, 16),
  customer: '',
  phone: '',
  seller: '',
  notes: ''
})

const details = ref<LineItem[]>([
  {
    id: useId(), 
    productId: defaultProduct.id,
    quantity: 1,
    unitPrice: defaultProduct.price,
    lineTotal: defaultProduct.price
  }
])

const discountValue = ref<number>(0)

// Configuration for Header loop
const headerFields = [
  { id: 'date', label: 'Date', type: 'datetime-local' },
  { id: 'customer', label: 'Customer Name', type: 'text' },
  { id: 'phone', label: 'Phone', type: 'tel' },
  { id: 'seller', label: 'Seller Name', type: 'text' },
  { id: 'notes', label: 'Notes', type: 'text' }
] as const

const headerOrder: string[] = headerFields.map(f => f.id)

// --- Focus Management ---
const formRefs = ref<Record<string, HTMLElement | null>>({})

const setRef = (key: string) => (el: any) => {
  if (el) formRefs.value[key] = el.$el ?? el
}

const focusField = (key: string) => {
  formRefs.value[key]?.focus()
}

// --- Calculations ---
const subtotal = computed(() => 
  details.value.reduce((acc, item) => acc + item.lineTotal, 0)
)

const totalAmount = computed(() => {
  const sub = subtotal.value
  const disc = Number(discountValue.value) || 0
  return Math.max(0, sub - disc)
})

// --- Methods ---
const updateLine = (index: number) => {
  const item = details.value[index]
  if (!item) return

  const product = products.find(p => p.id === item.productId)
  if (product) {
    item.unitPrice = product.price
    item.lineTotal = Number((item.quantity * item.unitPrice).toFixed(2))
  }
}

const addDetail = async () => {
  details.value.push({
    id: Math.random().toString(36).slice(2),
    productId: defaultProduct.id,
    quantity: 1,
    unitPrice: defaultProduct.price,
    lineTotal: defaultProduct.price
  })
  
  await nextTick()
  // Focus the product dropdown of the newly added row
  focusField(`row-${details.value.length - 1}-col-0`)
}

const removeDetail = (index: number) => {
  if (details.value.length > 1) {
    details.value.splice(index, 1)
  }
}

// --- Keyboard Navigation ---
const onHeaderKeydown = (e: KeyboardEvent, currentField: string) => {
  const idx = headerOrder.indexOf(currentField)

  if (e.key === 'ArrowRight') {
    const next = headerOrder[idx + 1]
    if (next) {
      e.preventDefault()
      focusField(next)
    } else {
      e.preventDefault()
      focusField('row-0-col-0') // Jump to table
    }
  } else if (e.key === 'ArrowLeft') {
    const prev = headerOrder[idx - 1]
    if (prev) {
      e.preventDefault()
      focusField(prev)
    }
  }
}

const onTableKeydown = (e: KeyboardEvent, row: number, col: number) => {
  const isLastRow = row === details.value.length - 1

  if (e.key === 'ArrowRight') {
    if (col === 0) {
      e.preventDefault()
      focusField(`row-${row}-col-1`)
    } else if (col === 1) {
      e.preventDefault()
      if (!isLastRow) focusField(`row-${row + 1}-col-0`)
      else focusField('discount-input')
    }
  } else if (e.key === 'ArrowLeft') {
    if (col === 1) {
      e.preventDefault()
      focusField(`row-${row}-col-0`)
    } else if (col === 0) {
      e.preventDefault()
      if (row > 0) focusField(`row-${row - 1}-col-1`)
      else focusField('notes') // Jump back to header
    }
  } else if (e.key === 'Enter' && col === 1) {
    e.preventDefault()
    if (isLastRow) addDetail()
    else focusField(`row-${row + 1}-col-0`)
  }
}

const submitInvoice = () => {
  console.log('Invoice Data:', { 
    ...header, 
    items: details.value, 
    total: totalAmount.value 
  })
}
</script>

<template>
  <form @submit.prevent="submitInvoice" class="p-4 md:p-8 bg-[#0b1120] text-slate-200 rounded-lg shadow-xl max-w-7xl mx-auto">
    
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 md:gap-6 mb-10">
      <div v-for="f in headerFields" :key="f.id">
        <label class="text-[10px] font-bold uppercase text-slate-500 tracking-wider mb-2 block">
          {{ f.label }}
        </label>
        <input 
          :ref="setRef(f.id)"
          v-model="header[f.id]" 
          :type="f.type" 
          @keydown="onHeaderKeydown($event, f.id)"
          class="w-full bg-[#1e293b]/50 border border-slate-700 rounded-md p-2.5 text-sm focus:border-blue-500 outline-none transition-all"
          placeholder="..."
        />
      </div>
    </div>

    <div class="overflow-x-auto scrollbar-hide mb-4">
      <table class="w-full text-left min-w-[700px]">
        <thead>
          <tr class="text-[11px] font-bold text-slate-500 uppercase tracking-tight border-b border-slate-800">
            <th class="pb-3 px-2">Product Selection</th>
            <th class="pb-3 px-2 w-28 text-center">Quantity</th>
            <th class="pb-3 px-2 w-28 text-right">Unit Price</th>
            <th class="pb-3 px-2 w-32 text-right">Line Total</th>
            <th class="pb-3 px-2 w-12"></th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-800/40">
          <tr v-for="(item, i) in details" :key="item.id" class="group">
            <td class="py-4 px-2">
              <select 
                :ref="setRef(`row-${i}-col-0`)"
                v-model.number="item.productId" 
                @change="updateLine(i)"
                @keydown="onTableKeydown($event, i, 0)"
                class="w-full bg-[#1e293b]/50 border border-slate-700 rounded p-2 text-sm focus:border-blue-500 outline-none appearance-none cursor-pointer"
              >
                <option v-for="p in products" :key="p.id" :value="p.id">{{ p.name }}</option>
              </select>
            </td>
            <td class="py-4 px-2">
              <input 
                :ref="setRef(`row-${i}-col-1`)"
                v-model.number="item.quantity" 
                type="number" 
                min="1"
                @input="updateLine(i)"
                @keydown="onTableKeydown($event, i, 1)"
                class="w-full bg-[#1e293b]/50 border border-slate-700 rounded p-2 text-sm text-center outline-none focus:border-blue-500"
              />
            </td>
            <td class="py-4 px-2 text-right text-sm italic text-slate-500 font-mono">
              {{ item.unitPrice.toFixed(2) }}
            </td>
            <td class="py-4 px-2 text-right text-sm font-bold text-blue-400 font-mono">
              {{ item.lineTotal.toFixed(2) }}
            </td>
            <td class="py-4 px-2 text-center">
              <button 
                type="button"
                @click="removeDetail(i)" 
                class="text-slate-600 hover:text-red-400 text-xl transition-colors p-1"
                title="Remove Line"
              >
                &times;
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <button 
      type="button" 
      @click="addDetail" 
      class="text-xs font-bold text-blue-400 hover:text-blue-300 mb-10 transition-colors flex items-center gap-1 group"
    >
      <span class="text-lg group-hover:scale-125 transition-transform">+</span> Add New Product Line
    </button>

    <div class="flex flex-col items-end border-t border-slate-800 pt-8">
      <div class="w-full max-w-xs space-y-4">
        
        <div class="flex justify-between items-center text-sm">
          <span class="text-slate-500 font-medium">Subtotal</span>
          <span class="font-bold text-slate-200 font-mono tracking-tight">{{ subtotal.toFixed(2) }}</span>
        </div>

        <div class="flex justify-between items-center text-sm">
          <span class="text-slate-500 font-medium">Discount Amount</span>
          <div class="flex items-center gap-2">
            <span class="text-red-500/50">-</span>
            <input 
              :ref="setRef('discount-input')"
              v-model.number="discountValue" 
              type="number" 
              class="w-28 bg-[#1e293b]/50 border border-slate-700 rounded-md p-2 text-right text-sm text-red-400 outline-none focus:border-red-500"
              placeholder="0.00"
            />
          </div>
        </div>

        <div class="flex justify-between items-center pt-4 border-t border-slate-800/50">
          <span class="text-slate-200 font-black uppercase text-xs tracking-widest">Grand Total</span>
          <span class="text-2xl font-black text-emerald-400 font-mono tracking-tighter">
            {{ totalAmount.toFixed(2) }}
          </span>
        </div>

        <button 
          type="submit" 
          class="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-blue-900/20 active:scale-[0.98] mt-4"
        >
          Save & Finalize Invoice
        </button>
      </div>
    </div>
  </form>
</template>

<style scoped>
/* Remove number input arrows */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
input[type=number] {
  -moz-appearance: textfield;
}

/* Custom Scrollbar for the table */
.scrollbar-hide::-webkit-scrollbar {
  height: 4px;
}
.scrollbar-hide::-webkit-scrollbar-track {
  background: #0f172a;
}
.scrollbar-hide::-webkit-scrollbar-thumb {
  background: #334155;
  border-radius: 10px;
}
</style>
