const canvas = document.querySelector('canvas')
const context = canvas.getContext('2d')

canvas.width = 1280
canvas.height = 768

// Fill and position canvas in browser
context.fillStyle = 'white'
context.fillRect(0, 0, canvas.width, canvas.height)

// Connect map to browser
const image = new Image()
image.onload = () => {
    animate()
}
image.src = '../img/map.png'

// Creating enemy class so we can more easily add enemies without bloated code
class Enemy {
    constructor({position = { x: 0, y: 0}}) {
        this.position = position
        this.width = 50
        this.height = 50
        this.waypointIndex = 0
        // Center property for enemies to properly follow path
        // Adding half of our width and height to find the center of the square
        this.center = {
            x: this.position.x + this.width / 2,
            y: this.position.y + this.height / 2
        }
    }

    draw() {
        context.fillStyle = 'red'
        context.fillRect(this.position.x, this.position.y, this.width, this.height)
    }

    update() {
        this.draw()
        
        // Moving x and y position using waypoint data
        // Finding x and y velocities : Use .center for finding angles using the center of our enemies
        const waypoint = waypoints[this.waypointIndex]
        const yDistance = waypoint.y - this.center.y
        const xDistance = waypoint.x - this.center.x
        const angle = Math.atan2(yDistance, xDistance)

        // Assigning angle to get appropriate velocities. Remember that cos is x and sin is y.
        this.position.x += Math.cos(angle)
        this.position.y += Math.sin(angle)
        // Updating our center as the enemies move
        this.center = {
            x: this.position.x + this.width / 2,
            y: this.position.y + this.height / 2
        }

        // After an enemy reaches a waypoint, move onto the next one
        //? Can Math.round be applied to both ends of the comparision and it still work?
        if(
            Math.round(this.center.x) === Math.round(waypoint.x) && 
            Math.round(this.center.y) === Math.round(waypoint.y) &&
            this.waypointIndex < waypoints.length - 1
        ) {
            this.waypointIndex++
        }
    }
}

// Creating new enemies from our class
const enemySpawn = []
for(let i = 1; i < 10; i++) {
    const xOffset = i * 150
    enemySpawn.push(
        new Enemy({
            position: { x: waypoints[0].x - xOffset, y: waypoints[0].y }
    }))
}

// Creating our enemy animation and linking everything together
function animate() {
    requestAnimationFrame(animate)

    context.drawImage(image, 0, 0)
    enemySpawn.forEach(enemy => {
        enemy.update()
    }) 
}
