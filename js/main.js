const contexts = [];
const canvases = [];
const tetrises = [];
//function to add one container
function makeContainer(i){
    const boundingDiv = document.getElementById("training-area")
    const container = document.createElement('div');
    container.classList.add('container');
    container.id = "cont"+i

    const gameContainer = document.createElement('div');
    gameContainer.classList.add('game-container');

    const canvas = document.createElement('canvas');
    canvas.id = 'grid' + i;
    canvas.classList.add('board');
    
    canvas.height = 600;
    canvas.width = canvas.height/2;
    canvases.push(canvas);
    contexts.push(canvas.getContext("2d"));
    
    blockSize = canvas.height/rows;

    gameContainer.appendChild(canvas);

    const scoreContainer = document.createElement('div');
    scoreContainer.classList.add('score-container');

    const scoreElement = document.createElement('div');
    scoreElement.classList.add('scores');
    scoreElement.id = 'score'+i;

    const scoreValue = document.createElement('span');
    scoreValue.classList.add('scoreValueclass');
    scoreValue.id = 'score-value'+i;
    scoreValue.textContent = '0';

    scoreElement.appendChild(document.createTextNode('Score: '));
    scoreElement.appendChild(scoreValue);

    scoreContainer.appendChild(scoreElement);

    container.appendChild(gameContainer);
    container.appendChild(scoreContainer);

    boundingDiv.appendChild(container);

    
    container.scrollIntoView({ behavior: 'smooth' });
}

function environment(){

    // adding containers 
    for(let i = 0;i<BATCH_SIZE;i++){
        makeContainer(i);
    }

    for(let i = 0;i<BATCH_SIZE;i++){
        var tetris = new Tetris(rows, columns, blockSize, contexts[i]);
        tetris.drawGrid(contexts[i]);
        tetrises.push(tetris);
    }
    


    document.addEventListener('keydown', function(event){
        switch (event.key) {
            case 'ArrowLeft':
                if (tetrises[0].canMoveLeft()) {
                    tetrises[0].moveLeft();
                }
                break;
            case 'ArrowRight':
                if (tetrises[0].canMoveRight()) {
                    tetrises[0].moveRight();
                }
                break;
            case 'ArrowDown':
                if (tetrises[0].canMoveDown()) {
                    tetrises[0].moveDown();
                }
                break;
            case 'Enter':
                for (let i = 0; i < 25; i++) {
                    if (tetrises[0].canMoveDown()) {
                        tetrises[0].moveDown();
                    }
                }
                break;
            case ' ':
                if (tetrises[0].canRot90()) {
                    tetrises[0].currentlyDropping.rot90();
                }
                break;
        }
        if (['ArrowLeft', 'ArrowRight', 'ArrowDown', ' '].includes(event.key)) {
            event.preventDefault();
        }
    
    })


    
    function animate() {
            for(let i = 0;i<BATCH_SIZE;i++){
                if(!tetrises[i].gameEnded){
                    var element = document.getElementById('score-value'+i);
                    if (!tetrises[i].currentlyDropping) {
                        tetrises[i].spawn();       
                    } else {
                        if (tetrises[i].canMoveDown()) {
                            tetrises[i].moveDown();
                            tetrises[i].drawGrid(contexts[i]);
                        } else {
                            let check = tetrises[i].destroyDropping();

            
                            if (!check) {
                                console.log("game ended" + i);
                            } else {
                                tetrises[i].removeFullRow();
                            }
                        }
                    }
                    tetrises[i].updateScore(element)

                }

                
        }

        var check = true;
        for(let i = 0;i<BATCH_SIZE;i++){
            if(!tetrises[i].gameEnded)check = false;
        }
        if(check == true){


            // Mutation logic

            // Don't pull random repos off the internet you idiot!
            // Have a life you idiot sandwich.


            /*
            just kidding dude.
            in this region you have the access to all the game results of the batch
            then make new population of weights with probability of reproducing proportional to the softmax of score,
            then mutate x% of population by y% .

            Literally a couple lines of code, but i choose to go on a rant bcos i don't have good time management skills either.
            */


            // Game state reset
            for(let i = 0;i<BATCH_SIZE;i++){
                tetrises[i].currentlyDropping = null;
                tetrises[i].gameEnded = false;
                tetrises[i].score = 0;
                for(let j = 0;j<rows;j++){

                    for(let k = 0;k<columns;k++){
                        tetrises[i].board[j][k].color = colors.black;
                    }
                }
            }
        }

        setTimeout(animate, 10);
    
    }
    
    
    setTimeout(animate, 800);


    
}
environment();
