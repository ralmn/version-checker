<template>
  <v-container>
    <v-row>
      <v-col cols="2">
        <v-sheet rounded="lg">
          <v-list color="transparent">
            <v-list-item v-if="groups.length == 0">
              <v-list-item-content>
                <v-list-item-title>No groups</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item v-for="n in groups" :key="n.id" link @click="selectGroup(n)">
              <v-list-item-content>
                <v-list-item-title>{{ n.name }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>

            <v-divider class="my-2"></v-divider>

            <v-list-item link color="grey lighten-4">
              <v-list-item-content>
                <v-list-item-title>
                  <v-icon>mdi-plus</v-icon> Create group
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-sheet>
      </v-col>

      <v-col>
        <v-sheet min-height="70vh" rounded="lg">
          <v-container v-if="groups.length == 0">
            <p>Frist step : create your first group</p>
          </v-container>
          <v-container v-else-if="selectedGroup == null">
            <p>Please select your first group</p>
          </v-container>
          <Group v-else :group="selectedGroup" />
          <!--  -->
        </v-sheet>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import axios from "axios";
import Vue from "vue";
import { Component } from "vue-property-decorator";
import { IGroup } from "../object/IGroup";
import Group from "../components/Group.vue";

@Component({
  components: { Group },
})
export default class Dashboard extends Vue {
  private groups: IGroup[] = [];
  private selectedGroup: IGroup = null;

  mounted() {
    axios
      .get("/api/user/groups", {
        headers: {
          authorization: `Bearer ${this.$store.state.token}`,
        },
      })
      .then((res) => {
        const { data } = res;
        this.groups = data.data.map((gm) => {
          return {
            id: gm.group.id,
            name: gm.group.name,
            softwares: gm.group.versions.map((v) => {
              return {
                name: v.software.name,
                type: v.software.type,
                versions: v.software.versions,
                latestVersion: v.software.latestVersion,
                groupVersion: v.version,
              };
            }),
          };
        });
        if (this.groups.length) {
          if (this.selectedGroup == null) {
            this.selectedGroup = this.groups[0];
          } else {
            let idGroups = this.groups.filter(
              (g) => g.id == this.selectedGroup.id
            );
            if (idGroups.length) {
              this.selectedGroup = idGroups[0];
            } else {
              this.selectedGroup = null;
            }
          }
        } else {
          this.selectedGroup = null;
        }
        console.log(this.selectedGroup);
      });
  }

  selectGroup(group: IGroup){
    this.selectedGroup = group;
  }
}
</script>

<style>
</style>