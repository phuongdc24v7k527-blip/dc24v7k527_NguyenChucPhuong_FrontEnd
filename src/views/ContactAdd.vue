<template>
    <div class="page">
        <h4>Thêm Liên hệ</h4>
        <ContactForm @submit:contact="createContact" />
        <p>{{ message }}</p>
    </div>
</template>

<script>
import ContactForm from "@/components/ContactForm.vue";
import ContactService from "@/services/contact.service";
import { create } from "axios";
export default {
    components: {
        ContactForm,
    },
    data() {
        return {
            contact: null,
            message: "",
        };
    },
    methods: {
        async createContact(data) {
            try {
                await ContactService.create(data);
                alert('Liên hệ được thêm thành công.');
                await this.$router.push({ name: "contactbook" });
            } catch (error) {
                console.log(error);
            }
        },
    },
    created() {
        // this.getContact(this.id);
        this.message = "";
    },
};
</script>