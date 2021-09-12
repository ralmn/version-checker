<template>
  <v-container>
    <v-sheet rounded="lg">
      <v-container>
        <h1>Login</h1>

        <v-alert type="error" v-if="errorMessage">{{ errorMessage }}</v-alert>

        <v-form ref="loginForm" @submit.prevent="loginSumbit" id="loginForm">
          <v-text-field
            v-model="username"
            label="Username"
            :rules="[required]" />
          <v-text-field
            v-model="password"
            label="Password"
            type="password"
            :rules="[required]" />

          <v-btn type="submit" color="success" form="loginForm">Login</v-btn>
        </v-form>
      </v-container>
    </v-sheet>
  </v-container>
</template>

<script lang="ts">
import axios from "axios";
import Vue from "vue";
import { Component, Watch } from "vue-property-decorator";

@Component({})
export default class Login extends Vue {
  public username = "";
  public password = "";

  public errorMessage = "";

  mounted() {
    this.hideLoggingIfLogged();
  }

  @Watch("$store.getters.isLogged")
  hideLoggingIfLogged() {
    if (this.$store.getters.isLogged) {
      this.$router.push({ name: "Home" });
    }
  }

  public required(value: string): boolean | string {
    return !!value || "Required.";
  }

  public async loginSumbit(): Promise<void> {
    if ((this.$refs as any).loginForm.validate()) {
      let { data } = await axios.post(
        "/api/auth/login",
        {
          username: this.username,
          password: this.password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (data.ok) {
        this.$store.commit("setToken", data.token);
      } else {
        this.errorMessage = data.error;
      }
    }
  }
}
</script>

<style></style>
