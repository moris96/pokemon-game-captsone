export default function Canvas() {
    const canvas = document.querySelector('canvas')
    const ctx = canvas.getContext('2d')

    //draw canvas
    function drawCanvas() {
        canvas.width = 1024
        canvas.height = 576
        ctx.fillStyle = 'white'
        ctx.fillRect(0,0, canvas.width, canvas.height)
    }
    drawCanvas()
    
    //place images on canvas 
    function drawImage() {
        //background image
        const image = new Image()
        image.src = './pokemonMap/MapZoom.png'
        //playerDown image 
        const playerImage = new Image()
        playerImage.src = './player/playerDown.png'
        
        image.onload = () => {
            ctx.drawImage(image, -1200, -70)
            ctx.drawImage(playerImage, 0, 0, playerImage.width/4, playerImage.height, canvas.width/2 - (playerImage.width/4)/4, canvas.height/2 - playerImage.height/2, playerImage.width/4, playerImage.height)
        }
    }
    drawImage()

};