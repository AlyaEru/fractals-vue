// features to add:
// ability to adjust colors, including background color
// Ability to adjust trunk width multiplier?
// at some point, make whole thing based on seed... would have to change rdm functions
// at some point, make my lines decrees smoothly in width, if I can do that with svg...
// make card scroll to fit tree
// make mobile friendly
//  I'll need to eliminate the click and drag to do that...

export default {
  methods: {
    intrdm: function (range) {
      return Math.floor(range[0] + Math.random() * (range[1] - range[0] + 1))
    },
    rdm: function (range) {
      return range[0] + Math.random() * (range[1] - range[0])
    },
    xydistance: function (p1, p2) {
      return {
        x: p2.x - p1.x,
        y: p2.y - p1.y
      }
    },
    distance: function (p1, p2) {
      const dif = this.xydistance(p1, p2)
      return Math.sqrt(dif.x * dif.x + dif.y * dif.y)
    },
    slope: function (p1, p2) {
      const dif = this.xydistance(p1, p2)
      return dif.y / dif.x
    },
    mandelbrot: function (line, params, iteration = 0) {
      if (iteration >= params.numTrunkRecursions) {
        return [line]
      }
      const dif = this.xydistance(line.start, line.end)
      const midpoint = { x: line.start.x + dif.x / 2, y: line.start.y + dif.y / 2 }
      const scale = this.rdm(params.trunkDisplacement) / 100
      const sign = (this.intrdm([0, 1]) ? -1 : 1)
      const newpoint = {
        x: midpoint.x + -1 * sign * dif.y * scale,
        y: midpoint.y + sign * dif.x * scale
      }
      const subline1 = { start: line.start, end: newpoint, color: line.color, width: line.width }
      const subline2 = { start: newpoint, end: line.end, color: line.color, width: line.width }

      const lines = [...this.mandelbrot(subline1, params, iteration + 1), ...this.mandelbrot(subline2, params, iteration + 1)]
      return lines
    },
    // this should return an array of lines
    fractaltree: function (line, params, iteration = 0, angle = 0) {
      const numBranches = this.intrdm(params.numBranches)
      const branches = []
      if (iteration < params.numRecursions) {
        // const offsetBranch = Math.floor(this.rdm([0, numBranches])) // make this an array, randomize
        for (let i = 0; i < numBranches; i++) {
          const divergeAngle = this.rdm(params.branchAngle)

          const limbLength = this.distance(line.start, line.end) * this.rdm(params.branchLength) / 100
          const midAngleRange = (params.branchAngle[1] - params.branchAngle[0]) / 2 + params.branchAngle[0]
          const branchOffset = (i * 2 / (numBranches - 1)) * midAngleRange
          const myAngle = angle + divergeAngle - branchOffset

          // figuring out the coordinates for the end of the branch
          const branchStart = line.end

          const endpt = { x: branchStart.x + (Math.sin(myAngle * Math.PI / 180) * limbLength), y: branchStart.y - (Math.cos(myAngle * Math.PI / 180) * limbLength) }
          const color = iteration < params.numRecursions - 1 ? '#99613D' : '#59A800'

          const lineSize = (line.width * (5 / 8 - (numBranches - 2) / 8)) * (iteration === params.numRecursions - 1 ? params.leafMultiplier : 1)// Number(Math.pow(Math.sqrt(numBranches),(11 - 2*numBranches - iteration))) //1.5 for 2 branches

          const branch = {
            start: branchStart,
            end: endpt,
            color: color,
            width: lineSize
          }

          branches.push(...this.fractaltree(branch, params, iteration + 1, myAngle))
          branches.push(...this.mandelbrot(branch, params))
        }
      }
      return branches
    }
  }
}
