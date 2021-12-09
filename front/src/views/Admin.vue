<template>
    <v-container fluid>
        <v-row>
            <v-col cols="4">
                <v-card>
                    <v-container>
                        <v-row>
                            <v-col>
                                <h1>Software</h1>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col cols="6">
                                <v-list>
                                    <v-list-item-group
                                        v-model="indexSelectedSoftware"
                                        @change="changeSelectedSoftware">
                                        <v-list-item
                                            v-for="s in listSoftware"
                                            :key="s.name">
                                            {{ s.name }}
                                        </v-list-item>
                                    </v-list-item-group>
                                </v-list>
                            </v-col>
                            <v-col cols="6">
                                <v-list v-if="hasVersionSelected">
                                    <v-list-item-group
                                        @change="changeSelectedVersion"
                                        v-model="indexSelectedVersion">
                                        <v-list-item
                                            v-for="v in selectedSoftware.versions"
                                            :key="v.versionRaw">
                                            {{ v.versionRaw }}
                                        </v-list-item>
                                    </v-list-item-group>
                                </v-list>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-card>
            </v-col>
            <v-col cols="8">
                <v-card>
                    <v-container>
                        <v-row>
                            <v-col>
                                <h1>Status</h1>
                            </v-col>
                        </v-row>
                        <v-row v-if="selectedVersion != null">
                            <v-col cols="12">
                                <v-container>
                                    <v-row>
                                        <v-col cols="12">
                                          <code>{{ JSON.stringify(selectedVersion) }} </code>
                                        </v-col>
                                    </v-row>
                                </v-container>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script lang="ts">
import axios from "axios";
import Vue from "vue";
import { Component, Watch } from "vue-property-decorator";

@Component({
    components: {},
})
export default class Admin extends Vue {
    softwares: any[] = [];
    indexSelectedSoftware: any = null;
    indexSelectedVersion: any = null;

    async mounted() {
        if (!this.isAdmin) {
            this.$router.push("/");
        }

        await this.getSoftwares();
    }
    async getSoftwares() {
        let { data } = await axios.get("/api/admin/softwares/list", {
            headers: {
                Authorization: "Bearer " + this.$store.state.token,
            },
        });
        if (data.ok) {
            this.softwares = data.softwares;
        } else {
            //todo handle error
        }
    }

    changeSelectedSoftware() {
        this.indexSelectedVersion = null;
        console.log(this.selectedSoftware);
    }
    changeSelectedVersion() {
        console.log(this.indexSelectedVersion, this.selectedVersion);
    }

    get hasVersionSelected() {
        return this.indexSelectedSoftware != null;
    }

    get selectedSoftware() {
        return this.indexSelectedSoftware != null &&
            this.indexSelectedSoftware >= 0
            ? this.softwares[this.indexSelectedSoftware]
            : null;
    }

    get selectedVersion() {
        return this.indexSelectedVersion != null &&
            this.indexSelectedVersion >= 0
            ? this.selectedSoftware.versions[this.indexSelectedVersion]
            : null;
    }

    get listSoftware() {
        return this.softwares.map((software) => {
            return {
                name: software.name,
                type: software.type,
            };
        });
    }

    @Watch("$store.state")
    get isLogged() {
        return this.$store.getters.isLogged;
    }

    get isAdmin() {
        return this.$store.getters.isAdmin;
    }
}
</script>
