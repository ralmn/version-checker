<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <div class="d-flex align-center">
        <h1>Version Checker</h1>
      </div>

      <v-spacer></v-spacer>

      <v-btn to="/register" text>
        <span class="mr-2">Register</span>
      </v-btn>

      <v-btn to="/login" text>
        <span class="mr-2">Login</span>
      </v-btn>
    </v-app-bar>

    <v-main class="grey lighten-4">
      <v-container fluid>
        <router-view />
      </v-container>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "App",

  data: () => ({
    //
  }),
});
</script>
