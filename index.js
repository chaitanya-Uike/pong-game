const ball = document.querySelector("#ball")
const playArea = document.querySelector(".play-area")
const paddleLeft = document.querySelector("#paddleLeft")
const paddleRight = document.querySelector("#paddleRight")

const playAreaBounds = playArea.getBoundingClientRect()


let playing = true

console.log(ball.offsetLeft, ball.offsetTop);

play()

async function play() {
    enableInput()

    let x, y, c
    let dir = 1;
    let theta = launchAngle()

    // initial ball position
    x = ball.offsetLeft
    c = getYIntercept()

    difficultySetting()

    while (playing) {
        await delay(1)

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
        if (x + ball.clientWidth + paddleRight.clientWidth >= playAreaBounds.width && y >= paddleRight.offsetTop && y <= paddleRight.offsetTop + paddleRight.getBoundingClientRect().height) {
            let angles = []

            // 25 is sybtracted to get safe angles and prevent tan(90) or tan(0)
            angles.push(randomIntFromInterval(205, 245))
            angles.push(randomIntFromInterval(115, 155))

            // generate either a 0 or 1
            let choice = Math.round(Math.random())

            theta = angles[choice]

            c = getYIntercept()
            dir *= -1

            update()
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

            c = getYIntercept()
            dir = Math.abs(dir)

            update()
        }

        if (x <= -ball.clientWidth)
            playing = false

    }

    function getYIntercept() {
        return ball.offsetTop - gradient(theta) * ball.offsetLeft
    }

    function difficultySetting() {
        // increase speed after 5s
        let interval = 5000
        let count = 0;

        const difficultyTimer = setInterval(() => {
            if (dir < 0)
                dir -= 0.2
            else
                dir += 0.2

            count++

            if (count === 10)
                clearInterval(difficultyTimer)
        }, interval);
    }

    function launchAngle() {
        let angles = [225, 135, 45, 315]

        let choice = Math.round(Math.random() * 3)
        if (choice < 1)
            dir *= -1

        return angles[choice]
    }
}

function enableInput() {
    const dy = 60

    document.addEventListener('keydown', e => {
        if (e.key === 'w') {
            if (paddleLeft.offsetTop - dy <= 0)
                paddleLeft.style.top = 0;
            else
                paddleLeft.style.top = paddleLeft.offsetTop - dy + "px";
        }
        if (e.key === 's') {
            if (paddleLeft.offsetTop + paddleLeft.getBoundingClientRect().height + dy >= playAreaBounds.height)
                paddleLeft.style.top = playAreaBounds.height - paddleLeft.getBoundingClientRect().height - 5 + "px"
            else
                paddleLeft.style.top = paddleLeft.offsetTop + dy + "px";
        }


        if (e.key === 'i') {
            if (paddleRight.offsetTop - dy <= 0)
                paddleRight.style.top = 0;
            else
                paddleRight.style.top = paddleRight.offsetTop - dy + "px";
        }
        if (e.key === 'k') {
            if (paddleRight.offsetTop + paddleRight.getBoundingClientRect().height + dy >= playAreaBounds.height)
                paddleRight.style.top = playAreaBounds.height - paddleRight.getBoundingClientRect().height - 5 + "px"
            else
                paddleRight.style.top = paddleRight.offsetTop + dy + "px";
        }
    })
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