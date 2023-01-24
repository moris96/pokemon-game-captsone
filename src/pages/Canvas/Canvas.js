import { collisions } from "../../collisions/collisions"

export default function Canvas() {
    // console.log(collisions)

    const canvas = document.querySelector('canvas')
    const ctx = canvas.getContext('2d')

    //draw canvas
    canvas.width = 1024
    canvas.height = 576
    
    const collisionsMap = []
    for(let i = 0; i < collisions.length; i += 70){
        collisionsMap.push(collisions.slice(i, 70 + i))
        // console.log(collisions.slice(i, 70 + i))
    }
    console.log(collisionsMap)

    //place images on canvas 
    //background image
    const image = new Image()
    image.src = './pokemonMap/MapZoom.png'
    //playerDown image 
    const playerImage = new Image()
    playerImage.src = './player/playerDown.png'
        
    // image.onload = () => {
    //     ctx.drawImage(image, -1200, -70)
    //     ctx.drawImage(playerImage, 0, 0, playerImage.width/4, playerImage.height, canvas.width/2 - (playerImage.width/4)/4, canvas.height/2 - playerImage.height/2, playerImage.width/4, playerImage.height)
    // }

    class Sprite {
        constructor({ position, velocity, image }) {
            this.position = position
            this.image = image
        }

        draw() {
            ctx.drawImage(this.image, this.position.x, this.position.y)
        }
    }

    const background = new Sprite({
        position: {
            x: -1200,
            y: -70
        },
        image: image
    })

    const keys = {
        w: {
            pressed: false 
        },
        a: {
            pressed: false 
        },
        s: {
            pressed: false 
        },
        d: {
            pressed: false 
        }
    }

    //animate player sprite
    const animate = () => {
        window.requestAnimationFrame(animate)
        background.draw()
        // ctx.drawImage(image, -1200, -70)
        ctx.drawImage(playerImage, 0, 0, playerImage.width/4, playerImage.height, canvas.width/2 - (playerImage.width/4)/4, canvas.height/2 - playerImage.height/2, playerImage.width/4, playerImage.height)

        if(keys.w.pressed && lastKey === 'w') background.position.y += 3
        else if(keys.a.pressed && lastKey === 'a') background.position.x += 3
        else if(keys.s.pressed && lastKey === 's') background.position.y -= 3
        else if(keys.d.pressed && lastKey === 'd') background.position.x -= 3
    }
    animate()

    //move player through map on keydown
    let lastKey = ''
    window.addEventListener('keydown', (e) => {
        switch (e.key) {
            case 'w':
                keys.w.pressed = true 
                lastKey = 'w'
                break 
            case 'a':
                keys.a.pressed = true 
                lastKey = 'a'
                break 
            case 's':
                keys.s.pressed = true 
                lastKey = 's'
                break 
            case 'd':
                keys.d.pressed = true 
                lastKey = 'd'
                break 
        }
    })
    //keyup
    window.addEventListener('keyup', (e) => {
        switch (e.key) {
            case 'w':
                keys.w.pressed = false
                break 
            case 'a':
                keys.a.pressed = false 
                break 
            case 's':
                keys.s.pressed = false 
                break 
            case 'd':
                keys.d.pressed = false 
                break 
        }
    })


};