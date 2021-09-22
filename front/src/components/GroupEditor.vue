<template>
  <v-dialog v-model="dialog" width="500" v-if="iAmAllowed">
    <template v-slot:activator="{ on, attrs }">
      <v-btn icon v-bind="attrs" v-on="on" @click="open">
        <v-icon>mdi-pencil</v-icon>
      </v-btn>
    </template>

    <v-card>
      <v-card-title class="text-h5 grey lighten-2">Group Editor</v-card-title>

      <v-card-text>
        <v-container>
          <v-row v-if="errorMessage">
            <v-col cols="12">
              <v-alert type="error">{{errorMessage}}</v-alert>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <h2>Members</h2>
            </v-col>
          </v-row>
          <v-row
            v-for="member in group.members"
            :key="member.user.username"
            align="center">
            <v-col cols="1"><v-icon>mdi-account</v-icon></v-col>
            <v-col cols="auto" class="mr-auto">
              {{ member.user.username }}
            </v-col>
            <v-col class="mr-auto">
              <v-select
                @change="updateRole(member)"
                v-model="member.role"
                :disabled="member.role == 0"
                :items="roles" />
            </v-col>
            <v-col>
              <v-btn :disabled="member.role == 0" @click="removeMember(member)" icon>
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="auto">
              <GroupAddMember :group="group" />
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" text @click="dialog = false">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { IGroup, IMember, Role } from "@/object/IGroup";
import axios from "axios";
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import GroupAddMember from "./GroupAddMember.vue";


@Component({
  components: { GroupAddMember },
})
export default class GroupEditor extends Vue {
  @Prop({ required: true }) group!: IGroup;
  private dialog = false;
  private errorMessage = "";

  private roles = [
    { value: Role.ADMIN, text: "Admin", disabled: true },
    { value: Role.EDITOR, text: "Editor", disabled: false },
    { value: Role.VIEWER, text: "Read Only", disabled: false },
  ];

  open() {
    this.errorMessage = '';
    // this.group.members = [
    //   { user: { username: "user 1", email: "u1@test.com" }, role: "admin" },
    //   { user: { username: "user 2", email: "u2@test.com" }, role: "editor" },
    //   { user: { username: "user 3", email: "u3@test.com" }, role: "viewer" },
    // ];
    this.group.members = this.group.members.sort((m1, m2) => m1.role - m2.role);
  }

  updateRole(member: IMember) {
    axios
      .post(
        `/api/user/group/${this.group.id}/members/edit`,
        {
          member: member
        },
        {
          headers: {
            authorization: `Bearer ${this.$store.state.token}`,
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        const data = res.data;
        if (data.ok) {
          //this.group.members.push(data.member as IMember);
          //this.dialog = false;
        } else {
          this.errorMessage = data.error;
        }
      })
      .catch((err) => {
        this.errorMessage = err.response.data.error;
      });
  }

  removeMember(member: IMember) {
    axios
      .delete(
        `/api/user/group/${this.group.id}/members/remove/${member.user.id}`,
        {
          headers: {
            authorization: `Bearer ${this.$store.state.token}`,
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        const data = res.data;
        if (data.ok) {
          let index = this.group.members.findIndex(m => m == member);
          this.group.members.splice(index, 1);
          //this.group.members.push(data.member as IMember);
          //this.dialog = false;
        } else {
          this.errorMessage = data.error;
        }
      })
      .catch((err) => {
        this.errorMessage = err.response.data.error;
      });
  }

  get iAmAllowed() : boolean{
    let m = this.group.members.find(m => m.user.id == this.$store.state.user.id);
    if(m){
      return m.role == Role.ADMIN;
    }
    return true;
  }

}
</script>

<style></style>
