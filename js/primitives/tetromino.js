class tetromino{
    constructor(origin, locations, color,  size = blockSize){
        this.locations = locations
        this.direction = {x:1, y:1}
        this.origin = origin
        this.color = color
        this.blocks = locations.map(loc => new Block(loc.x + this.origin.x, loc.y + this.origin.y,  this.color, size))    
           
    }
    // copy(obj){
    //     const parsed = JSON.parse(JSON.stringify(obj));
    //     console.log(obj, obj.origin, {x:obj.origin.x, y:obj.origin.y});

    //     const piece = new tetromino({x:obj.origin.x, y:obj.origin.y}, parsed.locations, parsed.color, parsed.blockSize);
    //     piece.direction = parsed.direction;
    //     // console.log({x:obj.origin.x, y:obj.origin.y});
    //     // console.log("parsed = ",obj,  parsed);
    //     // console.log("copy in tetromino : ", piece, obj);
    //     return piece;
    // }
    changeOrigin(vertex){
        this.blocks.forEach(block=>{
            // let r = block.row
            // let c = block.col
            block.row = block.row - this.origin.x
            block.col = block.col - this.origin.y
            block.direction = this.direction
        })
        this.origin = vertex
        this.blocks.forEach(block=>{
            // let r = block.row
            // let c = block.col
            block.row = block.row + this.origin.x
            block.col = block.col + this.origin.y
            block.direction = this.direction
        })
    }

    rot90(){
        this.direction = {x: - this.direction.y, y: this.direction.x}

        this.blocks.forEach(block=>{
            let r = block.row
            let c = block.col
            block.row = this.origin.x - (c - this.origin.y)
            block.col = this.origin.y + (r - this.origin.x)
            block.direction = this.direction
        })


    }

    draw(ctx){
        this.blocks.forEach(element => {
            element.draw(ctx, this.color)
        });
    }
}