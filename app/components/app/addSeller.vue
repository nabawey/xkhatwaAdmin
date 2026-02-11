<script setup lang="ts">
definePageMeta({
    layout: 'dashboard',
})

import { ref } from 'vue'

interface Seller {
    name: string
    title: string
    email: string
    role: string
}

const seller = ref<Seller>({
    name: '',
    title: '',
    email: '',
    role: ''
})

const submitSeller = () => {
    console.log('New seller added:', seller.value)
    seller.value = { name: '', title: '', email: '', role: '' }
}

// helper: move focus up/down or submit
const handleKey = (event: KeyboardEvent) => {
    const form = (event.currentTarget as HTMLElement).closest('form')
    if (!form) return
    const inputs = Array.from(form.querySelectorAll<HTMLInputElement>('input'))
    const index = inputs.indexOf(event.currentTarget as HTMLInputElement)

    if (event.key === 'ArrowDown' && index < inputs.length - 1) {
        inputs[index + 1]?.focus()
        event.preventDefault()
    }
    if (event.key === 'ArrowUp' && index > 0) {
        inputs[index - 1]?.focus()
        event.preventDefault()
    }
    if (event.key === 'Enter') {
        event.preventDefault()
        submitSeller()
    }
}
</script>

<template>
    <div class="p-4">
        <h2 class="text-lg font-bold mb-4">Add New Seller</h2>
        <UForm class="space-y-4" @submit.prevent="submitSeller">
            <UFormField label="Email" name="email">
                <UInput class="w-full" v-model="seller.email" @keydown="handleKey" />
            </UFormField>

            <UFormField label="Name" name="name">
                <UInput class="w-full" v-model="seller.name" @keydown="handleKey" />
            </UFormField>

            <UFormField label="Title" name="title">
                <UInput class="w-full" v-model="seller.title" @keydown="handleKey" />
            </UFormField>

            <UFormField label="Role" name="role">
                <UInput class="w-full" v-model="seller.role" @keydown="handleKey" />
            </UFormField>

            <UButton class="w-full flex items-center justify-center" type="submit">
                Submit
            </UButton>
        </UForm>
    </div>
</template>
