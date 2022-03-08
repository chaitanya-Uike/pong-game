const ball = document.querySelector("#ball")
const stopBtn = document.querySelector("#stop")
const playArea = document.querySelector(".play-area")

const playAreaBounds = playArea.getBoundingClientRect()


let playing = true

function delay(n) {
    return new Promise(function (resolve) {
        setTimeout(resolve, n * 1000);
    });
}


function gradient(degress) {
    return Math.tan(degress * Math.PI / 180)
}


async function play() {
    let x, y, c
    let theta = 55
    let dir = 1;

    // initial ball position
    x = ball.offsetLeft
    c = ball.offsetTop

    while (playing) {
        await delay(0.001)

        update()

        ball.style.left = x + "px"
        ball.style.top = y + "px"


        detectCollision()
    }

    function update() {
        x += dir

        // to prevent overshoot 0 <= y <= playAreaBounds.height - ball.clientHeight
        y = Math.min(playAreaBounds.height - ball.clientHeight, Math.max(0, gradient(theta) * x + c))
    }

    function detectCollision() {

        // top wall
        if (y <= 0) {
            if (theta >= 270 && theta <= 360)
                theta -= 270
            else
                theta -= 90
            c = getYIntercept()

            update()
        }

        // bottom wall
        if (y + ball.clientHeight >= playAreaBounds.height) {
            if (theta >= 0 && theta <= 90)
                theta += 270
            else
                theta += 90

            c = getYIntercept()

            update()
        }

        // add randomness to the angle of reflection after the ball is bounced by the paddles 

        // right wall
        if (x + ball.clientWidth >= playAreaBounds.width) {
            let angles = []

            // 25 is sybtracted to get safe angles and prevent tan(90) or tan(0)
            angles.push(randomIntFromInterval(205, 245))
            angles.push(randomIntFromInterval(115, 155))

            // generate either a 0 or 1
            let choice = Math.round(Math.random())

            theta = angles[choice]

            c = getYIntercept()
            dir = -1

            update()
        }

        // left wall
        if (x <= 0) {
            let angles = []
            angles.push(randomIntFromInterval(285, 335))
            angles.push(randomIntFromInterval(25, 65))

            // generate either a 0 or 1
            let choice = Math.round(Math.random())

            theta = angles[choice]

            c = getYIntercept()
            dir = 1

            update()
        }

    }

    function getYIntercept() {
        return ball.offsetTop - gradient(theta) * ball.offsetLeft
    }
}


play()

stopBtn.addEventListener("click", () => {
    playing = false
})

function randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}