<template>
  <nav class="navbar navbar-expand navbar-dark bg-dark justify-content-between">
    <div class="navbar-nav">
      <a href="/" class="navbar-brand">Ứng dụng Quản lý danh bạ</a>
      <li class="nav-item" v-if="currentUser">
        <router-link :to="{ name: 'contactbook' }" class="nav-link">
          Danh bạ
          <i class="fas fa-address-book"></i>
        </router-link>
      </li>
    </div>
    <div class="navbar-nav" v-if="currentUser">
      <span class="navbar-text mr-3">
        <i class="fas fa-user-circle mr-1"></i>
        Xin chào, <strong>{{ currentUser.username }}</strong>
      </span>
      <li class="nav-item">
        <a href="#" class="nav-link" @click.prevent="handleLogout">
          Đăng xuất
          <i class="fas fa-sign-out-alt"></i>
        </a>
      </li>
    </div>
    <div class="navbar-nav" v-else>
      <li class="nav-item">
        <router-link :to="{ name: 'login' }" class="nav-link">
          Đăng nhập
          <i class="fas fa-sign-in-alt"></i>
        </router-link>
      </li>
    </div>
  </nav>
</template>

<script>
import { authState } from "@/store/auth";

export default {
  computed: {
    currentUser() {
      return authState.user;
    },
  },
  methods: {
    handleLogout() {
      authState.logout();
      this.$router.push({ name: "login" });
    },
  },
};
</script>
