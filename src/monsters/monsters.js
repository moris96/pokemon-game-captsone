import { attacks } from "../attacks/attacks"

const charizardImage = new Image()
charizardImage.src = './pokes/charizard.png'

const elonImage = new Image()
elonImage.src = './pokes/elon.png'

const monsters = {
    Charizard: {
        position: {
            x: 200,
            y: 230
        },
        image: charizardImage,
        frames: {
            max: 4,
            hold: 30
        },
        animate: true,
        name: 'Charizard',
        attacks: [attacks.Flamethrower, attacks.DragonPulse, attacks.AerialAce, attacks.Slash]
    },

    Elon: {
        position: {
            x: 690,
            y: 50
        },
        image: elonImage,
        frames: {
            max: 4,
            hold: 30
        },
        animate: true,
        isEnemy: true, 
        name: 'Elon',
        attacks: [attacks.Flamethrower, attacks.DragonPulse, attacks.AerialAce, attacks.Slash]
    }
}


export { monsters }