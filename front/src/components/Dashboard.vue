<template>
  <v-container>
    <v-row>
      <v-col cols="auto">
        <v-sheet rounded="lg">
          <v-list color="transparent">
            <v-list-item v-if="groups.length == 0">
              <v-list-item-content>
                <v-list-item-title>No groups</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item
              v-for="n in groups"
              :key="n.id"
              link
              @click="selectGroup(n)">
              <v-list-item-content>
                <v-list-item-title>
                  <v-badge
                  class="badgeList"
                    color="orange"
                    :value="countSoftwareNotUpdated(n) > 0"
                    :content="countSoftwareNotUpdated(n)"
                    label="Updates available"
                    bordered
                    >
                    {{ n.name }}
                  </v-badge>
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>

            <v-divider class="my-2"></v-divider>
            <CreateGroup @update="groupCreated" />
          </v-list>
        </v-sheet>
      </v-col>

      <v-col>
        <v-sheet min-height="70vh" rounded="lg">
          <v-container v-if="groups.length == 0">
            <p>First step : create your first group</p>
          </v-container>
          <v-container v-else-if="selectedGroup == null">
            <p>Please select your first group</p>
          </v-container>
          <Group v-else v-model="selectedGroup" @update="groupEdited" />
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
import {
  IGroup,
  softwareIsUpdated as _softwareIsUpdated,
} from "../object/IGroup";
import Group from "./Group.vue";
import CreateGroup from "./CreateGroup.vue";

@Component({
  components: { Group, CreateGroup },
})
export default class Dashboard extends Vue {
  private groups: IGroup[] = [];
  private selectedGroup: IGroup | null = null;

  mounted() {
    this.loadGroups();
  }

  loadGroups() {
    axios
      .get("/api/user/groups", {
        headers: {
          authorization: `Bearer ${this.$store.state.token}`,
        },
      })
      .then((res) => {
        const { data } = res;
        this.groups = data.data.map((gm: any) => {
          return {
            id: gm.group.id,
            name: gm.group.name,
            softwares: gm.group.versions.map((v: any) => {
              return {
                name: v.software.name,
                type: v.software.type,
                versions: v.software.versions,
                latestVersion: v.software.latestVersion,
                groupVersion: v.version,
              };
            }),
            members: gm.group.members || []
          };
        });
        if (this.groups.length) {
          if (this.selectedGroup == null) {
            this.selectedGroup = this.groups[0];
          } else {
            let idGroups = this.groups.filter(
              (g) => g.id == this.selectedGroup!.id
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
        this.$forceUpdate();
      });
  }

  selectGroup(group: IGroup) {
    this.selectedGroup = group;
  }

  groupEdited() {
    this.$forceUpdate();
  }

  countSoftwareNotUpdated(group: IGroup) : number {
    return group.softwares.filter(
      (s) => s.groupVersion && !_softwareIsUpdated(s)
    ).length || 0;
  }

  groupCreated() {
    this.loadGroups();
  }
}
</script>

<style>
.badgeList {
  margin-right: 16px;
}
</style>
