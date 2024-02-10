class Engine{
    constructor(){
        this.weights = [1.0032, -4.98402, 10.77654, 2.549834];

    }
    evaluate(game){
        
        const startTime = performance.now();
        const costs = [];

        const oldOrigin = game.currentlyDropping.origin;
        const oldDir = game.currentlyDropping.direction;
        let  positions = 0, bestCost = Number.MAX_SAFE_INTEGER;
        let bestOrigin = oldOrigin;
        let bestDir = oldDir;


        for(let i = 0;i<4;i++){  // here i represents the ith orientation of possible directions
            //Reverting to original position and orientation
            game.currentlyDropping.changeOrigin(oldOrigin);
            for(let j = 0;j<4;j++){
                if(game.currentlyDropping.direction.x == oldDir.x && game.currentlyDropping.direction.y == oldDir.y){
                    break;
                }
                else{
                    game.currentlyDropping.rot90();
                }
            }
            // set required orientation for this iteration
            for(let j = 0;j<i;j++){
                game.currentlyDropping.rot90();
            }

            // goto left as much as possible
            while(game.canMoveLeft()){
                game.moveLeft();
            }

            // iterating over falls of all possible orientations and positions
            // go right after every iteration and go to the down most position possible in this position and iteration
            while(true){
            
                const prevPos = game.currentlyDropping.origin;
                   
                while(game.canMoveDown()){
                    game.moveDown();
                }

                const res = game.temporaryAdd();    // Dangerous function. I am bored of clean and safe code principles. brrrrrrrrrrrrrrrr
                if(res){
                    // One of the possible falls in one particular orientation. 
                    // Write code for calculating cost of this position.
                    positions += 1;





                    const cost = this.blockedHoles(game.board) +
                                 this.weights[1] * this.checkFullRows(game.board) +
                                 this.checkAverageHeightAndBumpiness(game.board);
                    costs.push(cost);
                    
                    if(cost<=bestCost){
                        bestCost = cost;
                        bestOrigin = prevPos;
                        bestDir = i;

                    }

                    
                    
        
        
                    // Cost of fall of this orientation is calculated
                    // Game is set back to the previous position to calculate fall of next position in that orientation.
                    
                    game.temporaryRemove();    // Dangerous function  I am bored of clean and safe code principles brrrrrrrrrrrrrrrrr
                    game.currentlyDropping.changeOrigin(prevPos);
                }
    
                if(game.canMoveRight()){
                    game.moveRight();
                }
                else{
                    break;
                }
    
            }
        }
        
        // Reverting to original position

        game.currentlyDropping.changeOrigin(oldOrigin);
    
        //Reverting to original orientation
        game.currentlyDropping.changeOrigin(oldOrigin);
        for(let i = 0;i<4;i++){
            if(game.currentlyDropping.direction.x == oldDir.x && game.currentlyDropping.direction.y == oldDir.y){
                break;
            }
            else{
                game.currentlyDropping.rot90();
            }
        }
        // game.currentlyDropping.changeOrigin({x:10, y:5});
        // game.currentlyDropping.changeOrigin(oldOrigin);



        const endTime = performance.now();

  // Calculate the runtime in milliseconds
    const runtime = endTime - startTime;
    // console.log("runtime = ", runtime, " milli seconds");
    return [bestDir, bestOrigin, bestCost];
        

    }

    blockedHoles(board) {
        const visited =  [...Array(rows)].map(e => Array(columns).fill(0));
        var countOfOneCluster = 0;
        let clusterSizes = [], cluster = [];

        function dfs(i, j, count){
            if(i<0 || i>=rows)
                return;
            if(j<0 || j>=columns)
                return;
            if(board[i][j].color != colors.black)
                return;
            if(visited[i][j])
                return;

            visited[i][j] = count;
            countOfOneCluster ++;
            cluster.push([i, j]);

            dfs(i+1, j, count);
            dfs(i-1, j, count);
            dfs(i, j+1, count);
            dfs(i, j-1, count);

            

        }

        let clusterCount = 0;

        for(let i = 0;i<rows;i++){
            for(let j = 0;j<columns;j++){
                if(visited[i][j] == 0 && board[i][j].color == colors.black){
                    
                    clusterCount++;
                    dfs(i, j, clusterCount);
                    clusterSizes.push(cluster);
                    
                    cluster = [];
                }
            }
        }

        // console.log(clusterSizes);
        var linearCost = 0;
        // for(let i = 0;i<clusterSizes.length;i++){
        //     linearCost += this.countConsecutiveOccurrences(clusterSizes[i]);
        // }
        // console.log(linearCost);

    
        return this.weights[0]*clusterCount;
    }

    countTripletsWithSameSecondValue(arr) {
        let count = 0;
        const frequencyMap = {};
      
        for (const [firstValue, secondValue] of arr) {
          const key = secondValue; // Use the second value as the key
          frequencyMap[key] = (frequencyMap[key] || 0) + 1;
        }
      
        for (const key in frequencyMap) {
          const frequency = frequencyMap[key];
      
          // Calculate the number of triplets with the same second value using combination formula C(n, 3)
          if (frequency >= 3) {
            count += (frequency * (frequency - 1) * (frequency - 2)) / 6;
          }
        }
      
        return count;
    }
    countConsecutiveTripletsWithSameSecondValue(arr) {
        let count = 0;
        const frequencyMap = {};
      
        for (let i = 0; i < arr.length - 2; i++) {
          const [firstValue1, secondValue1] = arr[i];
          const [firstValue2, secondValue2] = arr[i + 1];
          const [firstValue3, secondValue3] = arr[i + 2];
      
          if (secondValue1 === secondValue2 && secondValue2 === secondValue3 && firstValue2 === firstValue1 + 1 && firstValue3 === firstValue2 + 1) {
            count++;
          }
        }
      
        return count;
    }

    countConsecutiveOccurrences(arr) {
        let count = 0;
        const frequencyMap = {};

        for (let i = 0; i < arr.length; i++) {
            let consecutiveCount = 1;
            
            while (i + consecutiveCount < arr.length && arr[i][1] === arr[i + consecutiveCount][1] && arr[i + consecutiveCount][0] === arr[i + consecutiveCount - 1][0] + 1) {
            consecutiveCount++;
            }

            if (consecutiveCount >= 3) {
            const key = arr.slice(i, i + consecutiveCount).map(pair => pair[1]).join('-');
            frequencyMap[key] = true;
            }

            i += consecutiveCount - 1;
        }

        count = Object.keys(frequencyMap).length;

        return count;
    }

    checkFullRows(board){
        let checkRow = (row)=>{
            for(let i = 0;i<row.length;i++){
                if(row[i].color == colors.black)
                    return false;
            }
            return true;
        }
        var ans = 0;
        for(let r = 0; r<board.length;r++){
            ans += checkRow(board[r]);
        }
        return ans;
    }

    checkAverageHeightAndBumpiness(board){
        let heights = [];
        for(let j = 0;j<columns;j++){
            let colHeight = 0;
            for(let i = 0;i<rows;i++){
                if(board[i][j].color != colors.black){
                    colHeight = rows - i;
                    break;
                }
            }
            heights.push(colHeight);
        }
        const avgHeight = heights.reduce((accumulator, currentValue) => accumulator + currentValue, 0)/heights.length;

        const stdDev = Math.sqrt (heights.map((e)=>(Math.pow(e-avgHeight, 2))). reduce((accumulator, currentValue) => accumulator + currentValue, 0) );

        // console.log(avgHeight, stdDev);

        return avgHeight * this.weights[2] + stdDev * this.weights[3];


    }


}