<template>
    <div>
        <h1>Governance Report as of {{today}}</h1>
        <div v-if="resourceCacheMapArray.length">
            <div class="card card-style">
                <div v-for="(resourceCacheMap, index) in resourceCacheMapArray" :key="index">
                    <div class="card card-violation ">
                        <span class="category-header">{{resourceCacheMap.policy_name}}</span>
                        <span class="controls right">
                            <button class="button default link medium btn" @click="resourceCacheMap.show = true" v-if="!resourceCacheMap.show">
                                <i class="fas fa-chevron-right medium"></i>
                            </button>
                            <button class="button default link medium" @click="resourceCacheMap.show = false" v-else>
                                <i class="fas fa-chevron-down medium"></i>
                            </button>    
                        </span>
                    </div>
                    <div v-if="resourceCacheMap.show">
                        <div class="row cxs12 resource-header">
                            <div class="col cxs4" style= "width: 40rem;">
                                Organization ID
                            </div>
                            <div class="col cxs4" style= "width: 40rem;">
                                Integration ID
                            </div>
                            <div class="col cxs4" style= "width: 40rem;">
                                Resource ID
                            </div>
                        </div>
                        <div class="row cxs12 resource-group" v-for="(resource, index) in resourceCacheMap.resource_cache" :key="index">
                            <div class="col cxs4">
                                {{resource.organization_id}}
                            </div>
                            <div class="col cxs4">
                                {{resource.integration_id}}
                            </div>
                            <div class="col cxs4">
                                {{resource.resource_id}}
                            </div>
                        </div>
                    </div>
                    <hr class="default">
                    <br>  
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import {Component, Vue } from 'vue-property-decorator';

import moment from 'moment';
import API from '@/API';

@Component
export default class GovernanceReport extends Vue {
    /* Variable */
    private resourceCache: ResourceCache[] = [];
    private dateEvaluated: any;
    private integrationID: any;
    private today: string = moment(String(new Date())).format('MM/DD/YYYY');
    private resourceCacheMapArray: any[] = [];
    private cascadeoOrgId: string = '520a4dc6-4831-11ec-81d3-0242ac130003';
    private policies: Policy[] = [];
    private tempResourceCacheArray: any[] = [];
    private uri = window.location.href.split('/');

    private created(): void {
        this.uri.forEach((element) => {
            if (element.includes('integration')) {
                const names = element.split('&');
                names.forEach((name) => {
                    if (name.includes('integration')) {
                        const nameInt = name.split('integration_id=');
                        nameInt.forEach((el) => {
                            if (el) {
                                this.integrationID = el;
                            }
                        });
                    } else {
                        const nameDate = name.split('date_evaluated=');
                        nameDate.forEach((el) => {
                            if (el) {
                                this.dateEvaluated = el;
                            }
                        });
                    }
                });
            }
        });
        this.getResourceCacheAndPolicies();
    }

    private async getResourceCacheAndPolicies() {
        await API.ResourceCache.getIntegrationResourcesByIntegrationIDandDateEvaluated(this.integrationID, this.dateEvaluated).then((response) => {
            this.resourceCache = response;
        });
        await API.Policy.getPolicy(this.cascadeoOrgId).then((response) => {
            this.policies = response;
        });
        this.convertNewArrayMap(this.resourceCache, this.policies);
    }

    private convertNewArrayMap(resourceCache: ResourceCache[], policies: Policy[]) {
        policies.forEach((policy) => {
            this.tempResourceCacheArray = [];
            resourceCache.forEach ((resource) => {
                if (policy.policy_id === resource.policy_id) {
                    this.tempResourceCacheArray.push(resource);
                }
            });
            if (this.tempResourceCacheArray.length) {
                this.resourceCacheMapArray.push({
                    policy_name: policy.policy_name,
                    resource_cache: this.tempResourceCacheArray,
                    show: true,
                });
            }
        });
    }
}
</script>

<style lang="scss" scoped>

.card-style {
    width: 100rem;
    border: 0;
    margin: 0 0 0 0;
    padding: 0 0 0 0;
}

.card-violation {
    border: 0;
    margin: 0 0 0 0;
    padding: 0 0 0 0;
}

.category-header {
    font-size: 2rem;
    font-weight: bold;
    margin: 0 0 0 0;
    padding: 0 0 0 0;
}

.resource-group {
    font-size: 1.3rem;
    margin-left: 0;
}

.resource-header {
    margin: 0;
    max-width: 100%;
    font-weight: bold;
}
</style>
