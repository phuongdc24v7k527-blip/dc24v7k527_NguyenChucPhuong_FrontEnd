<template>
    <Form @submit="submitContact" :validation-schema="contactFormSchema">
        <div class="form-group">
            <label for="name">Tên</label>
            <Field name="name" type="text" class="form-control" v-model="contactLocal.name" />
            <ErrorMessage name="name" class="error-feedback" />
        </div>
        <div class="form-group">
            <label for="email">E-mail</label>
            <Field name="email" type="email" class="form-control" v-model="contactLocal.email" />
            <ErrorMessage name="email" class="error-feedback" />
        </div>
        <div class="form-group">
            <label for="address">Địa chỉ</label>
            <Field name="address" type="text" class="form-control" v-model="contactLocal.address" />
            <ErrorMessage name="address" class="error-feedback" />
        </div>
        <div class="form-group">
            <label for="phone">Điện thoại</label>
            <Field name="phone" type="tel" class="form-control" v-model="contactLocal.phone" />
            <ErrorMessage name="phone" class="error-feedback" />
        </div>
        <div class="form-group form-check">
            <input name="favorite" type="checkbox" class="form-check-input" v-model="contactLocal.favorite" />
            <label for="favorite" class="form-check-label">
                <strong>Liên hệ yêu thích</strong>
            </label>
        </div>
        <!--  -->
        <div class="form-group">
            <label><strong>Sở thích</strong></label>
            <div>
                <div class="form-check form-check-inline">
                    <input class="form-check-input" type="radio" name="hasHobbies" id="hasHobbiesYes" value="yes" v-model="contactLocal.hasHobbies" />
                    <label class="form-check-label" for="hasHobbiesYes">Có</label>
                </div>
                <div class="form-check form-check-inline ml-3">
                    <input class="form-check-input" type="radio" name="hasHobbies" id="hasHobbiesNo" value="no" v-model="contactLocal.hasHobbies" />
                    <label class="form-check-label" for="hasHobbiesNo">Không</label>
                </div>
            </div>
        </div>

        <div v-if="contactLocal.hasHobbies === 'yes'" class="form-group ml-3 p-3 border rounded bg-light">
            <label><strong>Chọn các sở thích của bạn:</strong></label>
            
            <div class="form-check">
                <input class="form-check-input" type="checkbox" id="hobbySport" value="Thể thao" v-model="contactLocal.hobbies" />
                <label class="form-check-label" for="hobbySport">Thể thao</label>
            </div>
            <div class="form-check">
                <input class="form-check-input" type="checkbox" id="hobbyMusic" value="Âm nhạc" v-model="contactLocal.hobbies" />
                <label class="form-check-label" for="hobbyMusic">Âm nhạc</label>
            </div>
            <div class="form-check">
                <input class="form-check-input" type="checkbox" id="hobbyReading" value="Đọc sách" v-model="contactLocal.hobbies" />
                <label class="form-check-label" for="hobbyReading">Đọc sách</label>
            </div>
            <div class="form-check">
                <input class="form-check-input" type="checkbox" id="hobbyTravel" value="Du lịch" v-model="contactLocal.hobbies" />
                <label class="form-check-label" for="hobbyTravel">Du lịch</label>
            </div>
            <div class="form-check">
                <input class="form-check-input" type="checkbox" id="hobbyMovie" value="Xem phim" v-model="contactLocal.hobbies" />
                <label class="form-check-label" for="hobbyMovie">Xem phim</label>
            </div>
        </div>
        <!--  -->
        <div class="form-group">
            <button class="btn btn-primary">Lưu</button>
            <button v-if="contactLocal._id && isAdmin" type="button" class="ml-2 btn btn-danger" @click="deleteContact">
                Xóa
            </button>
            <button type="button" class="ml-2 btn btn-danger" @click="Cancel">
                Thoát
            </button>
        </div>
    </Form>
</template>

<script>
import * as yup from "yup";
import { Form, Field, ErrorMessage } from "vee-validate";
import { authState } from "@/store/auth";
export default {
    components: {
        Form,
        Field,
        ErrorMessage,
    },
    emits: ["submit:contact", "delete:contact"],
    props: {
        contact: { type: Object, required: true }
    },

    data() {
        // Định nghĩa bộ quy tắc kiểm tra dữ liệu đầu vào bằng thư viện yup
        const contactFormSchema = yup.object().shape({
            name: yup.string().required("Tên phải có giá trị.").min(2, "Tên phải ít nhất 2 ký tự.").max(50, "Tên có nhiều nhất 50 ký tự."),
            email: yup.string().required("E-mail phải có giá trị.").email("E-mail không đúng.").max(50, "E-mail tối đa 50 ký tự."),
            address: yup.string().max(100, "Địa chỉ tối đa 100 ký tự."),
            phone: yup.string().required("Số điện thoại phải có giá trị.").matches(/((09|03|07|08|05)+([0-9]{8})\b)/g, "Số điện thoại không hợp lệ."),
        });

        // Tạo một bản sao cục bộ từ props 'this.contact' để tránh thay đổi trực tiếp props cha
        const contactLocal = { ...this.contact };
        
        // BẢO VỆ REACTIVITY: Nếu chưa có mảng hobbies, gán ngay mảng rỗng []
        if (!contactLocal.hobbies) {
            contactLocal.hobbies = [];
        }
        
        // TỰ ĐỘNG NHẬN DIỆN: Nếu liên hệ cũ đã có sẵn sở thích trong mảng, radio sẽ tự tích chọn "Có" (yes)
        if (!contactLocal.hasHobbies) {
            contactLocal.hasHobbies = contactLocal.hobbies.length > 0 ? "yes" : "no";
        }

        return {
            contactLocal,
            contactFormSchema,
        };
    },
    computed: {
        isAdmin() {
            return authState.user && authState.user.role === "admin";
        },
    },
    methods: {
        submitContact() {
            // LOGIC LÀM SẠCH DỮ LIỆU: Nếu người dùng chọn "Không", xóa sạch mọi sở thích trong mảng trước khi gửi đi
            if (this.contactLocal.hasHobbies === 'no') {
                this.contactLocal.hobbies = [];
            }
            // Phát ra một sự kiện (event) gửi dữ liệu lên component cha xử lý tiếp
            this.$emit("submit:contact", this.contactLocal);
        },
        deleteContact() {
            this.$emit("delete:contact", this.contactLocal._id); // Chú ý: _id mới chính xác theo MongoDB của bạn
        },
        Cancel() {
            const reply = window.confirm('You have unsaved changes! Do you want to leave ? ')
            if (!reply) {
                return false
            } else this.$router.push({ name: "contactbook" });
        }
    },
};
</script>
<style scoped>
@import "@/assets/form.css";
</style>