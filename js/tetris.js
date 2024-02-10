class Tetris{
    constructor(rows, columns, blockSize){

        this.rows = rows
        this.columns = columns
        this.blockSize  = blockSize
        this.board = []
        this.currentlyDropping = null
        this.holding = null
        this.score = 0
        this.gameEnded = false
        this.engine = new Engine();

        for(let i = 0;i<this.rows;i++){
            let tmparr = []
            for(let j = 0;j<this.columns;j++){
                var bl = new Block(i, j, colors.black, this.blockSize)
                tmparr.push(bl)
                
            }
            this.board.push(tmparr)
        }

        
    }
    updateScore(element) {
        
        // const scoreElement = document.getElementById('score-value');
        if (element) {
            element.textContent = this.score;
        }

    }


    spawn(){
        if(!this.currentlyDropping){
            let randn = Math.floor(Math.random() * 7)
            
            this.currentlyDropping = new tetromino ({x:-2, y:Math.floor(columns/2)}, shapes[randn].locations, shapes[randn].color)
            
            const res = this.engine.evaluate(this);
            for(let i = 0;i<res[0];i++){
                this.currentlyDropping.rot90();
            }
            this.currentlyDropping.changeOrigin({y: res[1].y, x:this.currentlyDropping.origin.x} );               
    
            
        }
        
        
    }
    

    moveDown(){
        
        this.currentlyDropping.changeOrigin({x: this.currentlyDropping.origin.x+1, y: this.currentlyDropping.origin.y })
    }


    moveRight(){
        this.currentlyDropping.changeOrigin({x: this.currentlyDropping.origin.x, y: this.currentlyDropping.origin.y+1 })
    }


    moveLeft(){
        this.currentlyDropping.changeOrigin({x: this.currentlyDropping.origin.x, y: this.currentlyDropping.origin.y - 1 })
    }

    canRot90(){
        if(!this.currentlyDropping){
            return false;
        }
        this.currentlyDropping.rot90()
        for(let i = 0;i<4;i++){
            let r = this.currentlyDropping.blocks[i].row + (this.currentlyDropping.direction.x - 1)/2
            let c = this.currentlyDropping.blocks[i].col + (this.currentlyDropping.direction.y - 1)/2
            if(!((r>=0 && r<rows) && (c>=0 && c<columns))){
                this.currentlyDropping.rot90()
                this.currentlyDropping.rot90()
                this.currentlyDropping.rot90()
                return false;
            }
            if(   this.board[r][c].color != colors.black){
                this.currentlyDropping.rot90()
                this.currentlyDropping.rot90()
                this.currentlyDropping.rot90()
                return false;
            }
        }
        this.currentlyDropping.rot90()
        this.currentlyDropping.rot90()
        this.currentlyDropping.rot90()
        return true;
    }

    canMoveDown(){
        if(!this.currentlyDropping){
            return false;
        }
        for(let i = 0;i<4;i++){

            let r = this.currentlyDropping.blocks[i].row + (this.currentlyDropping.direction.x - 1)/2
            let c = this.currentlyDropping.blocks[i].col + (this.currentlyDropping.direction.y - 1)/2
            
            if(r + 1 >= rows){
                return false;
            }
            if(r+1 >=0 && c>=0 && c<=columns){
                if(this.board[r +1][c].color != colors.black){
                    return false;
                }
            }
            
        }
        return true;
    }

    canMoveRight(){
        if(!this.currentlyDropping){
            return false;
        }
        for(let i = 0;i<4;i++){

            let r = this.currentlyDropping.blocks[i].row + (this.currentlyDropping.direction.x - 1)/2
            let c = this.currentlyDropping.blocks[i].col + (this.currentlyDropping.direction.y - 1)/2
            


            if(c + 1 >= columns){
                return false;
            }
            if(r >=0 && c+1>=0){
                if(this.board[r][c+ 1].color != colors.black){
                    return false;
                }
            }
        }
        return true;
    }
    canMoveLeft(){
        if(!this.currentlyDropping){
            return false;
        }
        for(let i = 0;i<4;i++){

            let r = this.currentlyDropping.blocks[i].row + (this.currentlyDropping.direction.x - 1)/2
            let c = this.currentlyDropping.blocks[i].col + (this.currentlyDropping.direction.y - 1)/2
            


            if(c - 1 < 0){
                return false;
            }
            if(r >=0 && c-1< columns){
                if(this.board[r][c- 1].color != colors.black){
                    return false;
                }
            }
        }
        
        return true;
    }


    checkRow(r){
        for(let j = 0;j<columns;j++){
            if(this.board[r][j].color == colors.black){
                return false;
            }
        }
        return true;
    }

    removeFullRow(){
        let indices = []
        for(let i = 0;i<rows;i++){
            if(this.checkRow(i)){
                indices.push(i)
            }
        }
        this.score += indices.length*indices.length  * 10
        
        if(indices.length){
            let tempBoard = this.board.filter(function(element, index){
                
                return indices.indexOf(index) == -1


            })




            for(let i = 0;i<indices.length;i++){
                let temparr = []
                for(let j = 0;j<columns;j++){
                    let bl = new Block(i, j, colors.black, this.blockSize)
                    temparr.push(bl)
                }
                tempBoard.unshift(temparr)
            }
            
            for(let i = 0;i<rows;i++){
                for(let j = 0;j<columns;j++){
                    tempBoard[i][j].row = i
                    tempBoard[i][j].col = j
                }
            }
            this.board = tempBoard
        }
        
        
        
    }

    temporaryAdd(){

        // Dangerous function. Use this carefully and as less as possible. Avoid this shit.
        for(let i = 0;i<4;i++){
            let r = this.currentlyDropping.blocks[i].row + (this.currentlyDropping.direction.x - 1)/2
            let c = this.currentlyDropping.blocks[i].col + (this.currentlyDropping.direction.y - 1)/2
            
            if( r>=0 && r<rows){
                if(c>=0 && c<columns){
                    // this.board[r][c].color = this.currentlyDropping.blocks[i].color
                }
                else{

                    return false;
                }
            }
            else{
                return false;
            }
            
        }

        for(let i = 0;i<4;i++){
            let r = this.currentlyDropping.blocks[i].row + (this.currentlyDropping.direction.x - 1)/2
            let c = this.currentlyDropping.blocks[i].col + (this.currentlyDropping.direction.y - 1)/2
            
            if( r>=0 && r<rows){
                if(c>=0 && c<columns){
                    this.board[r][c].color = this.currentlyDropping.blocks[i].color
                }
                else{
                    return false;
                }
            }
            else{
                return false;
            }
            
        }
        return true;

    }

    temporaryRemove(){
        // Dangerous function. Use this carefully and as less as possible. Avoid this shit.

        for(let i = 0;i<4;i++){
            let r = this.currentlyDropping.blocks[i].row + (this.currentlyDropping.direction.x - 1)/2
            let c = this.currentlyDropping.blocks[i].col + (this.currentlyDropping.direction.y - 1)/2
            
            if( r>=0 && r<rows){
                if(c>=0 && c<columns){
                    this.board[r][c].color = colors.black;
                }
                else{
                    return false;
                }
            }
            else{
                return false;
            }
            
        }
    }

    destroyDropping(){
        for(let i = 0;i<4;i++){
            let r = this.currentlyDropping.blocks[i].row + (this.currentlyDropping.direction.x - 1)/2
            let c = this.currentlyDropping.blocks[i].col + (this.currentlyDropping.direction.y - 1)/2
            
            if( r>=0 && r<rows){
                if(c>=0 && c<columns){
                    this.board[r][c].color = this.currentlyDropping.blocks[i].color
                }
                else{
                    this.gameEnded = true
                    return false;
                }
            }
            else{
                this.gameEnded = true
                return false;
            }
            
        }
        this.currentlyDropping = null
        this.score += 4
        return true;
    }


    drawGrid(ctx) {
        for(let i = 0;i<this.rows;i++){
            for(let j = 0;j<this.columns;j++){
                this.board[i][j].draw(ctx);
            }
        }
        if(this.currentlyDropping){
            
            this.currentlyDropping.draw(ctx);
        }
    }

}