<template>
  <div>
    <v-row class="ma-0 pa-0">
      <v-col cols="12" sm="2">
        <div class="text-h4 mb-3">Tree Display</div>
        <v-btn block large @click="setBasePoint" color="secondary" dark class="mb-3" >
          Trunk Location
        </v-btn>
        <colorDialog @input="renderTree" v-model="trunkColor">
          <template v-slot:activator="{ on, attrs }" >
            <v-btn
              block large :color="trunkColor" class="my-3"
              dark
              v-bind="attrs"
              v-on="on"
            >
              Trunk Color
            </v-btn>
          </template>
        </colorDialog>
        <colorDialog @input="renderTree" v-model="leafColor">
          <template v-slot:activator="{ on, attrs }" >
            <v-btn
              block large :color="leafColor" class="my-3"
              dark
              v-bind="attrs"
              v-on="on"
            >
              Leaf Color
            </v-btn>
          </template>
        </colorDialog>
      </v-col>
      <v-col>
        <v-card width="100%" height="95vh" max-height="95vw" outlined tile>
          <div v-if="listeningForBasepoint" @click="setTrunkClick">
            <v-overlay opacity=".2" absolute :value="listeningForBasepoint">
              Select two locations
            </v-overlay>
          </div>
          <svg width="100%" height="100%" v-if="!listeningForBasepoint">
            <line v-for="(line, i) of lines" :key="i" :x1="line.start.x + basepoint.x" :y1="line.start.y + basepoint.y" :x2="line.end.x + basepoint.x" :y2="line.end.y + basepoint.y" :style="`stroke:${line.color};stroke-linecap:round;stroke-width:${line.width}`"></line>
          </svg>
          <svg width="100%" height="100%"  v-if="listeningForBasepoint && firstPointSet">
            <circle :cx="lineStart.x" :cy="lineStart.y" r="10" stroke="black" stroke-width="3" fill="black" />
          </svg>
        </v-card>
      </v-col>
      <v-col cols="12" sm="3">
        <div class="text-h4 mb-3">Tree Parameters</div>
        <v-expansion-panels class="elevation-0" tile accordion>
          <v-expansion-panel v-for="attribute of attributesList" :key="attribute.key">
            <v-expansion-panel-header>
              {{ attribute.label }}
              <div
                class="font-weight-light ml-2"
              >{{ attribute.type==='range' ? (values[attribute.key][0] + ' - ' + values[attribute.key][1]) : values[attribute.key] }}</div>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-range-slider
                v-if="attribute.type==='range'"
                v-model="values[attribute.key]"
                :max="attribute.max"
                :min="attribute.min"
                :step="attribute.step || 1"
                @change="renderTree"
              >
                <template v-slot:prepend>
                  <div class="number-label">{{ values[attribute.key][0] }}</div>
                </template>
                <template v-slot:append>
                  <div class="number-label">{{ values[attribute.key][1] }}</div>
                </template>
              </v-range-slider>
              <v-slider
                v-else
                v-model="values[attribute.key]"
                :max="attribute.max"
                :min="attribute.min"
                :step="attribute.step || 1"
                @change="renderTree"
              >
                <template v-slot:prepend>
                  <div class="number-label">{{ values[attribute.key] }}</div>
                </template>
              </v-slider>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-col>
      <v-snackbar
        v-model="snackbar"
        :timeout="7000"
        top
        right
        color="error"
      >
        Tree too large, try reducing the number of recursions or branches
      </v-snackbar>
    </v-row>
  </div>
</template>

<script>
import fractals from '../mixins/fractals'
import colorDialog from '../components/ColorDialog'
export default {
  name: 'Home',
  mixins: [fractals],
  components: {
    colorDialog
  },
  data: function () {
    return {
      snackbar: false,
      listeningForBasepoint: false,
      basepoint: { x: 0, y: 0 },
      attributesList: [
        {
          type: 'slider',
          label: 'Trunk Thickness',
          max: 100,
          min: 1,
          key: 'trunkWidth'
        },
        {
          type: 'range',
          label: '% Branch Thickness',
          max: 100,
          min: 25,
          key: 'branchWidth'
        },
        {
          type: 'range',
          label: 'Leaf Size',
          max: 25,
          min: 0.5,
          step: 0.5,
          key: 'leafSize'
        },
        {
          type: 'slider',
          label: 'Number of Recursions',
          max: 12,
          min: 1,
          key: 'numRecursions'
        },
        {
          type: 'range',
          label: 'Branching Angle',
          max: 90,
          min: 0,
          key: 'branchAngle'
        },
        {
          type: 'range',
          label: 'Number of Branches',
          max: 5,
          min: 2,
          key: 'numBranches'
        },
        {
          type: 'range',
          label: '% Branch Length',
          max: 90,
          min: 50,
          key: 'branchLength'
        },
        {
          type: 'slider',
          label: 'Number of Trunk Recursions',
          max: 6,
          min: 0,
          key: 'numTrunkRecursions'
        },
        {
          type: 'range',
          label: '% Trunk Displacement',
          max: 15,
          min: 0,
          key: 'trunkDisplacement'
        },
        {
          type: 'slider',
          label: '% Chance of Missing Branch',
          max: 50,
          min: 0,
          key: 'missingBranch'
        }
      ],
      values: {
        trunkWidth: 25,
        leafSize: [15, 20],
        branchAngle: [50, 70],
        numBranches: [2, 2],
        numRecursions: 6,
        branchLength: [60, 70],
        numTrunkRecursions: 3,
        trunkDisplacement: [5, 10],
        missingBranch: 0,
        branchWidth: [50, 70]
      },
      lineStart: { x: 300, y: 500 },
      lineEnd: { x: 300, y: 300 },
      lines: [],
      firstPointSet: false,
      trunkColor: '#99613D',
      leafColor: '#59A800'
    }
  },
  created: function () {
    this.parseQuery()
    this.renderTree()
  },
  methods: {
    renderTree: function () {
      const startLine = {
        start: this.lineStart,
        end: this.lineEnd,
        color: this.trunkColor,
        width: this.values.trunkWidth
      }
      const lines = this.fractaltree(
        startLine,
        this.values,
        this.trunkColor,
        this.leafColor
      )
      lines.push(...this.mandelbrot(startLine, this.values))
      if (lines.length > 30000) {
        this.snackbar = true
        return
      }
      this.lines = lines
      this.lines.reverse()
      history.pushState({}, null, this.$route.path + this.marshalQuery())
    },
    setBasePoint: function () {
      this.listeningForBasepoint = true
    },
    setTrunkClick: function (e) {
      const rect = e.target.getBoundingClientRect()
      if (this.firstPointSet) {
        this.lineEnd.x = e.clientX - rect.left
        this.lineEnd.y = e.clientY - rect.top

        // force lower point to be lineStart
        if (this.lineEnd.y > this.lineStart.y) {
          const temp = { x: this.lineEnd.x, y: this.lineEnd.y }
          this.lineEnd = this.lineStart
          this.lineStart = temp
        }
        this.firstPointSet = false
        this.listeningForBasepoint = false
        setTimeout(this.renderTree, 0) // lets dom re-render before trying to render tree
      } else {
        this.lines = []
        this.lineStart.x = e.clientX - rect.left
        this.lineStart.y = e.clientY - rect.top
        this.firstPointSet = true
      }
    },
    marshalQuery: function () {
      let query = '?'
      for (const key in this.values) {
        query += (key + '=')
        if (Array.isArray(this.values[key])) {
          query += this.values[key].join('|')
        } else {
          query += this.values[key]
        }
        query += '&'
      }
      query += ('lineStartx=' + this.lineStart.x)
      query += ('&lineStarty=' + this.lineStart.y)
      query += ('&lineEndx=' + this.lineEnd.x)
      query += ('&lineEndy=' + this.lineEnd.y)
      query += ('&trunkColor=' + encodeURIComponent(this.trunkColor))
      query += ('&leafColor=' + encodeURIComponent(this.leafColor))
      return query
    },
    parseQuery: function () {
      const query = this.$route.query
      for (const key in this.values) {
        if (query[key]) {
          const values = query[key].split('|')
          if (values.length > 1) {
            this.values[key] = values.map(x => Number(x))
          } else {
            this.values[key] = Number(values[0])
          }
        }
      }
      if (query.lineStartx) {
        this.lineStart.x = Number(query.lineStartx)
      }
      if (query.lineStarty) {
        this.lineStart.y = Number(query.lineStarty)
      }
      if (query.lineEndx) {
        this.lineEnd.x = Number(query.lineEndx)
      }
      if (query.lineEndy) {
        this.lineEnd.y = Number(query.lineEndy)
      }
      if (query.leafColor) {
        this.leafColor = query.leafColor
      }
      if (query.trunkColor) {
        this.trunkColor = query.trunkColor
      }
    }
  }
}
</script>

<style scoped>
.number-label {
  width: 1.3em;
}
</style>
