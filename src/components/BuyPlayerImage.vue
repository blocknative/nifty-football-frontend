<template>
    <div v-if="card">
       <span v-on:click="revealCard">
            <img src="../assets/back.svg"
                 v-show="!cardShown"
                 :id="'place_holder_' + card.tokenId"
                 :alt="'nifty_card_' + card.tokenId"/>
        </span>

        <img :src="imageUrl()"
             :id="'player_img_' + card.tokenId"
             v-show="cardShown"
             alt="Nifty Football Trading Card"
        />
    </div>
</template>

<script>
    import {mapState} from 'vuex';
    import {getApi} from "../utils";

    export default {
        name: 'buy-player-image',
        props: ['card', 'revealAll'],
        data() {
            return {
                cardShown: false
            };
        },
        computed: {
            ...mapState(['networkId']),
        },
        methods: {
            revealCard() {
                this.cardShown = true;
            },
            imageUrl() {
                return `${getApi()}/network/${this.networkId}/image/${this.card.tokenId}`;
            }
        },
        watch: {
            revealAll: function (newVal, oldVal) {
                if (newVal) {
                    this.cardShown = true;
                }
            }
        }
    };
</script>

<style scoped lang="scss">
</style>
