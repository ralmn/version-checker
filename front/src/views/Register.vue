<template>
  <v-container>
    <v-sheet rounded="lg">
      <v-container>
        <h1>Register</h1>

        <v-alert transition="fade-transition" type="error" v-if="errorMessage">{{ errorMessage }}</v-alert>
        <v-alert transition="fade-transition" type="success" v-if="okMessage">
          Welcome ! You can now
          <router-link :to="{ name: 'Login' }">login you</router-link>
        </v-alert>

        <v-form ref="registerForm" v-model="valid" id="registerForm" @submit.prevent="registerSubmit">
          <v-text-field
            v-model="username"
            label="Username"
            min="5"
            :rules="[required, validateUsername]"
          />
          <v-text-field
            v-model="email"
            label="Email"
            :rules="[required, validateEmail]"
          />
          <v-text-field
            v-model="password"
            label="Password"
            type="password"
            :rules="[required, validatePassword]"
          />
          <v-text-field
            v-model="confirmationPassword"
            label="Password confirmation"
            type="password"
            :rules="[required, passwordConfirm]"
          />

          <v-btn type="submit" color="success" form="registerForm">Register</v-btn>
        </v-form>
      </v-container>
    </v-sheet>
  </v-container>
</template>

<script lang="ts">
import axios from "axios";
import Vue from "vue";
import Component from "vue-class-component";

@Component({})
export default class Register extends Vue {
  public username = "";
  public email = "";
  public password = "";
  public confirmationPassword = "";
  public valid = false;

  public errorMessage = "";
  public okMessage = false;

  validateUsername(value: string): boolean | string {
    return value.length >= 5 || "Min length : 5";
  }

  validateEmail(value: string): boolean | string {
    const pattern =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return pattern.test(value) || "Invalid e-mail.";
  }

  validatePassword(value: string): boolean | string {
    if (value.length < 5) {
      return "Min length : 5";
    }
    let containsChar = /[a-z]/i.test(value);
    let containsNumber = /[0-9]/i.test(value);
    if (!containsChar || !containsNumber) {
      return "Must contains char and numbers";
    }
    return true;
  }

  get passwordConfirm(): boolean {
    return this.password == this.confirmationPassword;
  }

  public required(value: string): boolean | string {
    return !!value || "Required.";
  }

  public async registerSubmit() {
    if ((this.$refs as any).registerForm.validate()) {
      let { data } = await axios.post(
        "/api/auth/register",
        {
          username: this.username,
          email: this.email,
          password: this.password,
          confirmationPassword: this.confirmationPassword,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (data.ok) {
        this.okMessage = true;
        this.errorMessage = '';
      } else {
        this.errorMessage = data.error;
      }
    }
  }
}
</script>

<style>
</style>