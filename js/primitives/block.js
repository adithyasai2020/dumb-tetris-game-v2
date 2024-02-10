class Block{
    constructor(row, col, color, blockSize, direction = {x:1, y:1}){
        this.row = row
        this.col = col
        this.color = color
        this.blockSize = blockSize
        this.direction = direction
    };

    draw(ctx, color = this.color){
        ctx.strokeStyle = colors.white; 
        ctx.lineWidth = 1;
        ctx.fillStyle = color;
        ctx.fillRect(this.col*this.blockSize,
                        this.row*this.blockSize,
                        this.blockSize * this.direction.y,
                        this.blockSize*this.direction.x
                        );
        ctx.strokeRect(this.col*this.blockSize, 
                           this.row*this.blockSize, 
                           this.blockSize * this.direction.y, 
                           this.blockSize * this.direction.x
                           );
    }

}