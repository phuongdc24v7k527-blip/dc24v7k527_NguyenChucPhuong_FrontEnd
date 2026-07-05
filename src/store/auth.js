import { reactive } from "vue";

export const authState = reactive({
  user: JSON.parse(localStorage.getItem("user")) || null,

  setUser(user) {
    this.user = user;
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  },

  logout() {
    this.setUser(null);
  },
});
