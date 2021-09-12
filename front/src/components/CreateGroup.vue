<template>
  <v-dialog v-model="dialog">
    <template v-slot:activator="{ on, attrs }">
      <v-list-item link color="grey lighten-4" v-bind="attrs" v-on="on">
        <v-list-item-content>
          <v-list-item-title>
            <v-icon>mdi-plus</v-icon> Create group
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </template>
    <v-card>
      <v-card-title>Create group 
        <v-spacer></v-spacer>
        <v-btn icon @click="dialog = false"><v-icon>mdi-close</v-icon></v-btn>
      </v-card-title>

      <v-card-text>
        <v-container>
          <v-row>
            <v-col>
                <v-text-field label="Group name" v-model="groupName" />
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-btn color="primary" :disabled="!groupName" @click="create">Create</v-btn>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import Vue from "vue";
import axios from "axios";
import { Component } from "vue-property-decorator";

@Component({})
export default class CreateGroup extends Vue {
  groupName = "";
  dialog = false;

  create() {
    axios.post(`/api/user/group/add`, {
      name: this.groupName
    }, {
      headers: {
        authorization: `Bearer ${this.$store.state.token}`,
        'Content-Type': 'application/json'
      }
    }).then(res => {
      let {data} = res;
      this.$emit('update', res.group);
      this.dialog = false;
      this.groupName = '';

    })
  }
}
</script>

<style>
</style>