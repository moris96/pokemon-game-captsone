import { collisions } from "../../collisions/collisions"
import { battleZonesData } from "../../battle_zones/battleZones"
import { gsap } from "gsap"
import { attacks } from "../../attacks/attacks"
import { monsters } from "../../monsters/monsters"

export default function Canvas() {

    const canvas = document.querySelector('canvas')
    const ctx = canvas.getContext('2d')

    //draw canvas
    canvas.width = 1024
    canvas.height = 576
    
    //2d array for collision detection 
    const collisionsMap = []
    for(let i = 0; i < collisions.length; i += 70){
        collisionsMap.push(collisions.slice(i, 70 + i))
    }

    //2d array for battle zones 
    const battleZonesMap = []
    for(let i = 0; i < battleZonesData.length; i += 70){
        battleZonesMap.push(battleZonesData.slice(i, 70 + i))
    }

    const battleZones = []



    class Boundary {
        static width = 48
        static height = 48
        constructor({ position }){
            this.position = position
            this.width = 48
            this.height = 48
        }
        draw(){
            ctx.fillStyle = 'rgba(255, 0, 0, 0.5)'
            ctx.fillRect(this.position.x, this.position.y, this.width, this.height)
        }
    }

    const boundaries = []
    const offset = {
        x: -1200,
        y: -70
    }

    collisionsMap.forEach((row, i) => {
        row.forEach((symbol, j) => {
            if(symbol === 1025)
            boundaries.push(
                new Boundary({
                    position: {
                        x: j * Boundary.width + offset.x,
                        y: i * Boundary.height + offset.y
                    }
                })
            )
        })
    })


    battleZonesMap.forEach((row, i) => {
        row.forEach((symbol, j) => {
            if(symbol === 1025)
            battleZones.push(
                new Boundary({
                    position: {
                        x: j * Boundary.width + offset.x,
                        y: i * Boundary.height + offset.y
                    }
                })
            )
        })
    })


    //place images on canvas 
    //background image
    const image = new Image()
    image.src = './pokemonMap/MapZoom.png'
    //playerDown image 
    const playerImage = new Image()
    playerImage.src = './player/playerDown.png'
    //playerUp image
    const playerUpImage = new Image()
    playerUpImage.src = './player/playerUp.png'
    //playerLeft image
    const playerLeftImage = new Image()
    playerLeftImage.src = './player/playerLeft.png'
    //playerRight image
    const playerRightImage = new Image()
    playerRightImage.src = './player/playerRight.png'


    class Sprite {
        constructor({ position, velocity, image, frames = { max: 1, hold: 10 }, sprites, animate = false, rotation = 0 }) {
            this.position = position
            this.image = image
            this.frames = {...frames, val: 0, elapsed: 0}

            this.image.onload = () => {
                this.width = this.image.width / this.frames.max
                this.height = this.image.height / this.frames.max
            }
            this.animate = animate 
            this.sprites = sprites
            this.opacity = 1 
            this.rotation = rotation
        }
        draw() {
            ctx.save()
            ctx.translate(this.position.x + this.width / 2, this.position.y + this.height / 2)
            ctx.rotate(this.rotation)
            ctx.translate(-this.position.x - this.width / 2, -this.position.y - this.height / 2)
            ctx.globalAlpha = this.opacity
            ctx.drawImage(
                this.image,
                this.frames.val * this.width,
                0,
                this.image.width / this.frames.max,
                this.image.height,
                this.position.x,
                this.position.y,
                this.image.width / this.frames.max,
                this.image.height
            )
            ctx.restore()

            if(!this.animate) return 

            if(this.frames.max > 1){
                this.frames.elapsed++
            }

            if(this.frames.elapsed % this.frames.hold === 0){
                if(this.frames.val < this.frames.max - 1) this.frames.val++
                else this.frames.val = 0 
            }
        }
        
    }

    class Monster extends Sprite {
        constructor({ position, velocity, image, frames = { max: 1, hold: 10 }, sprites, animate = false, rotation = 0, isEnemy = false, name, attacks }){
            super({
                position, velocity, image, frames, sprites, animate, rotation
            })
            this.isEnemy = isEnemy
            this.name = name 
            this.health = 100 
            this.attacks = attacks
        }
        attack({ attack, recipient, renderedSprites }) {
            document.querySelector('#dialouge-box').style.display = 'block'
            document.querySelector('#dialouge-box').innerHTML = `${this.name} used ${attack.name}!`

            let healthBear = this.isEnemy ? '.charizard-health2' : '.elon-health2'
            this.health -= attack.damage
            let movementDistance = this.isEnemy ? -20 : 20
            const tl = gsap.timeline()

            let rotation = this.isEnemy ? -2.2 : 1 

            switch(attack.name) {
                case 'Flamethrower':
                    const flamethrowerImage = new Image()
                    flamethrowerImage.src = './moves/flamethrower.png'
                    const flamethrower = new Sprite({
                        position: {
                            x: this.position.x,
                            y: this.position.y,
                        },
                        image: flamethrowerImage,
                        frames: {
                            max: 4,
                            hold: 10 
                        },
                        animate: true,
                        rotation
                    })

                    // renderedSprites.push(flamethrower)
                    renderedSprites.splice(1, 0, flamethrower)

                    gsap.to(flamethrower.position, {
                        x: recipient.position.x,
                        y: recipient.position.y,
                        onComplete: () => {
                            //enemy gets hit
                            gsap.to(healthBear, {
                                width: `${this.health}%`
                            })
                            gsap.to(recipient.position, {
                                x: recipient.position.x + 10,
                                yoyo: true,
                                repeat: 5,
                                duration: 0.08
                            })
                            gsap.to(recipient, {
                                opacity: 0, 
                                repeat: 5, 
                                yoyo: true, 
                                duration: 0.08 
                            })
                            // renderedSprites.pop() 
                            renderedSprites.splice(1, 1)
                        }
                    })
                    break; 

                    case 'Dragon Pulse':
                        const dragonPulseImage = new Image()
                        dragonPulseImage.src = './moves/dragonpulse.png'
                        const dragonPulse = new Sprite({
                            position: {
                                x: this.position.x,
                                y: this.position.y,
                            },
                            image: dragonPulseImage,
                            frames: {
                                max: 4,
                                hold: 10 
                            },
                            animate: true 
                        })
    
                        renderedSprites.push(dragonPulse)
                        // renderedSprites.splice(1, 0, dragonPulse)
    
                        gsap.to(dragonPulse.position, {
                            x: recipient.position.x,
                            y: recipient.position.y,
                            onComplete: () => {
                                //enemy gets hit
                                gsap.to(healthBear, {
                                    width: `${this.health}%`
                                })
                                gsap.to(recipient.position, {
                                    x: recipient.position.x + 10,
                                    yoyo: true,
                                    repeat: 5,
                                    duration: 0.08
                                })
                                gsap.to(recipient, {
                                    opacity: 0, 
                                    repeat: 5, 
                                    yoyo: true, 
                                    duration: 0.08 
                                })
                                renderedSprites.pop() 
                                // renderedSprites.slice(1, 1)
                            }
                        })
                        break; 
                    
                case 'Slash':
                // const tl = gsap.timeline()

            // let movementDistance = this.isEnemy ? -20 : 20

            tl.to(this.position, {
                x: this.position.x - movementDistance
            })
            .to(this.position, {
                x: this.position.x + movementDistance * 2,
                duration: .1,
                onComplete: () => {
                    //enemy gets hit 
                    gsap.to(healthBear, {
                        width: `${this.health}%`
                    })

                    gsap.to(recipient.position, {
                        x: recipient.position.x + 10,
                        yoyo: true,
                        repeat: 5,
                        duration: 0.08 
                    })
                }
            })
            .to(this.position, {
                x: this.position.x 
            })
            gsap.to(recipient, {
                opacity: 0,
                repeat: 5,
                yoyo: true,
                duration: 0.2 
            })
                    break;

                case 'Aerial Ace':
                    tl.to(this.position, {
                        x: this.position.x - movementDistance
                    })
                    .to(this.position, {
                        x: this.position.x + movementDistance * 2,
                        duration: .1,
                        onComplete: () => {
                            //enemy gets hit
                            gsap.to(healthBear, {
                                width: `${this.health}%`
                            })
                            gsap.to(recipient.position, {
                                x: recipient.position.x + 10,
                                yoyo: true,
                                repeat: 5,
                                duration: 0.08
                            })
                        }
                    })
                    .to(this.position, {
                        x: this.position.x 
                    })
                    gsap.to(recipient, {
                        opacity: 0,
                        repeat: 5,
                        yoyo: true,
                        duration: 0.2
                    })
                        break;
                
            }
            
            
        }
    }

    // const player = ctx.drawImage(playerImage, 0, 0, playerImage.width/4, playerImage.height, canvas.width/2 - (playerImage.width/4)/4, canvas.height/2 - playerImage.height/2, playerImage.width/4, playerImage.height)

    const player = new Sprite({
        position: {
            x: canvas.width / 2 - 192 / 4 / 2,
            y: canvas.height / 2 - 68 / 4
        },
        image: playerImage,
        frames: {
            max: 4,
            hold: 10 
        },
        sprites: {
            up: playerUpImage,
            left: playerLeftImage,
            right: playerRightImage,
            down: playerImage
        }
    })

    const background = new Sprite({
        position: {
            x: offset.x,
            y: offset.y
        },
        image
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



    const movables = [background, ...boundaries, ...battleZones]

    function rectangularCollision({rectangle1, rectangle2}){
        return(
            rectangle1.position.x + rectangle1.width >= rectangle2.position.x && 
            rectangle1.position.x <= rectangle2.position.x + rectangle2.width &&
            rectangle1.position.y <= rectangle2.position.y + rectangle2.height &&
            rectangle1.position.y + rectangle1.height >= rectangle2.position.y
        )
    }

    const battle = {
        initiated: false 
    }

    //animate player sprite
    function animate(){
        const animationID = window.requestAnimationFrame(animate)
        background.draw()
        boundaries.forEach(boundary => {
            boundary.draw()
            
        })
        battleZones.forEach(battleZones => {
            battleZones.draw()
        })
        player.draw()

        let moving = true 
        player.animate = false 


        if(battle.initiated) return 

        // activate battle 
        if(keys.w.pressed || keys.a.pressed || keys.s.pressed || keys.d.pressed){
            for(let i in battleZones){
                const battleZone = battleZones[i]
                const overlappingArea = 
                (Math.min(
                    player.position.x + player.width,
                    battleZone.position.x + player.width
                ) - 
                    Math.max(player.position.x, battleZone.position.x)) *
                (Math.min(
                    player.position.y + player.height,
                    battleZone.position.y + battleZone.height
                ) - 
                    Math.max(player.position.y, battleZone.position.y))
                if(rectangularCollision({
                    rectangle1: player,
                    rectangle2: battleZone
                }) &&
                overlappingArea > (player.width * player.height) / 2
                && Math.random() < 0.01
                ) {
                    // console.log('activate battle')
                     //deactivate current animation loop 
                     window.cancelAnimationFrame(animationID)
                    //  console.log(animationID)

                    battle.initiated = true 
                    gsap.to('.overlapping-div', {
                        opacity: 1,
                        repeat: 3,
                        yoyo: true,
                        duration: 0.4,
                        onComplete(){
                            gsap.to('.overlapping-div', {
                                opacity: 1,
                                duration: 0.4,
                                onComplete() {
                                    //activate new animation loop
                                    animateBattle()
                                    gsap.to('.overlapping-div', {
                                        opacity: 0,
                                        duration: 0.4 
                                    })
                                }
                            })

                           
                        }
                    })
                    break 
                }
            }
        }

        
        if(keys.w.pressed && lastKey === 'w'){
            player.animate = true 
            player.image = player.sprites.up

            for(let i in boundaries){
                const boundary = boundaries[i]
                if(rectangularCollision({
                    rectangle1: player,
                    rectangle2: {...boundary, position: {
                        x: boundary.position.x,
                        y: boundary.position.y + 3 
                    }
                }
                })
                ) {
                    // console.log('colliding up')
                moving = false 
                    break 
                }
            }

            if(moving)
            movables.forEach((movable) => {movable.position.y += 3})
            return;
        }
        if(keys.a.pressed && lastKey === 'a'){
            player.animate = true 
            player.image = player.sprites.left
            for(let i in boundaries){
                const boundary = boundaries[i]
                if(rectangularCollision({
                    rectangle1: player,
                    rectangle2: {...boundary, position: {
                        x: boundary.position.x + 3,
                        y: boundary.position.y 
                    }
                }
                })
                ) {
                    // console.log('colliding left')
                moving = false 
                    break 
                }
            }

            if(moving)
            movables.forEach((movable) => {movable.position.x += 3})
            return;
        }
        if(keys.s.pressed && lastKey === 's'){
            player.animate = true 
            player.image = player.sprites.down
            for(let i in boundaries){
                const boundary = boundaries[i]
                if(rectangularCollision({
                    rectangle1: player,
                    rectangle2: {...boundary, position: {
                        x: boundary.position.x,
                        y: boundary.position.y - 3 
                    }
                }
                })
                ) {
                    // console.log('colliding down')
                moving = false 
                    break 
                }
            }

            if(moving)
            movables.forEach((movable) => {movable.position.y -= 3})
            return;
        }
        if(keys.d.pressed && lastKey === 'd'){
            player.animate = true 
            player.image = player.sprites.right
            for(let i in boundaries){
                const boundary = boundaries[i]
                if(rectangularCollision({
                    rectangle1: player,
                    rectangle2: {...boundary, position: {
                        x: boundary.position.x - 3,
                        y: boundary.position.y 
                    }
                }
                })
                ) {
                    // console.log('colliding right')
                moving = false 
                    break 
                }
            }

            if(moving)
            movables.forEach((movable) => {movable.position.x -= 3})
        }
        // else if(keys.a.pressed && lastKey === 'a') {background.position.x += 3}
        // else if(keys.s.pressed && lastKey === 's') {background.position.y -= 3}
        // else if(keys.d.pressed && lastKey === 'd') {background.position.x -= 3}
    }
    // animate()

    //battle background image 
    const battleBackgroundImage = new Image()
    battleBackgroundImage.src = './pokemonMap/battleBackground.png'
    const battleBackground = new Sprite({
        position: {
            x: 0,
            y: 0
        },
        image: battleBackgroundImage
    })

    //elon (enemy) image
    const elon = new Monster(monsters.Elon) 
    //charizard (hero) image
    const charizard = new Monster(monsters.Charizard)

    const renderedSprites = [elon, charizard]

    charizard.attacks.forEach(attack => {
        const button = document.createElement('button')
        button.innerHTML = attack.name
        document.querySelector('#attack-box').append(button)
    })


    function animateBattle(){
        window.requestAnimationFrame(animateBattle)
        // console.log('animating battle')
        battleBackground.draw()
        // elon.draw()
        // charizard.draw()

        renderedSprites.forEach((sprite) => {
            sprite.draw()
        })
    }
    
    // animate()
    animateBattle()

    const queue = []

    //event listeners for buttons (attack)
    document.querySelectorAll('button').forEach(button => {
        button.addEventListener('click', (e) => {
            const selectedAttack = attacks[e.currentTarget.innerHTML]
            charizard.attack({ 
                attack: selectedAttack,
                recipient: elon,
                renderedSprites
            })

            const randomAttack = elon.attacks[Math.floor(Math.random() * elon.attacks.length)]

            queue.push(() => {
                elon.attack({ 
                    attack: randomAttack,
                    recipient: charizard,
                    renderedSprites
                })
            })
        })
    })

    document.querySelector('#dialouge-box').addEventListener('click', (e) => {
        if(queue.length > 0){
            queue[0]()
            queue.shift()
        } else e.currentTarget.style.display = 'none' 
    })



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


    return (
        <>   

            <div className="display-block">
                <div className="overlapping-div" />
            </div>

        </>
    );


};