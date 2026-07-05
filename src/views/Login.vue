<template>
    <div class="login-page">
        <div class="card-container card">
            <h4 class="text-center mb-4">Đăng Nhập</h4>

            <Form @submit="handleLogin" :validation-schema="loginSchema">
                <div class="form-group">
                    <label for="username">Tên đăng nhập</label>
                    <Field name="username" type="text" class="form-control" v-model="userLocal.username" placeholder="Nhập tên đăng nhập..." />
                    <ErrorMessage name="username" class="error-feedback" />
                </div>
                
                <div class="form-group">
                    <label for="password">Mật khẩu</label>
                    <Field name="password" type="password" class="form-control" v-model="userLocal.password" placeholder="Nhập mật khẩu..." />
                    <ErrorMessage name="password" class="error-feedback" />
                </div>
                
                <div class="form-group mt-4">
                    <button class="btn btn-primary btn-block py-2" :disabled="loading">
                        <span v-if="loading" class="spinner-border spinner-border-sm mr-2"></span>
                        Đăng nhập
                    </button>
                </div>
                
                <div class="form-group mb-0">
                    <div v-if="message" class="alert alert-danger mb-0" role="alert">
                        <i class="fas fa-exclamation-triangle mr-2"></i>
                        {{ message }}
                    </div>
                </div>
            </Form>
        </div>
    </div>
</template>

<script>
import * as yup from "yup";
import { Form, Field, ErrorMessage } from "vee-validate";
import AuthService from "@/services/auth.service";
import { authState } from "@/store/auth";

export default {
    components: {
        Form,
        Field,
        ErrorMessage,
    },
    data() {
        const loginSchema = yup.object().shape({
            username: yup.string().required("Tên đăng nhập là bắt buộc."),
            password: yup.string().required("Mật khẩu là bắt buộc."),
        });

        return {
            userLocal: {
                username: "",
                password: "",
            },
            loginSchema,
            loading: false,
            message: "",
        };
    },
    methods: {
        async handleLogin() {
            this.loading = true;
            this.message = "";
            try {
                const user = await AuthService.login(this.userLocal);
                authState.setUser(user);
                this.$router.push({ name: "contactbook" });
            } catch (error) {
                console.log(error);
                this.message = error.response?.data?.message || "Đăng nhập thất bại. Vui lòng kiểm tra lại.";
            } finally {
                this.loading = false;
            }
        },
    },
};
</script>

<style scoped>
.login-page {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 70vh;
}
.card-container.card {
    max-width: 400px;
    width: 100%;
    padding: 30px;
    border-radius: 12px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
    background: #ffffff;
    border: 1px solid #eaeaea;
}
.error-feedback {
    color: #dc3545;
    font-size: 0.875em;
    margin-top: 5px;
    display: block;
}
</style>
