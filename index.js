const ball = document.querySelector("#ball")
const playArea = document.querySelector(".play-area")
const paddleLeft = document.querySelector("#paddleLeft")
const paddleRight = document.querySelector("#paddleRight")

const playAreaBounds = playArea.getBoundingClientRect()


let playing = true

play()

async function play() {
    enableInput()

    let x, y
    let theta = launchAngle()

    // initial ball position
    x = ball.offsetLeft
    y = ball.offsetTop

    // initial velocity 2
    let v = 2

    let dx, dy

    setDxDy()

    difficultySetting()

    while (playing) {
        await delay(1)

        update()

        ball.style.left = x + "px"
        ball.style.top = y + "px"


        detectCollision()
    }

    function setDxDy() {
        dx = Math.sqrt(v) * Math.cos(theta * Math.PI / 180)
        dy = Math.sqrt(v) * Math.sin(theta * Math.PI / 180)
    }

    function update() {
        x += dx

        // to prevent overshoot 0 <= y <= playAreaBounds.height - ball.clientHeight
        y = Math.min(playAreaBounds.height - ball.clientHeight, Math.max(0, y + dy))
    }

    function detectCollision() {

        // top wall
        if (y <= 0) {
            if (theta >= 270 && theta <= 360)
                theta -= 270
            else
                theta -= 90

            setDxDy()
        }

        // bottom wall
        if (y + ball.clientHeight >= playAreaBounds.height) {
            if (theta >= 0 && theta <= 90)
                theta += 270
            else
                theta += 90

            setDxDy()
        }

        // add randomness to the angle of reflection after the ball is bounced by the paddles 

        // right wall
        if (x + ball.clientWidth + paddleRight.clientWidth >= playAreaBounds.width && y >= paddleRight.offsetTop && y <= paddleRight.offsetTop + paddleRight.getBoundingClientRect().height) {
            let angles = []

            // 25 is sybtracted to get safe angles and prevent tan(90) or tan(0)
            angles.push(randomIntFromInterval(205, 245))
            angles.push(randomIntFromInterval(115, 155))

            // generate either a 0 or 1
            let choice = Math.round(Math.random())

            theta = angles[choice]

            setDxDy()
        }

        if (x >= playAreaBounds.width)
            playing = false

        // left wall
        if (x <= paddleLeft.clientWidth && y >= paddleLeft.offsetTop && y <= paddleLeft.offsetTop + paddleLeft.getBoundingClientRect().height) {
            let angles = []
            angles.push(randomIntFromInterval(285, 335))
            angles.push(randomIntFromInterval(25, 65))

            // generate either a 0 or 1
            let choice = Math.round(Math.random())

            theta = angles[choice]

            setDxDy()
        }

        if (x <= -ball.clientWidth)
            playing = false

    }

    function difficultySetting() {
        // increase speed after 5s
        let interval = 5000

        setInterval(() => {
            v += 2
        }, interval);
    }

    function launchAngle() {
        let angles = [225, 135, 45, 315]

        let choice = Math.round(Math.random() * 3)

        return angles[choice]
    }
}

function enableInput() {
    const dh = 60

    var keyPressed = { 'w': false, 's': false, 'i': false, 'k': false }

    onkeydown = (e) => {
        if (keyPressed[e.key] != null)
            keyPressed[e.key] = true

        onkeyup = (e) => {
            if (keyPressed[e.key] != null)
                keyPressed[e.key] = false
        };

        if (keyPressed['w']) {
            if (paddleLeft.offsetTop - dh <= 0)
                paddleLeft.style.top = 0;
            else
                paddleLeft.style.top = paddleLeft.offsetTop - dh + "px";
        }
        if (keyPressed['s']) {
            if (paddleLeft.offsetTop + paddleLeft.getBoundingClientRect().height + dh >= playAreaBounds.height)
                paddleLeft.style.top = playAreaBounds.height - paddleLeft.getBoundingClientRect().height - 5 + "px"
            else
                paddleLeft.style.top = paddleLeft.offsetTop + dh + "px";
        }


        if (keyPressed['i']) {
            if (paddleRight.offsetTop - dh <= 0)
                paddleRight.style.top = 0;
            else
                paddleRight.style.top = paddleRight.offsetTop - dh + "px";
        }
        if (keyPressed['k']) {
            if (paddleRight.offsetTop + paddleRight.getBoundingClientRect().height + dh >= playAreaBounds.height)
                paddleRight.style.top = playAreaBounds.height - paddleRight.getBoundingClientRect().height - 5 + "px"
            else
                paddleRight.style.top = paddleRight.offsetTop + dh + "px";
        }
    }

}


function delay(n) {
    return new Promise(function (resolve) {
        setTimeout(resolve, n);
    });
}


function gradient(degress) {
    return Math.tan(degress * Math.PI / 180)
}

function randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}