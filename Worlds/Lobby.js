Enum.worlds.Lobby = Lobby;

function Lobby( stage ) {
    var self = this;
    GameObject( self );
    this.parent = stage;
    
    stage.airDensity = 0.02;
    
    stage.gravityType = Enum.gravity.global;
    stage.gravity = Vector2.new(0,0);
    //stage.gravity = Vector2.new(canvas.width/2,canvas.height/2);
    
    stage.name = "TankArena";
    
    stage.gridSize = Vector2.new(50, 50);
    
    
    
    
    var vec = (v1, v2) => {
        return Vector2.new(
            v2.x - v1.x,
            v2.y - v1.y
        )
    }
    var DotProduct = (v1, v2) => {
        return v1.x * v2.x + v1.y * v2.y;
    }
    
    
    debugObject = new EmptyObject({position: Vector2.new(100, 100)})
    //debugObject.parent = stage;
    debugObject.size = Vector2.new(100, 50);
    
    var dot1 = new Dot({position: Vector2.new(200, 200)})
    var dot2 = new Dot({position: Vector2.new(400, 200)})
    var dot3 = new Dot({position: Vector2.new(200, 500)})
    
    dot1.text = "1";
    dot2.text = "2";
    dot3.text = "3";
    
    dot1.parent = dot2.parent = dot3.parent = stage;
    
    var dots = [
        dot1,
        dot2,
        dot3,
    ];
}






















