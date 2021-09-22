<template>
  <v-dialog v-model="dialog" width="500">
    <template v-slot:activator="{ on, attrs }">
      <v-btn v-bind="attrs" v-on="on" @click="open">
        <v-icon>mdi-plus</v-icon>
        Member
      </v-btn>
    </template>

    <v-card>
      <v-card-title class="text-h5 grey lighten-2">
        Group Add Member
      </v-card-title>

      <v-card-text>
        <v-container>
          <v-row v-if="errorMessage">
            <v-col cols="12">
              <v-alert type="error">{{ errorMessage }}</v-alert>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <h2>Members</h2>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-text-field
                v-model="name"
                label="Username or email"></v-text-field>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions>
          <v-btn text @click="dialog = false">Cancel</v-btn>
        <v-spacer></v-spacer>
        <v-btn color="primary" text @click="add()">Add</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { IGroup, IMember, Role } from "@/object/IGroup";
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import axios from "axios";

@Component({})
export default class GroupAddMember extends Vue {
  @Prop({ required: true }) group!: IGroup;
  private dialog = false;
  private name = "";

  private errorMessage = "";

  private roles = [
    { value: Role.ADMIN, text: "Admin", disabled: true },
    { value: Role.EDITOR, text: "Editor", disabled: false },
    { value: Role.VIEWER, text: "Read Only", disabled: false },
  ];

  open() {
    //nothing ?
    this.errorMessage = "";
  }

  add() {
    if (this.name == "") {
      this.errorMessage = "Please specify an username";
      return;
    }

    axios.put(
      `/api/user/group/${this.group.id}/members/add`,
      {
        name: this.name,
      },
      {
        headers: {
          authorization: `Bearer ${this.$store.state.token}`,
          "Content-Type": "application/json",
        },
      }
    ).then(res => {
        const data = res.data;
        if(data.ok){
            this.group.members.push(data.member as IMember);
            this.dialog = false;
        }else{
            this.errorMessage = data.error;
        }
        
    }).catch(res => {
        console.log(res);
        this.errorMessage = res.data.error;
    });
  }
}
</script>

<style></style>
