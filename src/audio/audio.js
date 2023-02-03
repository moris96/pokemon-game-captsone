import {Howl, Howler} from 'howler';

const audio = {
    Map: new Howl({
        src: './music/undellatown.mp3',
        html5: true,
        volume: 0.02
    }),
    initBattle: new Howl({
        src: '/music/init.mp3',
        html5: true,
        volume: 0.05
    }),
    battle: new Howl({
        src: '/music/reshiram.mp3',
        html5: true,
        volume: 0.05
    })
}


export { audio }