<template>
  <v-dialog width="unset" v-model="colorDialog">
    <template v-slot:activator="{ on, attrs }" >
      <slot name="activator" :on="on" :attrs="attrs">
      </slot>
    </template>
    <v-card>
      <v-color-picker :value="value" @input="(e) => color=e">
      </v-color-picker>
      <v-card-actions>
        <v-btn block @click="setColor">Done</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  data: function () {
    return {
      colorDialog: false
    }
  },
  props: {
    value: String
  },
  created: function () {
    this.color = this.value
  },
  methods: {
    setColor: function () {
      this.colorDialog = false
      this.$emit('input', this.color)
    }
  }
}
</script>
